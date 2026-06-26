import React from 'react';
import { Calendar, MapPin, DollarSign, Ban, Trash2 } from 'lucide-react';

const BookingCard = ({ booking, onCancelClick, loadingId }) => {
  const { _id, hotel, room, checkInDate, checkOutDate, totalPrice, status } = booking;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const defaultImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  // Can cancel if status is Booked and check-in date is in the future
  const canCancel = status === 'Booked' && new Date(checkInDate) > new Date();

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md hover:border-slate-650 transition-all duration-200 flex flex-col md:flex-row">
      {/* Hotel Image */}
      <div className="md:w-1/3 h-48 md:h-auto relative">
        <img
          src={hotel && hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultImage}
          alt={hotel ? hotel.name : 'Hotel'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full uppercase border ${
              status === 'Booked'
                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                : status === 'Completed'
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-xl mb-1">{hotel ? hotel.name : 'Unknown Hotel'}</h3>
          <div className="flex items-center text-slate-400 text-sm mb-4">
            <MapPin className="h-4 w-4 text-indigo-400 mr-1 shrink-0" />
            <span>{hotel ? hotel.location : 'No location specified'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 bg-slate-900/40 p-4 rounded-lg border border-slate-750">
            <div>
              <p className="text-xs font-medium text-slate-450 uppercase tracking-wider mb-1">Check-in</p>
              <div className="flex items-center text-slate-200 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
                {formatDate(checkInDate)}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-450 uppercase tracking-wider mb-1">Check-out</p>
              <div className="flex items-center text-slate-200 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
                {formatDate(checkOutDate)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="text-slate-350">
              <span className="font-semibold text-white">Room:</span> {room ? `${room.roomNumber} (${room.type})` : 'N/A'}
            </div>
            <div className="flex items-center font-bold text-white text-lg bg-indigo-650/10 px-3 py-1 rounded border border-indigo-500/10">
              <span className="text-slate-450 text-xs font-normal mr-1.5">Total Paid:</span>
              <DollarSign className="h-4 w-4 -mr-0.5 text-indigo-400" />
              <span className="text-indigo-400">{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {canCancel && (
          <div className="mt-6 pt-4 border-t border-slate-700/60 flex justify-end">
            <button
              onClick={() => onCancelClick(_id)}
              disabled={loadingId === _id}
              className="py-1.5 px-4 border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {loadingId === _id ? (
                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Ban className="h-3.5 w-3.5" />
              )}
              Cancel Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
