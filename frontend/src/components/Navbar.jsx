import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hotel, LogOut, User, LayoutDashboard, Menu, X, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
            <Hotel className="h-8 w-8" />
            <span className="font-bold text-xl tracking-wide text-white">
              Luxe<span className="text-indigo-400">Stay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-all duration-200 ${
                      isActive('/admin') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-all duration-200 ${
                      isActive('/dashboard') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-all duration-200 ${
                    isActive('/profile') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>

                <div className="border-l border-slate-700 h-6 mx-2"></div>

                <div className="flex items-center space-x-3">
                  <span className="text-slate-300 text-sm hidden lg:inline">
                    Hello, <span className="font-semibold text-white">{user.name.split(' ')[0]}</span>
                  </span>
                  <span className="text-xs uppercase bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
                    {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md shadow-md hover:shadow-indigo-500/25 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-850 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-855'
            }`}
          >
            Home
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-855'
                  }`}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-855'
                  }`}
                >
                  My Bookings
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/profile') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-855'
                }`}
              >
                Profile
              </Link>

              <div className="border-t border-slate-800 my-2 pt-2">
                <div className="px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-slate-400 text-xs">{user.email}</p>
                  </div>
                  <span className="text-xs uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-slate-850 rounded-md font-medium text-base transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2 border-t border-slate-800 mt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-md text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
