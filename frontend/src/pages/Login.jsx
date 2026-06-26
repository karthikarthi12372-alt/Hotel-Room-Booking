import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="bg-slate-950 min-h-[calc(screen-16)] flex items-center justify-center px-4 py-20 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to book rooms and manage your reservations</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <Mail className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm placeholder-slate-650"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors">
              <Lock className="absolute left-3 text-slate-550 h-5 w-5 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-white text-sm placeholder-slate-650"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-lg text-sm shadow-md hover:shadow-indigo-500/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:translate-y-px mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign Up Free
            </Link>
          </p>
        </div>

        {/* Demo credentials box */}
        <div className="mt-6 bg-slate-950/65 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
          <p className="font-semibold text-slate-350">Quick Access Demo Accounts:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
            <div>
              <p className="text-indigo-300 font-medium">User Account</p>
              <p>Email: <span className="text-white font-mono">john@gmail.com</span></p>
              <p>Pass: <span className="text-white font-mono">password123</span></p>
            </div>
            <div>
              <p className="text-emerald-300 font-medium">Admin Account</p>
              <p>Email: <span className="text-white font-mono">admin@hotel.com</span></p>
              <p>Pass: <span className="text-white font-mono">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
