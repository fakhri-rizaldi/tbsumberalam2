import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header className="bg-[var(--ink)] text-[var(--surface)] p-4 flex justify-between items-center shadow-md">
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-[var(--accent-primary)] text-[var(--ink)] p-2 rounded-sm font-bold flex items-center justify-center">
            TB
          </div>
          <div>
            <h1 className="text-xl m-0 tracking-wider uppercase font-bold">Sumber Alam 2</h1>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-xs uppercase opacity-70 m-0">Akses Aktif</p>
            <p className="text-sm font-bold font-mono text-[var(--accent-primary)] m-0">{user?.name || 'Owner'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent border border-[var(--surface)]/30 hover:bg-[var(--danger)] hover:border-[var(--danger)] transition-colors px-4 py-2 rounded-sm text-sm uppercase tracking-wider font-bold cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Keluar Sesi</span>
          </button>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Layout;
