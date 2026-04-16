import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff, Zap } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl gradient-text">Primetrade.ai</span>
          </div>
          <p className="text-slate-400 font-body text-sm">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 fade-up fade-up-delay-1" style={{
          boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)'
        }}>
          <h1 className="font-display font-bold text-2xl text-white mb-6">Welcome back</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="glass-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="glass-input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gradient w-full py-3 rounded-xl text-sm mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 font-body mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;