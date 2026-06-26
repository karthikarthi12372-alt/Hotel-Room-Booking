import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save, CheckCircle, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password && password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    const profileData = { name, email, phone };
    if (password) {
      profileData.password = password;
    }

    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-101 pb-20 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Edit Profile</h1>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-md">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-2 mb-6">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                  <User className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                  <Mail className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                  <Phone className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Account Role (Readonly) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account Role</label>
                <div className="py-2.5 px-4 bg-slate-950/60 border border-slate-850 rounded-lg text-slate-400 text-sm select-none">
                  {user ? user.role.toUpperCase() : 'USER'}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 mt-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Change Password</h3>
              <p className="text-xs text-slate-400 mb-4">Leave fields blank if you do not want to update password.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                    <Lock className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500">
                    <Lock className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-md hover:shadow-indigo-500/15 flex items-center gap-2 transition-all disabled:opacity-50 active:translate-y-px"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="h-4.5 w-4.5" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
