import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300">
              <Hotel className="h-6 w-6" />
              <span className="font-bold text-lg tracking-wide text-white">
                Luxe<span className="text-indigo-400">Stay</span>
              </span>
            </Link>
            <p className="text-sm">
              Discover and book extraordinary hotels with premium accommodations and top-tier amenities around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Search Hotels</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">Register Account</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li>Support: support@luxestay.com</li>
              <li>Reservations: bookings@luxestay.com</li>
              <li>Phone: +1 (555) 019-2834</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms & Conditions</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">Refund Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
