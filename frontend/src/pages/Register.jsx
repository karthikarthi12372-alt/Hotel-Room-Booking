import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Phone, UserCheck, AlertCircle } from 'lucide-react';

const Register = () => {
  const { user, register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      return setError('Please fill in all required fields');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    const result = await register(name, email, password, role, phone);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="bg-slate-950 min-h-[calc(screen-16)] flex items-center justify-center px-4 py-20 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Join LuxeStay to book premium lodging and suites</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <User className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm placeholder-slate-650"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <Mail className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <input
                type="email"
                placeholder="john@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm placeholder-slate-650"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password *</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <Lock className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm placeholder-slate-650"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <Phone className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm placeholder-slate-650"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account Type</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <UserCheck className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <select
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border-none outline-none text-slate-300 text-sm focus:ring-0 appearance-none rounded-lg"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Standard User (Book Rooms)</option>
                <option value="admin">Administrator (Manage Hotels/Rooms)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-550 text-white font-semibold rounded-lg text-sm shadow-md hover:shadow-indigo-500/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:translate-y-px mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
