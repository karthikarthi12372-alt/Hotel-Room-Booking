import React from 'react';
import { Users, DollarSign, ShieldAlert, Award } from 'lucide-react';

const RoomCard = ({ room, onBookClick, isAuthenticated }) => {
  const { roomNumber, type, pricePerNight, capacity, description, images, amenities, isAvailable } = room;

  const defaultImage = 'https://images.unsplash.com/photo-1611891405120-449a04dfd8f5?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full group">
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={images && images.length > 0 ? images[0] : defaultImage}
          alt={`Room ${roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full uppercase border ${
              isAvailable
                ? 'bg-emerald-500/25 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/25 border-red-500/30 text-red-400'
            }`}
          >
            {isAvailable ? 'Available' : 'Booked / Unavailable'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-indigo-300 font-semibold uppercase tracking-wider">
          Room {roomNumber}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-400" />
              {type} Accommodation
            </h3>
            <div className="flex items-center text-indigo-400 font-bold text-xl">
              <DollarSign className="h-5 w-5 -mr-0.5" />
              {pricePerNight}
              <span className="text-xs text-slate-400 font-normal ml-0.5">/night</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-4 line-clamp-2">{description || 'No description provided.'}</p>

          <div className="flex items-center space-x-4 mb-4 text-slate-400 text-xs font-medium">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-indigo-400" />
              <span>Max Capacity: {capacity} {capacity === 1 ? 'Guest' : 'Guests'}</span>
            </div>
          </div>

          {/* Amenities */}
          {amenities && amenities.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="bg-slate-700 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-650"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isAvailable ? (
            <button
              onClick={() => onBookClick(room)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm shadow-md hover:shadow-indigo-500/20 active:translate-y-px transition-all"
            >
              {isAuthenticated ? 'Book This Room' : 'Login to Book Room'}
            </button>
          ) : (
            <div className="w-full py-2.5 px-4 bg-slate-700/50 text-slate-400 border border-slate-700 text-center rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 select-none">
              <ShieldAlert className="h-4 w-4" />
              Room Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
