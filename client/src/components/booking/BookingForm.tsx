import React, { useState, useEffect } from 'react';
import { UsersIcon, BedIcon, CheckIcon } from 'lucide-react';
import { guestApi, roomApi, reservationApi, Guest, RoomDetail } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CHANNELS = ['Walk-in', 'Phone', 'Online', 'Travel Agent'];

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

const BookingForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomDetail[]>([]);
  const [guestSearch, setGuestSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [creating, setCreating] = useState(false);
  const [newGuest, setNewGuest] = useState({ firstName: '', lastName: '', email: '', phone: '', identification: '', dateOfBirth: '', nationality: '', address: '' });
  const [booking, setBooking] = useState({ arrivalDate: '', departureDate: '', numAdults: 1, numChildren: 0, roomTypeId: '', bookingChannel: 'Walk-in' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    guestApi.getAll(1, 500).then(({ guests }) => setGuests(guests)).catch(() => {});
    roomApi.getTypes().then(({ roomDetails }) => setRoomTypes(roomDetails)).catch(() => {});
  }, []);

  const filteredGuests = guestSearch.trim()
    ? guests.filter(g => `${g.firstName} ${g.lastName}`.toLowerCase().includes(guestSearch.toLowerCase()) || g.email.toLowerCase().includes(guestSearch.toLowerCase()))
    : guests.slice(0, 8);

  const daysOfStay = booking.arrivalDate && booking.departureDate
    ? Math.max(1, Math.round((new Date(booking.departureDate).getTime() - new Date(booking.arrivalDate).getTime()) / 86400000))
    : 0;

  const selectedType = roomTypes.find(rt => rt._id === booking.roomTypeId);

  const handleCreateGuest = async () => {
    setError('');
    try {
      const { guest } = await guestApi.create(newGuest as any);
      setSelectedGuest(guest);
      setCreating(false);
      setStep(2);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedGuest || !booking.roomTypeId || !booking.arrivalDate || !booking.departureDate) {
      setError('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await reservationApi.create({
        customerId: selectedGuest.customerId,
        numAdults: booking.numAdults,
        numChildren: booking.numChildren,
        arrivalDate: booking.arrivalDate,
        departureDate: booking.departureDate,
        daysOfStay,
        roomType: booking.roomTypeId,
        bookingChannel: booking.bookingChannel,
      });
      navigate('/booking/reservations');
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const stepIcon = (n: number, Icon: any, label: string) => (
    <div className={`flex flex-col items-center ${step >= n ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= n ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">New Booking</h2>
        </div>

        {/* Progress */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {stepIcon(1, UsersIcon, 'Guest')}
            <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`} />
            {stepIcon(2, BedIcon, 'Booking Details')}
            <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`} />
            {stepIcon(3, CheckIcon, 'Confirm')}
          </div>
        </div>

        <div className="p-6">
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          {/* Step 1: Guest */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Select or Create Guest</h3>

              {!creating ? (
                <>
                  <div>
                    <label className={labelCls}>Search Guest</label>
                    <input className={inputCls} placeholder="Name or email…" value={guestSearch} onChange={e => setGuestSearch(e.target.value)} />
                  </div>
                  <div className="border dark:border-gray-700 rounded-md overflow-hidden max-h-64 overflow-y-auto scrollbar-hide">
                    {filteredGuests.map(g => (
                      <button
                        key={g._id}
                        onClick={() => { setSelectedGuest(g); setStep(2); }}
                        className={`w-full text-left px-4 py-3 border-b last:border-0 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${selectedGuest?._id === g._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{g.firstName} {g.lastName}</div>
                        <div className="text-xs text-gray-500">{g.email} · {g.customerId}</div>
                      </button>
                    ))}
                    {filteredGuests.length === 0 && <p className="px-4 py-3 text-sm text-gray-500">No guests found.</p>}
                  </div>
                  <button onClick={() => setCreating(true)} className="text-sm text-blue-600 hover:underline">
                    + Create new guest
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['firstName', 'lastName', 'email', 'phone', 'identification', 'nationality', 'dateOfBirth', 'address'] as const).map(field => (
                      <div key={field}>
                        <label className={labelCls}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                        <input type={field === 'dateOfBirth' ? 'date' : field === 'email' ? 'email' : 'text'} className={inputCls} value={(newGuest as any)[field]} onChange={e => setNewGuest(prev => ({ ...prev, [field]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => setCreating(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                    <button onClick={handleCreateGuest} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">Create & Continue</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Booking Details</h3>
              <p className="text-sm text-gray-500">Guest: <span className="font-medium text-gray-800 dark:text-gray-200">{selectedGuest?.firstName} {selectedGuest?.lastName} ({selectedGuest?.customerId})</span></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Check-In Date</label>
                  <input type="date" className={inputCls} value={booking.arrivalDate} onChange={e => setBooking(b => ({ ...b, arrivalDate: e.target.value }))} required />
                </div>
                <div>
                  <label className={labelCls}>Check-Out Date</label>
                  <input type="date" className={inputCls} value={booking.departureDate} onChange={e => setBooking(b => ({ ...b, departureDate: e.target.value }))} required />
                </div>
                <div>
                  <label className={labelCls}>Adults</label>
                  <input type="number" min="1" className={inputCls} value={booking.numAdults} onChange={e => setBooking(b => ({ ...b, numAdults: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className={labelCls}>Children</label>
                  <input type="number" min="0" className={inputCls} value={booking.numChildren} onChange={e => setBooking(b => ({ ...b, numChildren: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className={labelCls}>Booking Channel</label>
                  <select className={inputCls} value={booking.bookingChannel} onChange={e => setBooking(b => ({ ...b, bookingChannel: e.target.value }))}>
                    {CHANNELS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-4">Room Type</h4>
              <div className="space-y-3">
                {roomTypes.map(rt => (
                  <div
                    key={rt._id}
                    onClick={() => setBooking(b => ({ ...b, roomTypeId: rt._id }))}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${booking.roomTypeId === rt._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-gray-200">{rt.name}</h5>
                        {rt.description && <p className="text-sm text-gray-600 dark:text-gray-400">{rt.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">${rt.price}</span>
                        <span className="text-gray-500 text-sm">/night</span>
                        {booking.roomTypeId === rt._id && <CheckIcon className="h-5 w-5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                ))}
                {roomTypes.length === 0 && <p className="text-sm text-gray-500">No room types available.</p>}
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Confirm Booking</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Guest</span>
                  <span className="font-medium text-gray-800 dark:text-white">{selectedGuest?.firstName} {selectedGuest?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room Type</span>
                  <span className="font-medium text-gray-800 dark:text-white">{selectedType?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Arrival</span>
                  <span className="font-medium text-gray-800 dark:text-white">{booking.arrivalDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Departure</span>
                  <span className="font-medium text-gray-800 dark:text-white">{booking.departureDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nights</span>
                  <span className="font-medium text-gray-800 dark:text-white">{daysOfStay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Guests</span>
                  <span className="font-medium text-gray-800 dark:text-white">{booking.numAdults} adults{booking.numChildren > 0 ? `, ${booking.numChildren} children` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Channel</span>
                  <span className="font-medium text-gray-800 dark:text-white">{booking.bookingChannel}</span>
                </div>
                <div className="border-t dark:border-gray-600 pt-2 mt-2 flex justify-between">
                  <span className="font-medium text-gray-800 dark:text-white">Estimated Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedType ? `$${(daysOfStay * selectedType.price).toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Previous</button>
            ) : <div />}
            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && !selectedGuest || step === 2 && (!booking.roomTypeId || !booking.arrivalDate || !booking.departureDate)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-sm font-medium"
              >
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-md text-sm font-medium">
                {submitting ? 'Creating…' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
