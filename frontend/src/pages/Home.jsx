import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, MapPin, Star, Award, Compass } from 'lucide-react';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (searchTerm = '') => {
    setLoading(true);
    try {
      const url = searchTerm ? `/hotels?search=${searchTerm}` : '/hotels';
      const { data } = await API.get(url);
      setHotels(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHotels(search);
  };

  const defaultHotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-16">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[500px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/25">
              Welcome to LuxeStay
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 leading-tight">
              Find Your Next <br />
              <span className="text-indigo-400">Extraordinary</span> Stay
            </h1>
            <p className="text-slate-350 text-base md:text-lg mt-4 max-w-xl">
              Book luxury rooms, suites, and beach resorts around the world. Secure booking, premium amenities, and top-tier services guaranteed.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-lg bg-slate-900/90 p-2.5 rounded-xl border border-slate-750 shadow-2xl backdrop-blur-md">
              <div className="flex-1 flex items-center px-3 gap-2">
                <Search className="h-5 w-5 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Where are you going? (e.g. New York, Miami)"
                  className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-slate-500 focus:ring-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-all shadow-md hover:shadow-indigo-500/25 active:translate-y-px"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Hotel Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Compass className="h-7 w-7 text-indigo-400" />
              Explore Featured Accommodations
            </h2>
            <p className="text-slate-400 text-sm mt-1">Handpicked properties offering ultimate luxury, prime locations, and top comfort</p>
          </div>
          {search && (
            <button
              onClick={() => {
                setSearch('');
                fetchHotels('');
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/35 bg-indigo-500/5 px-3 py-1.5 rounded-lg transition-all"
            >
              Clear Filter
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-450 text-sm mt-4 font-medium">Discovering premium stays...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
            <h3 className="text-lg font-bold text-white mb-2">No Hotels Found</h3>
            <p className="text-slate-400 text-sm">
              We couldn't find any hotels matching "{search}". Try searching for another city, location, or hotel name.
            </p>
            <button
              onClick={() => {
                setSearch('');
                fetchHotels('');
              }}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/40 hover:shadow-indigo-500/5 shadow-lg flex flex-col justify-between h-full group transition-all duration-300"
              >
                {/* Hotel Image */}
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultHotelImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  {hotel.rating > 0 && (
                    <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-300 flex items-center gap-1 border border-indigo-500/10">
                      <Star className="h-3.5 w-3.5 fill-current text-indigo-400" />
                      {hotel.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-slate-400 text-xs font-semibold mb-2">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400 mr-1 shrink-0" />
                      <span>{hotel.location}</span>
                    </div>

                    <h3 className="text-white font-extrabold text-xl mb-2 group-hover:text-indigo-400 transition-colors leading-snug">
                      {hotel.name}
                    </h3>

                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Amenities list */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-1.5">
                          {hotel.amenities.slice(0, 4).map((amenity, i) => (
                            <span
                              key={i}
                              className="bg-slate-800 text-slate-350 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-750"
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <span className="text-[10px] text-slate-500 font-semibold px-1 py-0.5">
                              +{hotel.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Award className="h-4 w-4 text-indigo-400" /> Premium Lodging
                    </span>
                    <Link
                      to={`/hotel/${hotel._id}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs rounded-lg border border-slate-700 hover:border-indigo-500/50 shadow transition-all active:translate-y-px"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
