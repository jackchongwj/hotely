import React, { useState, useEffect } from 'react';
import { SearchIcon, CheckCircleIcon, UserPlusIcon, ArrowRightIcon } from 'lucide-react';
import { guestApi, reservationApi, roomApi, Guest, RoomDetail } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };

interface AvailRoom { _id: string; roomNumber: number; roomStatus: string; }

const EMPTY_GUEST = { firstName: '', lastName: '', email: '', phone: '', identification: '', nationality: '', dateOfBirth: '', address: '' };

const WalkIn = () => {
  const navigate = useNavigate();

  // Step: 'guest' | 'stay' | 'done'
  const [step, setStep] = useState<'guest' | 'stay' | 'done'>('guest');

  // Guest step
  const [guestSearch, setGuestSearch] = useState('');
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [guestsLoaded, setGuestsLoaded] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuestMode, setNewGuestMode] = useState(false);
  const [newGuest, setNewGuest] = useState({ ...EMPTY_GUEST });
  const [guestError, setGuestError] = useState('');
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  // Stay step
  const [roomTypes, setRoomTypes] = useState<RoomDetail[]>([]);
  const [availRooms, setAvailRooms] = useState<AvailRoom[]>([]);
  const [stayForm, setStayForm] = useState({ roomTypeId: '', roomId: '', departureDate: tomorrow(), numAdults: 1, numChildren: 0 });
  const [stayError, setStayError] = useState('');
  const [staySubmitting, setStaySubmitting] = useState(false);

  // Done
  const [doneId, setDoneId] = useState('');

  useEffect(() => {
    guestApi.getAll(1, 500).then(({ guests }) => { setAllGuests(guests); setGuestsLoaded(true); }).catch(() => {});
    roomApi.getTypes().then(({ roomDetails }) => setRoomTypes(roomDetails)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!stayForm.roomTypeId) { setAvailRooms([]); return; }
    roomApi.getAll().then(({ rooms }) => {
      const available = rooms.filter(r => {
        const rtId = typeof r.roomType === 'object' ? (r.roomType as any)._id : r.roomType;
        return rtId === stayForm.roomTypeId && r.roomStatus === 'Vacant';
      }) as AvailRoom[];
      setAvailRooms(available);
      setStayForm(f => ({ ...f, roomId: available.length === 1 ? available[0]._id : '' }));
    }).catch(() => {});
  }, [stayForm.roomTypeId]);

  const filteredGuests = allGuests.filter(g =>
    !guestSearch ||
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.customerId.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.identification.toLowerCase().includes(guestSearch.toLowerCase())
  ).slice(0, 8);

  const handleGuestNext = async () => {
    setGuestError('');
    if (newGuestMode) {
      if (!newGuest.firstName || !newGuest.lastName || !newGuest.email) {
        setGuestError('First name, last name and email are required.');
        return;
      }
      setGuestSubmitting(true);
      try {
        const { guest } = await guestApi.create(newGuest);
        setSelectedGuest(guest);
        setStep('stay');
      } catch (err: any) {
        setGuestError(err.message);
      } finally {
        setGuestSubmitting(false);
      }
    } else {
      if (!selectedGuest) { setGuestError('Select a guest or create a new one.'); return; }
      setStep('stay');
    }
  };

  const handleStaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;
    setStayError('');
    if (!stayForm.roomTypeId) { setStayError('Select a room type.'); return; }
    if (!stayForm.roomId) { setStayError('Select a room.'); return; }

    const arr = today();
    const dep = stayForm.departureDate;
    const days = Math.max(1, Math.ceil((new Date(dep).getTime() - new Date(arr).getTime()) / 86400000));

    setStaySubmitting(true);
    try {
      // Create reservation
      const { reservation } = await reservationApi.create({
        customerId: selectedGuest.customerId,
        numAdults: stayForm.numAdults,
        numChildren: stayForm.numChildren,
        arrivalDate: arr,
        departureDate: dep,
        daysOfStay: days,
        roomType: stayForm.roomTypeId,
        bookingChannel: 'Walk-in',
      });

      // Immediately check in
      await reservationApi.checkIn(reservation._id, stayForm.roomId);

      setDoneId(reservation.reservationId);
      setStep('done');
    } catch (err: any) {
      setStayError(err.message);
    } finally {
      setStaySubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-4">
        <div className="flex items-center gap-3">
          {(['guest', 'stay', 'done'] as const).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 text-sm font-medium ${step === s ? 'text-blue-600 dark:text-blue-400' : i < ['guest','stay','done'].indexOf(step) ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === s ? 'border-blue-600 bg-blue-600 text-white' : i < ['guest','stay','done'].indexOf(step) ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-gray-400'}`}>{i + 1}</span>
                {s === 'guest' ? 'Guest' : s === 'stay' ? 'Stay Details' : 'Checked In'}
              </div>
              {i < 2 && <ArrowRightIcon className="w-4 h-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Guest */}
      {step === 'guest' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Select or Create Guest</h2>
            <button
              onClick={() => { setNewGuestMode(m => !m); setSelectedGuest(null); setGuestError(''); }}
              className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <UserPlusIcon className="w-4 h-4" />
              {newGuestMode ? 'Search existing' : 'New guest'}
            </button>
          </div>

          {guestError && <p className="text-sm text-red-500">{guestError}</p>}

          {!newGuestMode ? (
            <>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" className="pl-9 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-2 text-sm" placeholder="Search by name, ID, passport…"
                  value={guestSearch} onChange={e => setGuestSearch(e.target.value)} />
              </div>
              {guestsLoaded && (
                <div className="max-h-56 overflow-y-auto scrollbar-hide border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredGuests.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No guests found.</p>
                  ) : filteredGuests.map(g => (
                    <button key={g._id} onClick={() => setSelectedGuest(g)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedGuest?._id === g._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-200 shrink-0">
                        {g.firstName[0]}{g.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{g.firstName} {g.lastName}</p>
                        <p className="text-xs text-gray-500">{g.customerId} · {g.email}</p>
                      </div>
                      {selectedGuest?._id === g._id && <CheckCircleIcon className="w-5 h-5 text-blue-600 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(['firstName', 'lastName', 'email', 'phone', 'identification', 'nationality', 'dateOfBirth', 'address'] as const).map(f => (
                <div key={f}>
                  <label className={labelCls}>{f.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</label>
                  <input
                    type={f === 'email' ? 'email' : f === 'dateOfBirth' ? 'date' : 'text'}
                    className={inputCls}
                    value={(newGuest as any)[f]}
                    onChange={e => setNewGuest(g => ({ ...g, [f]: e.target.value }))}
                    required={['firstName', 'lastName', 'email'].includes(f)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button onClick={handleGuestNext} disabled={guestSubmitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
              {guestSubmitting ? 'Creating…' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Stay Details */}
      {step === 'stay' && selectedGuest && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-4 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-md text-sm text-green-800 dark:text-green-300">
            Guest: <strong>{selectedGuest.firstName} {selectedGuest.lastName}</strong> ({selectedGuest.customerId})
          </div>

          {stayError && <p className="mb-3 text-sm text-red-500">{stayError}</p>}

          <form onSubmit={handleStaySubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Room Type</label>
              <select className={inputCls} value={stayForm.roomTypeId} onChange={e => setStayForm(f => ({ ...f, roomTypeId: e.target.value, roomId: '' }))} required>
                <option value="">Select room type…</option>
                {roomTypes.map(rt => <option key={rt._id} value={rt._id}>{rt.name} (${rt.price}/night)</option>)}
              </select>
            </div>

            {stayForm.roomTypeId && (
              <div>
                <label className={labelCls}>Room <span className="text-xs text-gray-400">(vacant rooms only)</span></label>
                {availRooms.length === 0 ? (
                  <p className="text-sm text-red-500 py-2">No vacant rooms of this type available tonight.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availRooms.map(r => (
                      <button
                        type="button" key={r._id}
                        onClick={() => setStayForm(f => ({ ...f, roomId: r._id }))}
                        className={`py-2 rounded-md border text-sm font-medium transition-colors ${stayForm.roomId === r._id ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        #{r.roomNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Arrival</label>
                <input type="date" className={`${inputCls} bg-gray-50 dark:bg-gray-600`} value={today()} readOnly />
              </div>
              <div>
                <label className={labelCls}>Departure</label>
                <input type="date" className={inputCls} value={stayForm.departureDate} min={tomorrow()}
                  onChange={e => setStayForm(f => ({ ...f, departureDate: e.target.value }))} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Adults</label>
                <input type="number" min={1} className={inputCls} value={stayForm.numAdults}
                  onChange={e => setStayForm(f => ({ ...f, numAdults: Number(e.target.value) }))} required />
              </div>
              <div>
                <label className={labelCls}>Children</label>
                <input type="number" min={0} className={inputCls} value={stayForm.numChildren}
                  onChange={e => setStayForm(f => ({ ...f, numChildren: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button type="button" onClick={() => setStep('guest')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">← Back</button>
              <button type="submit" disabled={staySubmitting || availRooms.length === 0} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                {staySubmitting ? 'Processing…' : 'Check In Now'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 'done' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center space-y-4">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Check-In Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Reservation <strong className="text-gray-800 dark:text-white">{doneId}</strong> created and guest is now checked in.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => navigate('/booking/reservations')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
              View Reservations
            </button>
            <button onClick={() => { setStep('guest'); setSelectedGuest(null); setNewGuestMode(false); setGuestSearch(''); setNewGuest({ ...EMPTY_GUEST }); setStayForm({ roomTypeId: '', roomId: '', departureDate: tomorrow(), numAdults: 1, numChildren: 0 }); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
              New Walk-In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkIn;
