import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import { MapPin, Star, Sparkles, Filter, DollarSign, Calendar, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Booking Modal state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [nightsCount, setNightsCount] = useState(0);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  useEffect(() => {
    fetchRooms();
  }, [id, roomType, capacity, maxPrice]);

  useEffect(() => {
    // Calculate nights whenever check-in or check-out changes
    if (checkInDate && checkOutDate) {
      const inDate = new Date(checkInDate);
      const outDate = new Date(checkOutDate);
      if (outDate > inDate) {
        const diffTime = Math.abs(outDate - inDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNightsCount(diffDays === 0 ? 1 : diffDays);
      } else {
        setNightsCount(0);
      }
    } else {
      setNightsCount(0);
    }
  }, [checkInDate, checkOutDate]);

  const fetchHotelDetails = async () => {
    try {
      const { data } = await API.get(`/hotels/${id}`);
      setHotel(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotel details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      let queryStr = '';
      const params = [];
      if (roomType) params.push(`type=${roomType}`);
      if (capacity) params.push(`capacity=${capacity}`);
      if (maxPrice) params.push(`maxPrice=${maxPrice}`);
      if (params.length > 0) {
        queryStr = `?${params.join('&')}`;
      }

      const { data } = await API.get(`/rooms/hotel/${id}${queryStr}`);
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleBookTrigger = (room) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
    setBookingError('');
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!checkInDate || !checkOutDate) {
      return setBookingError('Please select check-in and check-out dates.');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      return setBookingError('Check-out date must be after check-in date.');
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    if (checkIn < today) {
      return setBookingError('Check-in date cannot be in the past.');
    }

    setBookingLoading(true);
    try {
      await API.post('/bookings', {
        roomId: selectedRoom._id,
        checkInDate,
        checkOutDate,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedRoom(null);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Hotel</h2>
          <p className="text-slate-400 text-sm mb-6">{error || 'Hotel not found.'}</p>
          <Link to="/" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-20">
      {/* Hotel Banner */}
      <div className="h-[350px] relative w-full overflow-hidden">
        <img
          src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultImage}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-slate-400 text-xs font-semibold mb-2">
              <MapPin className="h-4 w-4 text-indigo-400 mr-1" />
              <span>{hotel.location}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {hotel.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Hotel Profile & Amenities */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" /> About The Hotel
              </h2>
              {hotel.rating > 0 && (
                <div className="bg-slate-850 px-3 py-1 rounded-lg text-sm font-bold text-indigo-300 flex items-center gap-1 border border-indigo-500/10">
                  <Star className="h-4 w-4 fill-current text-indigo-400" />
                  {hotel.rating.toFixed(1)} / 5.0
                </div>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {hotel.description}
            </p>

            {/* Amenities Section */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Property Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-300 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rooms Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-indigo-400" /> Filter Available Accommodations
              </h2>
              <button
                onClick={() => {
                  setRoomType('');
                  setCapacity('');
                  setMaxPrice('');
                }}
                className="text-xs text-slate-400 hover:text-indigo-400 font-semibold"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Room Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-slate-350 text-xs py-2 px-3 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>

              {/* Min Capacity */}
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Capacity</label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-slate-350 text-xs py-2 px-3 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Any Capacity</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4+ People</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Max Price Per Night</label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-2.5 text-slate-500 h-4 w-4 pointer-events-none" />
                  <input
                    type="number"
                    placeholder="e.g. 300"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-7 pr-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-350 text-xs py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          {roomsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-450 text-sm mt-3">Searching accommodations...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm">
                No rooms matching the selected filters are available. Try adjusting filters or resetting.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onBookClick={handleBookTrigger}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Rules / Information */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-indigo-400" /> Booking Policy
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                <span><strong>Check-in Time:</strong> 2:00 PM onwards. Early check-in subject to availability.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                <span><strong>Check-out Time:</strong> 11:00 AM. Late check-out may incur additional fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                <span><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours prior to the check-in date.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                <span><strong>Identification:</strong> A valid photo ID and credit card are required at the time of check-in.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-white font-bold text-xl mb-1">Reserve Accommodation</h3>
            <p className="text-slate-450 text-xs mb-6 uppercase tracking-wider">
              {hotel.name} &bull; Room {selectedRoom.roomNumber}
            </p>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Booking Completed!</h4>
                <p className="text-slate-450 text-xs">
                  Your reservation is confirmed. Redirecting to dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {bookingError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Check In */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Check-In Date</label>
                  <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                    <Calendar className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Check Out */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Check-Out Date</label>
                  <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                    <Calendar className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Price Per Night:</span>
                    <span className="text-white font-semibold">${selectedRoom.pricePerNight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights Count:</span>
                    <span className="text-white font-semibold">{nightsCount}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2.5 flex justify-between font-bold text-sm">
                    <span className="text-slate-300">Total Price:</span>
                    <span className="text-indigo-400 font-extrabold text-base">
                      ${selectedRoom.pricePerNight * (nightsCount || 0)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(null)}
                    className="py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-md hover:shadow-indigo-500/15 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 active:translate-y-px"
                  >
                    {bookingLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>Confirm Booking</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
