import PDFDocument from 'pdfkit';
import Invoice, { getNextInvoiceNumber } from '../models/Invoice.js';
import Reservation from '../models/Reservation.js';
import Folio from '../models/Folio.js';
import Guest from '../models/Guest.js';
import HotelSettings from '../models/HotelSettings.js';
import { sendInvoiceEmail, sendPaymentReceiptEmail } from '../services/email.service.js';

const METHOD_LABELS = {
  cash:          'Cash',
  card:          'Debit / Credit Card',
  ewallet:       'E-Wallet',
  bank_transfer: 'Bank Transfer',
  other:         'Other',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildLineItems = async (reservation) => {
  const rt = reservation.roomType;
  const items = [];

  if (rt && reservation.daysOfStay) {
    const nights = reservation.daysOfStay;
    const price  = rt.price ?? 0;
    items.push({
      description: `${rt.name} × ${nights} night${nights !== 1 ? 's' : ''}`,
      quantity:    nights,
      unitPrice:   price,
      total:       +(price * nights).toFixed(2),
    });
  }

  const folios = await Folio.find({ reservationId: reservation._id }).lean();
  for (const f of folios) {
    items.push({
      description: `${f.category}: ${f.description}`,
      quantity:    1,
      unitPrice:   f.amount,
      total:       +f.amount.toFixed(2),
    });
  }

  return items;
};

const populateInvoice = (id) =>
  Invoice.findById(id)
    .populate({ path: 'reservationId', populate: [{ path: 'customerId' }, { path: 'roomType' }] })
    .populate('guestId')
    .populate('payments.recordedBy', 'fname lname');

// ─── Controllers ──────────────────────────────────────────────────────────────

export const getOrCreateInvoice = async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Return existing invoice if already created
    const existing = await populateInvoice(
      (await Invoice.findOne({ reservationId }))?._id
    );
    if (existing) return res.json({ invoice: existing });

    const reservation = await Reservation.findById(reservationId)
      .populate('customerId')
      .populate('roomType');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const settings  = await HotelSettings.findOne().lean() ?? {};
    const lineItems = await buildLineItems(reservation);
    const subtotal  = +lineItems.reduce((s, i) => s + i.total, 0).toFixed(2);
    const taxRate   = settings.taxRate ?? 0;
    const taxAmount = +(subtotal * taxRate / 100).toFixed(2);
    const total     = +(subtotal + taxAmount).toFixed(2);

    const invoice = await Invoice.create({
      invoiceNumber: await getNextInvoiceNumber(),
      reservationId,
      guestId:   reservation.customerId?._id,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountPaid: 0,
      balance:    total,
      dueDate:    reservation.departureDate,
      status:     'draft',
    });

    res.status(201).json({ invoice: await populateInvoice(invoice._id) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, amount, reference } = req.body;

    if (!method || !amount) return res.status(400).json({ message: 'method and amount are required' });

    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.status === 'paid')  return res.status(400).json({ message: 'Invoice is already fully paid' });
    if (invoice.status === 'void')  return res.status(400).json({ message: 'Cannot record payment on a voided invoice' });

    const payAmt = Math.min(+Number(amount).toFixed(2), +invoice.balance.toFixed(2));
    if (payAmt <= 0) return res.status(400).json({ message: 'Payment amount must be greater than 0' });

    invoice.payments.push({
      method,
      amount: payAmt,
      reference: reference?.trim() ?? '',
      paidAt: new Date(),
      recordedBy: req.user?._id,
    });

    invoice.amountPaid = +(invoice.amountPaid + payAmt).toFixed(2);
    invoice.balance    = +(invoice.total - invoice.amountPaid).toFixed(2);
    invoice.status     = invoice.balance <= 0 ? 'paid' : 'partial';
    if (invoice.balance < 0) invoice.balance = 0;

    await invoice.save();

    // Fire-and-forget receipt email
    const guest = await Guest.findById(invoice.guestId);
    const payment = invoice.payments[invoice.payments.length - 1];
    sendPaymentReceiptEmail(guest, invoice, payment).catch(() => {});

    res.json({ invoice: await populateInvoice(id) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const voidInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.status === 'paid') return res.status(400).json({ message: 'Cannot void a paid invoice' });
    invoice.status = 'void';
    await invoice.save();
    res.json({ invoice: await populateInvoice(invoice._id) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const invoice = await populateInvoice(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const guest = invoice.guestId;
    if (!guest?.email) return res.status(400).json({ message: 'Guest has no email address' });

    const settings = await HotelSettings.findOne().lean() ?? {};
    const pdfBuffer = await buildPDFBuffer(invoice, settings);

    await sendInvoiceEmail(guest, invoice, pdfBuffer);

    if (invoice.status === 'draft') {
      invoice.status = 'sent';
      invoice.sentAt = new Date();
      await invoice.save();
    }

    res.json({ message: 'Invoice sent', invoice: await populateInvoice(invoice._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PDF ──────────────────────────────────────────────────────────────────────

const STATUS_WATERMARK = { paid: 'PAID', void: 'VOID', partial: 'PARTIAL' };
const STATUS_COLOUR    = { paid: '#16a34a', void: '#dc2626', partial: '#d97706', draft: '#6b7280', sent: '#2563eb' };

async function buildPDFBuffer(invoice, settings) {
  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const sym  = settings.currencySymbol ?? 'RM';
    const fmt  = (n) => `${sym}${Number(n).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
    const line = (y) => doc.moveTo(50, y).lineTo(545, y).stroke('#e5e7eb');
    const W    = 495;

    // ── Watermark ──────────────────────────────────────────────────────────
    const wm = STATUS_WATERMARK[invoice.status];
    if (wm) {
      doc.save();
      doc.opacity(0.07)
         .font('Helvetica-Bold')
         .fontSize(90)
         .fillColor(STATUS_COLOUR[invoice.status] ?? '#000')
         .rotate(-40, { origin: [297, 420] })
         .text(wm, 50, 320, { align: 'center', width: W });
      doc.restore();
    }

    // ── Header ─────────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#111827')
       .text(settings.name || 'Hotel', { align: 'center' });
    if (settings.address) doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(settings.address, { align: 'center' });
    if (settings.phone)   doc.text(`Tel: ${settings.phone}`, { align: 'center' });
    if (settings.email)   doc.text(settings.email, { align: 'center' });
    doc.moveDown(0.5);
    line(doc.y); doc.moveDown(0.5);

    // ── Invoice title + meta ───────────────────────────────────────────────
    const issued   = new Date(invoice.createdAt).toLocaleDateString('en-MY', { day:'2-digit', month:'short', year:'numeric' });
    const due      = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-MY', { day:'2-digit', month:'short', year:'numeric' }) : '—';
    const statusLbl = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#111827').text('INVOICE', { align: 'center' });
    doc.moveDown(0.4);

    // Two-column meta
    const metaLeft  = 50;
    const metaRight = 320;
    const metaY     = doc.y;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#6b7280')
       .text('INVOICE NO.',   metaLeft,  metaY)
       .text('DATE ISSUED',   metaLeft,  metaY + 14)
       .text('DUE DATE',      metaLeft,  metaY + 28);
    doc.font('Helvetica').fontSize(9).fillColor('#111827')
       .text(invoice.invoiceNumber,  metaLeft  + 80, metaY)
       .text(issued,                 metaLeft  + 80, metaY + 14)
       .text(due,                    metaLeft  + 80, metaY + 28);

    doc.font('Helvetica-Bold').fontSize(9).fillColor('#6b7280')
       .text('STATUS', metaRight, metaY);
    doc.font('Helvetica-Bold').fontSize(11)
       .fillColor(STATUS_COLOUR[invoice.status] ?? '#111827')
       .text(statusLbl, metaRight + 50, metaY - 1);

    doc.y = metaY + 42;
    doc.moveDown(0.5);
    line(doc.y); doc.moveDown(0.5);

    // ── Bill To ────────────────────────────────────────────────────────────
    const guest = invoice.guestId;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#6b7280').text('BILL TO');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827')
       .text(`${guest?.firstName ?? ''} ${guest?.lastName ?? ''}`.trim() || 'Guest');
    if (guest?.email) doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(guest.email);
    if (guest?.phone) doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(guest.phone);
    const res = invoice.reservationId;
    if (res?.reservationId) {
      doc.font('Helvetica').fontSize(9).fillColor('#6b7280')
         .text(`Reservation: ${res.reservationId}`);
    }
    doc.moveDown(0.8);
    line(doc.y); doc.moveDown(0.5);

    // ── Line items table ───────────────────────────────────────────────────
    const COL = { desc: 50, qty: 320, unit: 375, total: 460 };
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#6b7280')
       .text('DESCRIPTION', COL.desc, doc.y)
       .text('QTY',         COL.qty,  doc.y - 9, { width: 40, align: 'right' })
       .text('UNIT PRICE',  COL.unit, doc.y - 9, { width: 70, align: 'right' })
       .text('TOTAL',       COL.total,doc.y - 9, { width: 85, align: 'right' });
    doc.moveDown(0.3);
    line(doc.y); doc.moveDown(0.3);

    for (const item of invoice.lineItems) {
      const y = doc.y;
      doc.font('Helvetica').fontSize(9).fillColor('#111827')
         .text(item.description, COL.desc, y, { width: 260 })
         .text(String(item.quantity), COL.qty,  y, { width: 40,  align: 'right' })
         .text(fmt(item.unitPrice),  COL.unit, y, { width: 70,  align: 'right' })
         .text(fmt(item.total),      COL.total,y, { width: 85,  align: 'right' });
      doc.moveDown(0.5);
    }

    doc.moveDown(0.2); line(doc.y); doc.moveDown(0.3);

    // Totals
    const totRow = (label, val, bold = false) => {
      const font = bold ? 'Helvetica-Bold' : 'Helvetica';
      const y = doc.y;
      doc.font(font).fontSize(bold ? 10 : 9).fillColor('#111827')
         .text(label, 350, y, { width: 110, align: 'right' })
         .text(val,   460, y, { width: 85,  align: 'right' });
      doc.moveDown(0.4);
    };

    totRow('Subtotal', fmt(invoice.subtotal));
    if (invoice.taxRate > 0) totRow(`Tax (${invoice.taxRate}%)`, fmt(invoice.taxAmount));
    doc.moveDown(0.1); line(doc.y); doc.moveDown(0.3);
    totRow('TOTAL', fmt(invoice.total), true);
    if (invoice.amountPaid > 0) {
      totRow('Amount Paid', `(${fmt(invoice.amountPaid)})`);
      doc.moveDown(0.1); line(doc.y); doc.moveDown(0.3);
      totRow('BALANCE DUE', fmt(invoice.balance), true);
    }

    // ── Payment history ────────────────────────────────────────────────────
    if (invoice.payments?.length > 0) {
      doc.moveDown(0.8);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#6b7280').text('PAYMENT HISTORY');
      doc.moveDown(0.3);
      line(doc.y); doc.moveDown(0.3);
      for (const p of invoice.payments) {
        const y = doc.y;
        const date = new Date(p.paidAt).toLocaleDateString('en-MY', { day:'2-digit', month:'short', year:'numeric' });
        doc.font('Helvetica').fontSize(8).fillColor('#111827')
           .text(date,                         50,  y, { width: 80 })
           .text(METHOD_LABELS[p.method] ?? p.method, 135, y, { width: 130 })
           .text(p.reference || '—',           270, y, { width: 130 })
           .text(fmt(p.amount),                460, y, { width: 85, align: 'right' });
        doc.moveDown(0.45);
      }
    }

    // ── Bank transfer instructions (if balance > 0 and not void) ──────────
    if (invoice.balance > 0 && invoice.status !== 'void' && invoice.status !== 'paid') {
      doc.moveDown(0.8);
      const bkY = doc.y;
      doc.rect(50, bkY, W, 80).fillAndStroke('#f0fdf4', '#bbf7d0');
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#166534')
         .text('BANK TRANSFER DETAILS', 62, bkY + 10);
      doc.font('Helvetica').fontSize(8.5).fillColor('#14532d')
         .text(`Bank:            ${settings.bankName || 'Maybank'}`,          62, bkY + 24)
         .text(`Account Name:    ${settings.bankAccountName || 'Jack Chong Wei Jie'}`, 62, bkY + 36)
         .text(`Account Number:  ${settings.bankAccountNumber || '112754096256'}`,     62, bkY + 48)
         .text(`Reference:       ${invoice.invoiceNumber}`,                   62, bkY + 60);
      doc.y = bkY + 88;
    }

    // ── Footer ─────────────────────────────────────────────────────────────
    doc.moveDown(1);
    doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
       .text('Thank you for your business. Please include the invoice number as payment reference.', { align: 'center' });

    doc.end();
  });
}

export const getInvoicePDF = async (req, res) => {
  try {
    const invoice  = await populateInvoice(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    const settings = await HotelSettings.findOne().lean() ?? {};
    const buffer   = await buildPDFBuffer(invoice, settings);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.send(buffer);
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: error.message });
  }
};
