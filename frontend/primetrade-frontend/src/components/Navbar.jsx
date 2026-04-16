import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(2, 8, 24, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">
            Primetrade.ai
          </span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass-card px-3 py-1.5">
              {isAdmin ? (
                <Shield size={14} className="text-indigo-400" />
              ) : (
                <LayoutDashboard size={14} className="text-cyan-400" />
              )}
              <span className="text-sm font-body text-slate-300">{user.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isAdmin
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
            >
              <LogOut size={15} />
              <span className="font-body">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;