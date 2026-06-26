import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { Calendar, User, Phone, Mail, Award, Info, AlertTriangle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setCancelLoadingId(id);
    try {
      await API.put(`/bookings/${id}/cancel`);
      // Update local state status to Cancelled
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'Cancelled' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel the booking. Please contact support.');
    } finally {
      setCancelLoadingId('');
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-105 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">User Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-805 rounded-2xl p-6 shadow-md">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
                <div className="w-16 h-16 bg-indigo-650/20 rounded-full flex items-center justify-center border border-indigo-500/20 text-indigo-400 text-2xl font-bold mb-4 uppercase">
                  {user ? user.name.slice(0, 2) : 'US'}
                </div>
                <h3 className="text-white font-bold text-lg">{user ? user.name : 'Guest User'}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 mt-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">
                  {user ? user.role : 'user'}
                </span>
              </div>

              <div className="pt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{user ? user.email : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{user && user.phone ? user.phone : 'No phone linked'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-905 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 flex items-start gap-3">
              <Info className="h-5 w-5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-300 mb-1">Need help?</p>
                <p>For custom request updates, check-in details or payment questions, please reach our customer support at support@luxestay.com.</p>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-5.5 w-5.5 text-indigo-400" /> Reservation History
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-450 text-sm mt-3">Fetching reservations...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <p className="text-slate-405 text-sm mb-6">You have no reservations currently booked.</p>
                <Link to="/" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancelClick={handleCancelBooking}
                    loadingId={cancelLoadingId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
