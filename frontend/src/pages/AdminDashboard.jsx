import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  LayoutDashboard,
  Building,
  Bed,
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Save,
  X,
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Master lists
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Selections
  const [selectedHotelId, setSelectedHotelId] = useState('');

  // Modals state
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  // Edit / Form states
  const [currentHotel, setCurrentHotel] = useState(null); // null for new, hotel object for edit
  const [currentRoom, setCurrentRoom] = useState(null); // null for new, room object for edit

  // Form Fields
  const [hotelForm, setHotelForm] = useState({ name: '', location: '', description: '', amenities: '', rating: 0, images: '' });
  const [roomForm, setRoomForm] = useState({ roomNumber: '', type: 'Single', pricePerNight: '', capacity: 1, description: '', amenities: '', images: '', isAvailable: true });

  // Notifications
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchHotels();
    fetchBookings();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRooms(selectedHotelId);
    } else {
      setRooms([]);
    }
  }, [selectedHotelId]);

  const triggerNotification = (success = '', error = '') => {
    if (success) {
      setSuccessMsg(success);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    if (error) {
      setErrorMsg(error);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // --- API Functions ---

  const fetchHotels = async () => {
    try {
      const { data } = await API.get('/hotels');
      setHotels(data);
      if (data.length > 0 && !selectedHotelId) {
        setSelectedHotelId(data[0]._id);
      }
    } catch (err) {
      triggerNotification('', 'Failed to fetch hotels');
    }
  };

  const fetchRooms = async (hotelId) => {
    try {
      const { data } = await API.get(`/rooms/hotel/${hotelId}`);
      setRooms(data);
    } catch (err) {
      triggerNotification('', 'Failed to fetch rooms for selected hotel');
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings');
      setBookings(data);
    } catch (err) {
      triggerNotification('', 'Failed to fetch bookings');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      triggerNotification('', 'Failed to fetch users');
    }
  };

  // --- Hotel Actions ---

  const openNewHotelModal = () => {
    setCurrentHotel(null);
    setHotelForm({ name: '', location: '', description: '', amenities: '', rating: 0, images: '' });
    setHotelModalOpen(true);
  };

  const openEditHotelModal = (hotel) => {
    setCurrentHotel(hotel);
    setHotelForm({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      rating: hotel.rating,
      amenities: hotel.amenities ? hotel.amenities.join(', ') : '',
      images: hotel.images ? hotel.images.join(', ') : ''
    });
    setHotelModalOpen(true);
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amenitiesArr = hotelForm.amenities.split(',').map(a => a.trim()).filter(Boolean);
      const imagesArr = hotelForm.images.split(',').map(i => i.trim()).filter(Boolean);

      const payload = {
        ...hotelForm,
        amenities: amenitiesArr,
        images: imagesArr,
      };

      if (currentHotel) {
        // Update
        const { data } = await API.put(`/hotels/${currentHotel._id}`, payload);
        setHotels(prev => prev.map(h => h._id === data._id ? data : h));
        triggerNotification('Hotel updated successfully');
      } else {
        // Create
        const { data } = await API.post('/hotels', payload);
        setHotels(prev => [...prev, data]);
        if (!selectedHotelId) setSelectedHotelId(data._id);
        triggerNotification('Hotel added successfully');
      }
      setHotelModalOpen(false);
    } catch (err) {
      triggerNotification('', err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Deleting this hotel will delete all of its rooms. Proceed?')) return;
    try {
      await API.delete(`/hotels/${id}`);
      setHotels(prev => prev.filter(h => h._id !== id));
      if (selectedHotelId === id) {
        setSelectedHotelId('');
      }
      triggerNotification('Hotel deleted successfully');
    } catch (err) {
      triggerNotification('', 'Failed to delete hotel');
    }
  };

  // --- Room Actions ---

  const openNewRoomModal = () => {
    if (!selectedHotelId) return alert('Please select a hotel first');
    setCurrentRoom(null);
    setRoomForm({ roomNumber: '', type: 'Single', pricePerNight: '', capacity: 1, description: '', amenities: '', images: '', isAvailable: true });
    setRoomModalOpen(true);
  };

  const openEditRoomModal = (room) => {
    setCurrentRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description || '',
      isAvailable: room.isAvailable,
      amenities: room.amenities ? room.amenities.join(', ') : '',
      images: room.images ? room.images.join(', ') : ''
    });
    setRoomModalOpen(true);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amenitiesArr = roomForm.amenities.split(',').map(a => a.trim()).filter(Boolean);
      const imagesArr = roomForm.images.split(',').map(i => i.trim()).filter(Boolean);

      const payload = {
        ...roomForm,
        hotelId: selectedHotelId,
        amenities: amenitiesArr,
        images: imagesArr,
      };

      if (currentRoom) {
        // Update
        const { data } = await API.put(`/rooms/${currentRoom._id}`, payload);
        setRooms(prev => prev.map(r => r._id === data._id ? data : r));
        triggerNotification('Room updated successfully');
      } else {
        // Create
        const { data } = await API.post('/rooms', payload);
        setRooms(prev => [...prev, data]);
        triggerNotification('Room added successfully');
      }
      setRoomModalOpen(false);
    } catch (err) {
      triggerNotification('', err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to remove this room?')) return;
    try {
      await API.delete(`/rooms/${id}`);
      setRooms(prev => prev.filter(r => r._id !== id));
      triggerNotification('Room deleted successfully');
    } catch (err) {
      triggerNotification('', 'Failed to delete room');
    }
  };

  // --- Booking Actions ---

  const handleBookingStatusChange = async (id, status) => {
    try {
      const { data } = await API.put(`/bookings/${id}`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: data.status } : b));
      triggerNotification('Booking status updated');
    } catch (err) {
      triggerNotification('', 'Failed to update status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Remove this booking record completely?')) return;
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      triggerNotification('Booking removed');
    } catch (err) {
      triggerNotification('', 'Failed to delete booking');
    }
  };

  // --- User Actions ---

  const handleToggleUserRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { data } = await API.put(`/users/${id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: data.role } : u));
      triggerNotification('User role updated');
    } catch (err) {
      triggerNotification('', err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      triggerNotification('User deleted');
    } catch (err) {
      triggerNotification('', err.response?.data?.message || 'Failed to delete user');
    }
  };

  // --- Stats Calculations ---

  const getAnalytics = () => {
    const totalBooked = bookings.length;
    const totalRev = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const totalRooms = rooms.length;
    const totalH = hotels.length;
    const totalU = users.length;

    return { totalBooked, totalRev, totalRooms, totalH, totalU };
  };

  const stats = getAnalytics();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-indigo-400" /> Administrative Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage luxury properties, user configurations, reservations and system configurations.</p>
          </div>

          {/* Quick Notification alert */}
          <div className="h-6">
            {successMsg && (
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="h-3.5 w-3.5" /> {successMsg}
              </span>
            )}
            {errorMsg && (
              <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" /> {errorMsg}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-805 mb-8 overflow-x-auto gap-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'hotels', label: 'Hotels', icon: Building },
            { id: 'rooms', label: 'Rooms', icon: Bed },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-5 border-b-2 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gross Revenue</p>
                  <h3 className="text-3xl font-extrabold text-white">${stats.totalRev.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/10">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Bookings</p>
                  <h3 className="text-3xl font-extrabold text-white">{stats.totalBooked}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-450 rounded-xl border border-emerald-500/10">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Hotels</p>
                  <h3 className="text-3xl font-extrabold text-white">{stats.totalH}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/10">
                  <Building className="h-6 w-6" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Users Count</p>
                  <h3 className="text-3xl font-extrabold text-white">{stats.totalU}</h3>
                </div>
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/10">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Quick Summary Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5.5 w-5.5 text-indigo-400" /> Platform Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-350">
                <div className="space-y-4">
                  <h3 className="font-bold text-white border-l-2 border-indigo-500 pl-3">Property Operations</h3>
                  <p>LuxeStay supports quick adjustments to room availability, layout updates, and location configurations. Hotels deleted will clear their associated rooms recursively to maintain DB synchronization.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-white border-l-2 border-indigo-500 pl-3">Reservation Handling</h3>
                  <p>Users can submit reservation bookings securely. The database ensures there are no conflicts on overlapping check-in/check-out dates. Cancelled status releases date ranges immediately.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Hotel Management</h2>
              <button
                onClick={openNewHotelModal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow"
              >
                <Plus className="h-4 w-4" /> Add Hotel
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Hotel Name</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Amenities</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {hotels.map(hotel => (
                      <tr key={hotel._id} className="hover:bg-slate-850/45">
                        <td className="px-6 py-4 font-bold text-white">{hotel.name}</td>
                        <td className="px-6 py-4">{hotel.location}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-current text-indigo-400" />
                            {hotel.rating.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[250px]">
                            {hotel.amenities?.slice(0, 3).map((a, idx) => (
                              <span key={idx} className="bg-slate-800 text-[10px] px-2 py-0.5 rounded border border-slate-700">{a}</span>
                            ))}
                            {hotel.amenities?.length > 3 && <span className="text-[10px] text-slate-500">+{hotel.amenities.length - 3}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditHotelModal(hotel)}
                            className="p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-650/20 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel._id)}
                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ROOMS TAB */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white whitespace-nowrap">Room Management</h2>
                <select
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs py-2 px-3 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Hotel</option>
                  {hotels.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={openNewRoomModal}
                disabled={!selectedHotelId}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow"
              >
                <Plus className="h-4 w-4" /> Add Room
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Room No</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Capacity</th>
                      <th className="px-6 py-4">Price / Night</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {rooms.map(room => (
                      <tr key={room._id} className="hover:bg-slate-850/45">
                        <td className="px-6 py-4 font-bold text-white">{room.roomNumber}</td>
                        <td className="px-6 py-4">{room.type}</td>
                        <td className="px-6 py-4">{room.capacity} People</td>
                        <td className="px-6 py-4 font-semibold text-indigo-400">${room.pricePerNight}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            room.isAvailable
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/10 border-red-500/20 text-red-400'
                          }`}>
                            {room.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditRoomModal(room)}
                            className="p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-650/20 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedHotelId && rooms.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-500 font-medium">No rooms configured for this hotel yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Booking Management</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Hotel</th>
                      <th className="px-6 py-4">Room (Type)</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-slate-850/45">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{booking.user?.name || 'N/A'}</p>
                          <p className="text-xs text-slate-500 font-mono">{booking.user?.email || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-200">{booking.hotel?.name || 'N/A'}</td>
                        <td className="px-6 py-4">
                          Room {booking.room?.roomNumber || 'N/A'} ({booking.room?.type || 'N/A'})
                        </td>
                        <td className="px-6 py-4 text-xs space-y-0.5">
                          <p><span className="text-slate-500 font-medium">In:</span> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                          <p><span className="text-slate-500 font-medium">Out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">${booking.totalPrice}</td>
                        <td className="px-6 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                            className={`text-xs font-semibold border rounded-lg py-1 px-2.5 bg-slate-950 focus:outline-none ${
                              booking.status === 'Booked'
                                ? 'border-indigo-500/30 text-indigo-400'
                                : booking.status === 'Completed'
                                ? 'border-emerald-500/30 text-emerald-400'
                                : 'border-red-500/30 text-red-400'
                            }`}
                          >
                            <option value="Booked">Booked</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-md transition-colors"
                            title="Delete Booking Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">User Accounts</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-slate-850/45">
                        <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4 text-slate-400">{u.phone || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-500/10 border-purple-500/25 text-purple-400'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserRole(u._id, u.role)}
                            className="px-2.5 py-1 text-xs border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg transition-all"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- HOTEL CRUD MODAL --- */}
      {hotelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-white font-bold text-xl mb-4">{currentHotel ? 'Edit Hotel Property' : 'Add Luxury Hotel Property'}</h3>
            <form onSubmit={handleHotelSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hotel Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Miami, FL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={hotelForm.location}
                    onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Rating (0 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={hotelForm.rating}
                    onChange={(e) => setHotelForm({ ...hotelForm, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Free WiFi, Spa, Pool"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={hotelForm.amenities}
                    onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Image URLs (Comma separated)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... , https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                  value={hotelForm.images}
                  onChange={(e) => setHotelForm({ ...hotelForm, images: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setHotelModalOpen(false)}
                  className="py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ROOM CRUD MODAL --- */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-white font-bold text-xl mb-4">{currentRoom ? 'Edit Room' : 'Add Room to Hotel'}</h3>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 101"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Type</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price Per Night ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 150"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={roomForm.pricePerNight}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Queen Bed, Coffee maker"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={roomForm.amenities}
                    onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Availability</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                    value={roomForm.isAvailable}
                    onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.value === 'true' })}
                  >
                    <option value="true">Available</option>
                    <option value="false">Booked / Out of Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Image URLs (Comma separated)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... , https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
                  value={roomForm.images}
                  onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
