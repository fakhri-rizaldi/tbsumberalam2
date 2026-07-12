import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { KeyRound, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('owner@tbsumberalam2.com');
  const [password, setPassword] = useState('password');
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-4 relative">
      {/* Background decoration representing warehouse floor lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--ink) 0, var(--ink) 2px, transparent 2px, transparent 12px)' }}>
      </div>

      <div className="w-full max-w-md bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md shadow-[4px_4px_0_0_var(--ink)] z-10 overflow-hidden">
        
        {/* Top Header - Barcode Label Style */}
        <div className="bg-[var(--ink)] text-[var(--surface)] p-4 flex justify-between items-center border-b-2 border-[var(--ink)]">
          <div>
            <h1 className="text-xl tracking-wider uppercase m-0">TB. Sumber Alam 2</h1>
            <p className="text-xs font-mono opacity-80 uppercase m-0">Sistem Manajemen Terpadu</p>
          </div>
          <div className="border border-[var(--surface)] px-2 py-1 flex items-center gap-2 rounded-sm bg-white/10">
            <KeyRound size={16} />
            <span className="font-mono text-xs font-bold tracking-widest">AUTH-REQ</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold uppercase mb-1 flex items-center gap-2">
              Akses Owner
            </h2>
            <div className="w-12 h-1 bg-[var(--accent-primary)] rounded-sm"></div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-[var(--danger)] text-[var(--danger)] text-sm flex items-start gap-2 rounded-r-md">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)]/80">
                Alamat Surel / ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border-2 border-[var(--ink)]/20 focus:border-[var(--ink)] rounded-md font-mono text-sm outline-none transition-colors"
                placeholder="owner@domain.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)]/80">
                Kode Akses / Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border-2 border-[var(--ink)]/20 focus:border-[var(--ink)] rounded-md font-mono text-sm outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-[var(--accent-primary)] hover:bg-[#e09b30] text-[var(--ink)] font-bold uppercase tracking-widest rounded-md border-2 border-[var(--ink)] transition-colors mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifikasi...' : 'Masuk Sistem'}
            </button>
          </form>
        </div>
        
        {/* Footer label */}
        <div className="bg-[var(--bg-base)] border-t border-[var(--ink)]/20 p-3 text-center">
          <p className="font-mono text-[10px] text-[var(--ink)]/60 m-0 uppercase tracking-widest">
            STRICTLY AUTHORIZED PERSONNEL ONLY • V 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
