import React, { useState } from 'react';
import { Shield, AlertTriangle, ArrowRight, User, Mail } from 'lucide-react';
import { GoogleUser } from './GoogleAuthModal';
import { auth } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

interface LoginGateProps {
  onLoginSuccess: (user: GoogleUser) => void;
}

export default function LoginGate({ onLoginSuccess }: LoginGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSimulatedFallback, setShowSimulatedFallback] = useState(false);
  const [customSimEmail, setCustomSimEmail] = useState('');
  const [customSimName, setCustomSimName] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'simulated'>('google');

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

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(window.location.hostname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatedSignIn = (account: GoogleUser) => {
    onLoginSuccess(account);
  };

  const handleCustomSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSimEmail) return;

    const emailLower = customSimEmail.toLowerCase().trim();
    const displayName = customSimName.trim() || emailLower.split('@')[0].replace(/[\._]/g, ' ');
    const formattedName = displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const avatar = formattedName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'US';

    const isAdminAccount = emailLower === 'maudy@lazuardi.sch.id' || emailLower.includes('maudy@lazuardi');
    const role = isAdminAccount ? 'Admin' : 'Guest';

    onLoginSuccess({
      name: formattedName,
      email: emailLower,
      avatar: avatar,
      role: role,
    });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email || '';
      const emailLower = email.toLowerCase();
      
      const displayName = user.displayName || email.split('@')[0].replace(/[\._]/g, ' ');
      const formattedName = displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const avatar = formattedName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'US';
      
      const isAdminAccount = emailLower === 'maudy@lazuardi.sch.id' || emailLower.includes('maudy@lazuardi');
      const role = isAdminAccount ? 'Admin' : 'Guest';

      const newUser: GoogleUser = {
        name: formattedName,
        email: email,
        avatar: avatar,
        role: role,
      };

      onLoginSuccess(newUser);
    } catch (error: any) {
      console.error("Google login failed:", error);
      if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain')) {
        setErrorMessage("Keamanan Firebase: URL Sandbox ini perlu didaftarkan di Authorized Domains.");
        setShowSimulatedFallback(true);
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMessage("Popup diblokir oleh browser. Silakan izinkan popup untuk situs ini.");
        setShowSimulatedFallback(true);
      } else if (error.code === 'auth/closed-by-user') {
        setErrorMessage("Proses masuk Google dibatalkan.");
      } else {
        setErrorMessage(error.message || "Gagal masuk menggunakan Google.");
        setShowSimulatedFallback(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Abstract radial glowing background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-300">
        {/* Brand Showcase */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-xl">
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

        {/* Auth Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
          {isLoading ? (
            /* Loading State */
            <div className="p-8 py-16 text-center flex flex-col items-center justify-center min-h-[220px]">
              <div className="relative flex items-center justify-center mb-6">
                <span className="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping"></span>
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm font-bold text-slate-200">Menghubungkan ke Akun...</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">Saling sapa aman melalui Firebase Google Auth</p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="p-5 pb-4 border-b border-slate-800/60 bg-slate-900/40 flex flex-col items-center text-center">
                <div className="h-6 mb-1.5 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-white tracking-tight uppercase">
                    Pintu Masuk Terpadu
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Silakan masuk untuk mengakses program pelatihan &amp; kelulusan Lazuardi
                </p>
              </div>

              <div className="p-6">
                {/* Sleek Tab Selector */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-5 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSimulatedFallback(false);
                      setErrorMessage('');
                    }}
                    className={`py-2 text-[10px] uppercase tracking-wider font-black rounded-lg transition-all duration-150 ${
                      !showSimulatedFallback
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'text-slate-550 hover:text-slate-350 bg-transparent border border-transparent'
                    }`}
                  >
                    Google Auth (Official)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSimulatedFallback(true);
                      setErrorMessage('');
                    }}
                    className={`py-2 text-[10px] uppercase tracking-wider font-black rounded-lg transition-all duration-150 ${
                      showSimulatedFallback
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'text-slate-550 hover:text-slate-350 bg-transparent border border-transparent'
                    }`}
                  >
                    Bypass / Sandbox Demo
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Informasi Konektivitas</p>
                      <p className="text-[11px] leading-relaxed mt-1 text-slate-300">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {showSimulatedFallback ? (
                  /* Fallback Beautiful Simulator UI */
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs space-y-2 text-left">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div className="text-[11px] leading-relaxed">
                          <span className="font-bold font-sans">Keamanan Sandbox Pelatihan:</span> Domain pratinjau dinamis ini memerlukan pengaturan Authorized Domain di Firebase Console Anda jika menggunakan Google Auth asli.
                        </div>
                      </div>
                      
                      <div className="bg-slate-950/80 p-2 rounded-lg flex items-center justify-between border border-slate-800 font-mono text-[9px]">
                        <span className="text-slate-400 truncate select-all">{window.location.hostname}</span>
                        <button
                          type="button"
                          onClick={handleCopyDomain}
                          className="ml-2 shrink-0 px-2 py-0.5 bg-slate-805 hover:bg-slate-700 active:bg-slate-600 rounded text-[9px] font-bold text-white transition"
                        >
                          {copied ? 'Tersalin' : 'Salin'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-400 leading-normal text-left">
                        Silakan pilih salah satu Akun Google resmi di bawah ini untuk mengakses dashboard secara instan/offline:
                      </p>

                      <div className="space-y-2">
                        {defaultAccounts.map((account) => {
                          const isMainAdmin = account.email === 'maudy@lazuardi.sch.id';
                          return (
                            <button
                              key={account.email}
                              type="button"
                              onClick={() => handleSimulatedSignIn(account)}
                              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition cursor-pointer group text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  isMainAdmin 
                                    ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' 
                                    : 'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20'
                                }`}>
                                  {account.avatar}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                                    {account.name}
                                    {isMainAdmin ? (
                                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-amber-500/20 text-amber-400 text-[8px] font-bold rounded uppercase tracking-wider">
                                        Admin
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-sky-500/20 text-sky-400 text-[8px] font-bold rounded uppercase tracking-wider">
                                        Staff
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] font-mono text-slate-500 mt-1">{account.email}</p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
                            </button>
                          );
                        })}
                      </div>

                      <div className="border-t border-slate-800/80 pt-3 mt-1 text-left">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                          Atau Tulis Akun Google Kustom
                        </p>
                        <form onSubmit={handleCustomSimulatedSubmit} className="space-y-2">
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                            <input
                              type="text"
                              value={customSimName}
                              onChange={(e) => setCustomSimName(e.target.value)}
                              placeholder="Nama Akun Lain"
                              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                            <input
                              type="email"
                              required
                              value={customSimEmail}
                              onChange={(e) => setCustomSimEmail(e.target.value)}
                              placeholder="email@lazuardi.sch.id"
                              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={!customSimEmail}
                            className="w-full py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all"
                          >
                            MASUK SEBAGAI AKUN SIMULASI
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Google Pop-up */
                  <div className="space-y-4 py-4 text-center">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Layanan masuk resmi menggunakan akun Google Workspace Lazuardi:
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#1e293b] font-extrabold text-xs uppercase tracking-wider rounded-xl border border-slate-250 shadow-md hover:shadow-lg transition-all duration-150 transform active:translate-y-px cursor-pointer"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335"/>
                      </svg>
                      MASUK DENGAN GOOGLE
                    </button>
                    <p className="text-[10px] text-slate-500 leading-normal italic text-center mt-3">
                      * Jika Anda menemui error auth/unauthorized-domain di lingkungan Sandbox ini, silakan klik tab "Bypass / Sandbox Demo" di atas.
                    </p>
                  </div>
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
