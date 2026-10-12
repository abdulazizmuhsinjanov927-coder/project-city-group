import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';
import { CORPORATE_HQ_IMAGE } from '../../data/initialData';
import { Logo } from '../common/Logo';

export const LoginView: React.FC = () => {
  const { login, loginAs, availableUsers } = useAuth();
  const { branding } = useBranding();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pcg2026');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Iltimos, foydalanuvchi nomini kiriting');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setError('Foydalanuvchi nomi yoki parol noto‘g‘ri');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#060B18] p-4 sm:p-6">
      {/* Background HQ image with deep navy scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={CORPORATE_HQ_IMAGE}
          alt="PROJECT CITY GROUP HQ"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-[#080F25]/90 to-[#080F25]/70" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl glass-panel-gold border border-amber-500/30 shadow-2xl p-6 sm:p-10 space-y-8 backdrop-blur-2xl">
        {/* Prominent Logo & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center">
            <Logo size="lg" variant="symbol" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight leading-tight">
              {branding.companyName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-amber-300/90 tracking-wider uppercase mt-1">
              {branding.title}
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Korporativ xodimlar boshqaruvi va moliyaviy hisobotlar yagona tizimiga kirish
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Foydalanuvchi logini (yoki email)
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Maxfiy parol
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Tizimga kirish</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Login Profiles */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Tezkor kirish (Demo profillari)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => loginAs(user)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex sm:flex-col items-center gap-2 sm:text-center"
              >
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400/40 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-300">
                    {user.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-amber-400/80 truncate">
                    {user.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer legal note */}
        <div className="text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} {branding.companyName}. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  );
};
