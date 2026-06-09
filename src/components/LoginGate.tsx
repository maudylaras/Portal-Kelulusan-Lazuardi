import React, { useState } from 'react';
import { Mail, Shield, User, ArrowRight, AlertTriangle, KeyRound } from 'lucide-react';
import { GoogleUser } from './GoogleAuthModal';

interface LoginGateProps {
  onLoginSuccess: (user: GoogleUser) => void;
}

export default function LoginGate({ onLoginSuccess }: LoginGateProps) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GoogleUser | null>(null);

  const defaultAccounts: GoogleUser[] = [
    {
      name: 'Maudy Lazuardi',
      email: 'maudy@lazuardi.sch.id',
      avatar: 'ML',
      role: 'Admin',
    },
    {
      name: 'Staff HR Division',
      email: 'staff.hr@lazuardi.sch.id',
      avatar: 'SH',
      role: 'Staff',
    }
  ];

  const handleSelectAccount = (user: GoogleUser) => {
    setIsLoading(true);
    setSelectedUser(user);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
    }, 1000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    const emailLower = customEmail.toLowerCase().trim();
    const derivedName = customName || emailLower.split('@')[0].replace('.', ' ');
    
    // Only specific emails ending or matching 'maudy@lazuardi' are Admin
    const isAdminAccount = emailLower === 'maudy@lazuardi.sch.id' || emailLower.includes('maudy@lazuardi');

    const newUser: GoogleUser = {
      name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email: emailLower,
      avatar: derivedName.slice(0, 2).toUpperCase(),
      role: isAdminAccount ? 'Admin' : 'Guest',
    };

    setIsLoading(true);
    setSelectedUser(newUser);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(newUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Abstract radial glowing background to add editorial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Showcase */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-xl">
            {/* Elegant Shield + Graduation Symbol */}
            <div className="relative flex items-center justify-center w-12 h-12 text-sky-400">
              <span className="absolute inset-0 bg-sky-500/10 rounded-xl animate-pulse"></span>
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Lazuardi Training Center
          </h1>
          <p className="text-xs text-sky-400 font-mono font-bold mt-1.5 uppercase tracking-widest">
            Portal Kelulusan Karyawan &amp; Kurikulum
          </p>
        </div>

        {/* Authentic Glassmorphism Auth Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {isLoading && selectedUser ? (
            /* Premium loading experience */
            <div className="p-8 py-16 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="relative flex items-center justify-center mb-6">
                <span className="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping"></span>
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm font-bold text-slate-200">Menghubungkan ke Akun Google...</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">Saling sapa aman dengan {selectedUser.email}</p>
            </div>
          ) : (
            <div>
              {/* Google high-fidelity title header */}
              <div className="p-6 pb-4 border-b border-slate-800/60 bg-slate-900/40 flex flex-col items-center text-center">
                <div className="h-8 mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-extrabold text-white tracking-tight uppercase">Google Account Gate</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Autentikasi Terenkripsi Google Workspace diperlukan demi keabsahan data karyawan.
                </p>
              </div>

              <div className="p-6">
                {!isAddingAccount ? (
                  /* Account Quick Selector */
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      {defaultAccounts.map((account) => {
                        const isMainAdmin = account.email === 'maudy@lazuardi.sch.id';
                        return (
                          <button
                            key={account.email}
                            onClick={() => handleSelectAccount(account)}
                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition duration-150 text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                isMainAdmin 
                                  ? 'bg-amber-500/10 text-amber-400 ring-2 ring-amber-500/20' 
                                  : 'bg-sky-500/10 text-sky-400'
                              }`}>
                                {account.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                                  {account.name}
                                  {isMainAdmin && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-black rounded uppercase tracking-wider">
                                      Admin
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] font-mono text-slate-450 mt-1">{account.email}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-450 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Or enter custom credentials button */}
                    <button
                      onClick={() => setIsAddingAccount(true)}
                      className="w-full py-3 px-4 border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition text-center"
                    >
                      + Masuk dengan Akun Google Lain
                    </button>
                  </div>
                ) : (
                  /* Custom Gmail sign in simulation */
                  <form onSubmit={handleCustomSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Alamat Google E-mail *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                            placeholder="Ketik maudy@lazuardi.sch.id atau email Anda"
                            className="w-full pl-10 pr-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Nama Lengkap (Opsional)
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Contoh: Maudy Lazuardi"
                            className="w-full pl-10 pr-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAccount(false);
                          setCustomEmail('');
                          setCustomName('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={!customEmail}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition disabled:opacity-50"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Centered official system compliance label */}
        <p className="text-center text-[11px] text-slate-500 mt-8 leading-relaxed">
          &copy; 2026 Lazuardi Training Center (CARE &amp; R&amp;D Division). All rights reserved. <br />
          Administrator <span className="font-mono text-slate-400 select-all">maudy@lazuardi.sch.id</span>
        </p>
      </div>
    </div>
  );
}
