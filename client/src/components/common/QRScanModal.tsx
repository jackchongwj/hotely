import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { XIcon, CameraIcon, UsbIcon, CheckCircleIcon, AlertCircleIcon, LogInIcon } from 'lucide-react';
import { reservationApi, Reservation, Guest, RoomDetail, Room } from '../../services/api';
import { toastSuccess, toastError } from '../../lib/toast';
import useEscapeKey from '../../hooks/useEscapeKey';

type Mode = 'camera' | 'hid';

interface ScanResult {
  reservation: Reservation;
  vacantRooms: Room[];
}

interface Props { onClose: () => void; }

const AUTO_CHECKIN_SECS = 3;

const QRScanModal = ({ onClose }: Props) => {
  const [mode, setMode] = useState<Mode>('camera');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef    = useRef<number>(0);
  const hidRef    = useRef<HTMLInputElement>(null);
  const cdRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  useEscapeKey(true, onClose);

  // ── Camera ──────────────────────────────────────────────────────────────────

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const scanFrame = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
        if (code?.data) { handleScan(code.data); return; }
      }
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  }, []); // eslint-disable-line

  const startCamera = useCallback(async () => {
    setError('');
    setResult(null);
    setCountdown(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        rafRef.current = requestAnimationFrame(scanFrame);
      }
    } catch {
      setError('Camera access denied. Check browser permissions or use USB/HID mode.');
    }
  }, [scanFrame]);

  useEffect(() => {
    if (mode === 'camera') startCamera();
    else {
      stopCamera();
      setTimeout(() => hidRef.current?.focus(), 100);
    }
    return stopCamera;
  }, [mode, startCamera, stopCamera]);

  // ── Countdown auto-check-in ─────────────────────────────────────────────────

  const clearCountdown = () => {
    if (cdRef.current) clearInterval(cdRef.current);
    cdRef.current = null;
    setCountdown(null);
  };

  const startCountdown = (roomId: string) => {
    let secs = AUTO_CHECKIN_SECS;
    setCountdown(secs);
    cdRef.current = setInterval(() => {
      secs -= 1;
      if (secs <= 0) {
        clearCountdown();
        doCheckIn(roomId);
      } else {
        setCountdown(secs);
      }
    }, 1000);
  };

  useEffect(() => () => clearCountdown(), []);

  // ── Scan handler ─────────────────────────────────────────────────────────────

  const handleScan = useCallback(async (code: string) => {
    if (scanning) return;
    setScanning(true);
    stopCamera();
    setError('');
    try {
      const data = await reservationApi.scan(code);
      setResult(data);
      if (data.vacantRooms.length === 1 && !data.reservation.checkedIn && !data.reservation.cancelled) {
        setSelectedRoom(data.vacantRooms[0]._id);
        startCountdown(data.vacantRooms[0]._id);
      } else if (data.vacantRooms.length > 1) {
        setSelectedRoom('');
      }
    } catch (err: any) {
      setError(err.message ?? `No reservation found for: ${code}`);
      setScanning(false);
      if (mode === 'camera') startCamera();
    }
  }, [scanning, mode, stopCamera, startCamera]); // eslint-disable-line

  // ── Check-in ─────────────────────────────────────────────────────────────────

  const doCheckIn = async (roomId?: string) => {
    const rid = roomId ?? selectedRoom;
    if (!result || !rid) return;
    clearCountdown();
    setCheckingIn(true);
    try {
      await reservationApi.checkIn(result.reservation._id, rid);
      const guest = typeof result.reservation.customerId === 'object'
        ? result.reservation.customerId as Guest : null;
      const name = guest ? `${guest.firstName} ${guest.lastName}` : result.reservation.reservationId;
      toastSuccess(`${name} checked in successfully`);
      onClose();
    } catch (err: any) {
      toastError(err.message ?? 'Check-in failed');
      setCheckingIn(false);
    }
  };

  const resetScan = () => {
    clearCountdown();
    setResult(null);
    setError('');
    setScanning(false);
    setSelectedRoom('');
    if (mode === 'camera') startCamera();
    else setTimeout(() => hidRef.current?.focus(), 100);
  };

  // ── Derived display values ───────────────────────────────────────────────────

  const guest    = result ? (typeof result.reservation.customerId === 'object' ? result.reservation.customerId as Guest : null) : null;
  const rt       = result ? (typeof result.reservation.roomType   === 'object' ? result.reservation.roomType   as RoomDetail : null) : null;
  const resStatus = result
    ? (result.reservation.checkedIn ? 'Checked In'
      : result.reservation.cancelled ? 'Cancelled'
      : result.reservation.checkedOut ? 'Checked Out'
      : 'Confirmed')
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">QR Check-In Scanner</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
          {(['camera', 'hid'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); resetScan(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {m === 'camera' ? <CameraIcon className="w-4 h-4" /> : <UsbIcon className="w-4 h-4" />}
              {m === 'camera' ? 'Camera' : 'USB / HID Scanner'}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">

          {/* Camera view */}
          {mode === 'camera' && !result && !error && (
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {/* Targeting reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/70 rounded-lg relative">
                  {['tl','tr','bl','br'].map(c => (
                    <div key={c} className={`absolute w-5 h-5 border-white border-2 ${
                      c === 'tl' ? 'top-0 left-0 border-r-0 border-b-0' :
                      c === 'tr' ? 'top-0 right-0 border-l-0 border-b-0' :
                      c === 'bl' ? 'bottom-0 left-0 border-r-0 border-t-0' :
                                   'bottom-0 right-0 border-l-0 border-t-0'
                    }`} />
                  ))}
                </div>
              </div>
              <p className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-xs">
                Point at a reservation QR code
              </p>
            </div>
          )}

          {/* HID mode */}
          {mode === 'hid' && !result && (
            <div className="rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6 text-center space-y-2">
              <UsbIcon className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Ready to scan</p>
              <p className="text-xs text-blue-500 dark:text-blue-400">Aim your scanner at the QR code on the booking confirmation</p>
              <input
                ref={hidRef}
                className="opacity-0 absolute w-0 h-0"
                onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value) { handleScan(e.currentTarget.value); e.currentTarget.value = ''; } }}
                onChange={() => {}} // controlled just to suppress warning
                autoFocus
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
              </div>
              <button onClick={resetScan} className="text-xs text-red-500 hover:text-red-700 shrink-0 underline">Try again</button>
            </div>
          )}

          {/* Scan result */}
          {result && resStatus && (
            <div className={`rounded-lg border p-4 space-y-3 ${
              resStatus === 'Confirmed' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
              resStatus === 'Checked In' ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' :
              'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {guest ? `${guest.firstName} ${guest.lastName}` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{result.reservation.reservationId}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  resStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  resStatus === 'Checked In' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>{resStatus}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                <span>Room type</span><span className="font-medium text-gray-800 dark:text-gray-200 text-right">{rt?.name ?? '—'}</span>
                <span>Arrival</span><span className="font-medium text-gray-800 dark:text-gray-200 text-right">{result.reservation.arrivalDate.slice(0,10)}</span>
                <span>Departure</span><span className="font-medium text-gray-800 dark:text-gray-200 text-right">{result.reservation.departureDate.slice(0,10)}</span>
                <span>Nights</span><span className="font-medium text-gray-800 dark:text-gray-200 text-right">{result.reservation.daysOfStay}</span>
              </div>

              {/* Confirmed → can check in */}
              {resStatus === 'Confirmed' && (
                <div className="pt-1 space-y-2">
                  {result.vacantRooms.length === 0 ? (
                    <p className="text-xs text-red-600 dark:text-red-400">No vacant {rt?.name} rooms available.</p>
                  ) : result.vacantRooms.length > 1 ? (
                    <select
                      className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md py-1.5 px-2.5 text-sm"
                      value={selectedRoom}
                      onChange={e => setSelectedRoom(e.target.value)}
                    >
                      <option value="">Select room…</option>
                      {result.vacantRooms.map(r => (
                        <option key={r._id} value={r._id}>Room {r.roomNumber}</option>
                      ))}
                    </select>
                  ) : null}

                  <div className="flex gap-2">
                    {countdown !== null ? (
                      <>
                        <button
                          onClick={clearCountdown}
                          className="flex-1 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Cancel ({countdown}s)
                        </button>
                        <button
                          onClick={() => doCheckIn()}
                          className="flex-1 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <LogInIcon className="w-4 h-4" />Check In Now
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => doCheckIn()}
                        disabled={!selectedRoom || checkingIn || result.vacantRooms.length === 0}
                        className="flex-1 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        <LogInIcon className="w-4 h-4" />{checkingIn ? 'Checking in…' : 'Check In'}
                      </button>
                    )}
                  </div>

                  {countdown !== null && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      Auto check-in in {countdown}s into Room {result.vacantRooms[0]?.roomNumber}
                    </p>
                  )}
                </div>
              )}

              {resStatus === 'Checked In' && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
                  <CheckCircleIcon className="w-4 h-4" />Guest is already checked in
                </div>
              )}
            </div>
          )}

          {/* Scan another */}
          {(result || error) && (
            <button onClick={resetScan} className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              ← Scan another
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanModal;
