import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import HotelSettings from '../models/HotelSettings.js';

// ─── Transport selection ──────────────────────────────────────────────────────
// Priority: Resend (if RESEND_API_KEY set) → nodemailer SMTP → skip

const getResend = () =>
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const getNodemailer = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT ?? '587'),
    secure: SMTP_PORT === '465',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

const fromAddress = () =>
  process.env.FROM_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@hotel.local';

const send = async ({ to, subject, html, attachments = [] }) => {
  const resend = getResend();
  if (resend) {
    await resend.emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
      attachments: attachments.map(a => ({
        filename: a.filename,
        content:  a.content,   // Buffer or base64
        contentType: a.contentType,
      })),
    });
    return;
  }
  const smtp = getNodemailer();
  if (smtp) {
    await smtp.sendMail({ from: fromAddress(), to, subject, html, attachments });
    return;
  }
  console.warn('[email] No transport configured — set RESEND_API_KEY or SMTP_HOST.');
};

// ─── Hotel settings helper ────────────────────────────────────────────────────

const getHotel = async () => {
  try {
    return (await HotelSettings.findOne().lean()) ?? {};
  } catch {
    return {};
  }
};

// ─── HTML template helpers ────────────────────────────────────────────────────

const baseLayout = ({ hotelName = 'Hotel', address = '', body, accent = '#1d4ed8' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">

    <div style="background:${accent};border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px">${hotelName}</h1>
    </div>

    <div style="background:#ffffff;padding:36px 32px;border-radius:0 0 12px 12px;box-shadow:0 1px 3px rgba(0,0,0,.08)">
      ${body}
    </div>

    <div style="text-align:center;padding:20px 0 0;color:#9ca3af;font-size:12px;line-height:1.8">
      ${hotelName}${address ? ' &bull; ' + address : ''}<br>
      This is an automated message — please do not reply directly to this email.
    </div>
  </div>
</body>
</html>`;

const greeting = (firstName) =>
  `<p style="margin:0 0 20px;font-size:15px;color:#374151">Dear <strong>${firstName}</strong>,</p>`;

const infoTable = (rows) => `
<table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
  ${rows.map(([label, value], i) => `
  <tr>
    <td style="padding:10px 14px;background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'};color:#6b7280;white-space:nowrap;width:40%;border-radius:${i === 0 ? '8px 0 0' : i === rows.length - 1 ? '0 0 0 8px' : '0'}">${label}</td>
    <td style="padding:10px 14px;background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'};color:#111827;font-weight:500;border-radius:${i === 0 ? '0 8px 0 0' : i === rows.length - 1 ? '0 0 8px 0' : '0'}">${value ?? '—'}</td>
  </tr>`).join('')}
</table>`;

const badge = (text, color) =>
  `<span style="display:inline-block;background:${color};color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:.4px">${text}</span>`;

const divider = () => '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">';

const signOff = (hotelName) =>
  `<p style="margin:24px 0 0;font-size:14px;color:#6b7280">Warm regards,<br><strong style="color:#111827">${hotelName}</strong></p>`;

// ─── Email functions ──────────────────────────────────────────────────────────

export const sendBookingConfirmation = async (guest, reservation, roomTypeName) => {
  if (!guest?.email) return;
  const hotel   = await getHotel();
  const nights  = reservation.daysOfStay ?? 1;
  const arrival = new Date(reservation.arrivalDate).toLocaleDateString('en-MY', { weekday:'short', day:'2-digit', month:'long', year:'numeric' });
  const depart  = new Date(reservation.departureDate).toLocaleDateString('en-MY', { weekday:'short', day:'2-digit', month:'long', year:'numeric' });

  await send({
    to: guest.email,
    subject: `Booking Confirmed – ${reservation.reservationId} · ${hotel.name || 'Hotel'}`,
    html: baseLayout({
      hotelName: hotel.name, address: hotel.address, accent: '#1d4ed8',
      body: `
        ${greeting(guest.firstName)}
        <p style="margin:0 0 4px;font-size:15px;color:#374151">Your booking has been confirmed.</p>
        <p style="margin:0 0 20px;font-size:13px;color:#6b7280">Please save this email as your booking reference.</p>
        ${badge('CONFIRMED', '#16a34a')}
        ${infoTable([
          ['Reservation ID', `<strong style="font-family:monospace">${reservation.reservationId}</strong>`],
          ['Room Type',       roomTypeName ?? '—'],
          ['Check-In',        arrival],
          ['Check-Out',       depart],
          ['Nights',          nights],
          ['Adults',          reservation.numAdults],
        ])}
        ${divider()}
        <p style="margin:0;font-size:13px;color:#6b7280">
          <strong>Check-in time:</strong> ${hotel.checkInTime || '14:00'} &nbsp;|&nbsp;
          <strong>Check-out time:</strong> ${hotel.checkOutTime || '11:00'}
        </p>
        ${hotel.phone ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280">For enquiries: <a href="tel:${hotel.phone}" style="color:#2563eb">${hotel.phone}</a></p>` : ''}
        ${signOff(hotel.name || 'Hotel Team')}
      `,
    }),
  }).catch(() => {});
};

export const sendCheckInConfirmation = async (guest, reservation, roomNumber) => {
  if (!guest?.email) return;
  const hotel  = await getHotel();
  const depart = new Date(reservation.departureDate).toLocaleDateString('en-MY', { weekday:'short', day:'2-digit', month:'long', year:'numeric' });

  await send({
    to: guest.email,
    subject: `Welcome! You're checked in – Room ${roomNumber}`,
    html: baseLayout({
      hotelName: hotel.name, address: hotel.address, accent: '#0f766e',
      body: `
        ${greeting(guest.firstName)}
        <p style="margin:0 0 20px;font-size:15px;color:#374151">You have successfully checked in. Enjoy your stay!</p>
        ${badge('CHECKED IN', '#0f766e')}
        ${infoTable([
          ['Room Number',  `<strong style="font-size:18px">#${roomNumber}</strong>`],
          ['Reservation',  reservation.reservationId],
          ['Check-Out',    depart],
          ['Nights',       reservation.daysOfStay],
        ])}
        ${divider()}
        <p style="margin:0;font-size:13px;color:#6b7280">
          <strong>Check-out time:</strong> ${hotel.checkOutTime || '11:00'}.
          Late check-out available on request.
        </p>
        ${hotel.phone ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280">Front desk: <a href="tel:${hotel.phone}" style="color:#2563eb">${hotel.phone}</a></p>` : ''}
        ${signOff(hotel.name || 'Hotel Team')}
      `,
    }),
  }).catch(() => {});
};

export const sendCheckOutSummary = async (guest, reservation) => {
  if (!guest?.email) return;
  const hotel  = await getHotel();
  const nights = reservation.daysOfStay ?? 1;
  const symbol = hotel.currencySymbol ?? 'RM';
  const total  = reservation.totalPrice ? `${symbol}${Number(reservation.totalPrice).toFixed(2)}` : '—';

  await send({
    to: guest.email,
    subject: `Thank you for staying with us – ${hotel.name || 'Hotel'}`,
    html: baseLayout({
      hotelName: hotel.name, address: hotel.address, accent: '#374151',
      body: `
        ${greeting(guest.firstName)}
        <p style="margin:0 0 20px;font-size:15px;color:#374151">
          Thank you for your stay! We hope you had a wonderful experience and look forward to welcoming you back.
        </p>
        ${badge('CHECKED OUT', '#374151')}
        ${infoTable([
          ['Reservation',  reservation.reservationId],
          ['Nights stayed', nights],
          ['Total',         total],
        ])}
        ${divider()}
        <p style="margin:0;font-size:13px;color:#6b7280">
          Your invoice will be sent separately. For any queries regarding your bill,
          please contact us${hotel.email ? ` at <a href="mailto:${hotel.email}" style="color:#2563eb">${hotel.email}</a>` : ''}.
        </p>
        ${signOff(hotel.name || 'Hotel Team')}
      `,
    }),
  }).catch(() => {});
};

export const sendInvoiceEmail = async (guest, invoice, pdfBuffer) => {
  if (!guest?.email) return;
  const hotel  = await getHotel();
  const symbol = hotel.currencySymbol ?? 'RM';
  const fmt    = (n) => `${symbol}${Number(n).toFixed(2)}`;
  const res    = typeof invoice.reservationId === 'object' ? invoice.reservationId : null;

  const bankRows = (hotel.bankName || hotel.bankAccountNumber) ? `
    ${divider()}
    <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151">Bank Transfer Details</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;font-size:13px;color:#14532d;line-height:1.8">
      <strong>Bank:</strong> ${hotel.bankName || 'Maybank'}<br>
      <strong>Account Name:</strong> ${hotel.bankAccountName || 'Jack Chong Wei Jie'}<br>
      <strong>Account Number:</strong> ${hotel.bankAccountNumber || '112754096256'}<br>
      <strong>Reference:</strong> <span style="font-family:monospace;font-weight:700">${invoice.invoiceNumber}</span>
    </div>
    <p style="margin:10px 0 0;font-size:12px;color:#6b7280">Please include the invoice number as your payment reference.</p>
  ` : '';

  await send({
    to: guest.email,
    subject: `Invoice ${invoice.invoiceNumber} – ${hotel.name || 'Hotel'}`,
    html: baseLayout({
      hotelName: hotel.name, address: hotel.address, accent: '#1d4ed8',
      body: `
        ${greeting(guest.firstName)}
        <p style="margin:0 0 20px;font-size:15px;color:#374151">Please find your invoice attached to this email.</p>
        ${infoTable([
          ['Invoice No.',  `<strong style="font-family:monospace">${invoice.invoiceNumber}</strong>`],
          ...(res?.reservationId ? [['Reservation', res.reservationId]] : []),
          ['Total',         fmt(invoice.total)],
          ['Amount Paid',   fmt(invoice.amountPaid)],
          ['Balance Due',   `<strong style="${invoice.balance <= 0 ? 'color:#16a34a' : 'color:#dc2626'}">${fmt(invoice.balance)}</strong>`],
          ['Status',        invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)],
        ])}
        ${invoice.dueDate ? `<p style="margin:0 0 20px;font-size:13px;color:#6b7280">Due date: <strong>${new Date(invoice.dueDate).toLocaleDateString('en-MY')}</strong></p>` : ''}
        ${invoice.balance > 0 ? bankRows : `
          ${divider()}
          <p style="margin:0;font-size:14px;color:#16a34a;font-weight:600">✓ Invoice fully paid — thank you!</p>
        `}
        ${signOff(hotel.name || 'Hotel Team')}
      `,
    }),
    attachments: pdfBuffer ? [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }] : [],
  }).catch(() => {});
};

export const sendPaymentReceiptEmail = async (guest, invoice, payment) => {
  if (!guest?.email) return;
  const hotel  = await getHotel();
  const symbol = hotel.currencySymbol ?? 'RM';
  const fmt    = (n) => `${symbol}${Number(n).toFixed(2)}`;
  const methodLabel = {
    cash: 'Cash', card: 'Debit / Credit Card', ewallet: 'E-Wallet',
    bank_transfer: 'Bank Transfer', other: 'Other',
  }[payment.method] ?? payment.method;

  await send({
    to: guest.email,
    subject: `Payment Receipt – ${invoice.invoiceNumber}`,
    html: baseLayout({
      hotelName: hotel.name, address: hotel.address, accent: '#16a34a',
      body: `
        ${greeting(guest.firstName)}
        <p style="margin:0 0 20px;font-size:15px;color:#374151">
          We have received your payment. ${invoice.status === 'paid' ? 'Your invoice is now fully settled.' : 'A balance remains outstanding.'}
        </p>
        ${badge(invoice.status === 'paid' ? 'FULLY PAID' : 'PARTIALLY PAID', invoice.status === 'paid' ? '#16a34a' : '#d97706')}
        ${infoTable([
          ['Invoice No.',      `<strong style="font-family:monospace">${invoice.invoiceNumber}</strong>`],
          ['Payment Method',   methodLabel],
          ...(payment.reference ? [['Reference', payment.reference]] : []),
          ['Amount Paid',      `<strong>${fmt(payment.amount)}</strong>`],
          ['Total Paid to Date', fmt(invoice.amountPaid)],
          ['Balance Remaining', `<strong style="${invoice.balance <= 0 ? 'color:#16a34a' : 'color:#dc2626'}">${fmt(invoice.balance)}</strong>`],
        ])}
        ${invoice.status !== 'paid' ? `
          ${divider()}
          <p style="margin:0;font-size:13px;color:#6b7280">
            Your outstanding balance of <strong>${fmt(invoice.balance)}</strong> can be settled at check-out or via bank transfer.
          </p>
        ` : `
          ${divider()}
          <p style="margin:0;font-size:14px;color:#374151">Thank you for your payment! We hope to welcome you again soon.</p>
        `}
        ${signOff(hotel.name || 'Hotel Team')}
      `,
    }),
  }).catch(() => {});
};
