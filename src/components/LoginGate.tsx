import React, { useState } from 'react';
import { Mail, Shield, User, ArrowRight, AlertTriangle, KeyRound } from 'lucide-react';
import { GoogleUser } from './GoogleAuthModal';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

interface LoginGateProps {
  onLoginSuccess: (user: GoogleUser) => void;
}

export default function LoginGate({ onLoginSuccess }: LoginGateProps) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<GoogleUser | null>(null);
  const [isGoogleFlowActive, setIsGoogleFlowActive] = useState(false);

  const defaultAccounts = [
    {
      name: 'Maudy Lazuardi',
      email: 'maudy@lazuardi.sch.id',
      avatar: 'ML',
      role: 'Admin' as const,
    },
    {
      name: 'Staff HR Division',
      email: 'staff.hr@lazuardi.sch.id',
      avatar: 'SH',
      role: 'Staff' as const,
    }
  ];

  const handleSelectAccount = (account: typeof defaultAccounts[0]) => {
    setCustomEmail(account.email);
    setCustomName(account.name);
    setAuthMode('signin');
    setErrorMessage('');
    setPassword('');
    setIsAddingAccount(true);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !password) return;

    setIsLoading(true);
    setErrorMessage('');

    const emailLower = customEmail.toLowerCase().trim();

    try {
      if (authMode === 'signup') {
        // Sign Up with Email and Password
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password);
        
        // Update user display name
        const derivedName = customName.trim() || emailLower.split('@')[0].replace(/[\._]/g, ' ');
        const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
        
        try {
          await updateProfile(userCredential.user, {
            displayName: formattedName
          });
        } catch (profileError) {
          console.error("Error setting displayName:", profileError);
        }

        // Cache the formatted name instantly for synchronous UI update
        localStorage.setItem(`profile_name_${emailLower}`, formattedName);

        const isAdminAccount = emailLower === 'maudy@lazuardi.sch.id' || emailLower.includes('maudy@lazuardi');
        const role = isAdminAccount ? 'Admin' : 'Guest';
        const newUser: GoogleUser = {
          name: formattedName,
          email: emailLower,
          avatar: formattedName.slice(0, 2).toUpperCase(),
          role: role,
        };

        onLoginSuccess(newUser);
      } else {
        // Sign In with Email and Password
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, password);
        
        const email = userCredential.user.email || emailLower;
        let displayName = userCredential.user.displayName;
        if (!displayName) {
          const storedProfile = localStorage.getItem(`profile_name_${email.toLowerCase()}`);
          displayName = storedProfile || email.split('@')[0].replace(/[\._]/g, ' ');
        }
        const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

        const isAdminAccount = email.toLowerCase() === 'maudy@lazuardi.sch.id' || email.toLowerCase().includes('maudy@lazuardi');
        const role = isAdminAccount ? 'Admin' : 'Guest';
        const newUser: GoogleUser = {
          name: formattedName,
          email: email,
          avatar: formattedName.slice(0, 2).toUpperCase(),
          role: role,
        };

        onLoginSuccess(newUser);
      }
    } catch (error: any) {
      console.error("Auth process error: ", error);
      if (authMode === 'signin') {
        setErrorMessage("Email or password is incorrect");
      } else {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage("User already exists. Please sign in");
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage("Password should be at least 6 characters");
        } else {
          setErrorMessage(error.message || "Authentication failed. Please verify credentials.");
        }
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
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {isLoading ? (
            /* Loading State */
            <div className="p-8 py-16 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="relative flex items-center justify-center mb-6">
                <span className="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping"></span>
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm font-bold text-slate-200">Menghubungkan ke Akun...</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">Saling sapa aman melalui Firebase Auth</p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-800/60 bg-slate-900/40 flex flex-col items-center text-center">
                <div className="h-8 mb-2 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-white tracking-tight uppercase">
                    Firebase Authentication
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pintu masuk terenkripsi sistem terpadu CARE &amp; R&amp;D.
                </p>
              </div>

              <div className="p-6">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Gagal Masuk</p>
                      <p className="text-[11px] leading-relaxed mt-1">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {!isGoogleFlowActive ? (
                  /* Initial single beautiful Masuk dengan Google button */
                  <div className="space-y-4 py-4 text-center">
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Silakan masuk menggunakan akun Google Anda:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsGoogleFlowActive(true);
                        setIsAddingAccount(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#1e293b] font-extrabold text-xs uppercase tracking-wider rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-150 transform active:translate-y-px"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335"/>
                      </svg>
                      MASUK DENGAN GOOGLE
                    </button>
                  </div>
                ) : !isAddingAccount ? (
                  /* Quick Account Choice */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        PILIH AKUN GOOGLE
                      </span>
                      <button 
                        type="button"
                        onClick={() => setIsGoogleFlowActive(false)}
                        className="text-xs text-sky-450 hover:text-sky-400 font-bold"
                      >
                        Batal
                      </button>
                    </div>

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
                                <p className="text-[11px] font-mono text-slate-500 mt-1">{account.email}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingAccount(true);
                        setAuthMode('signin');
                        setCustomEmail('');
                        setCustomName('');
                        setPassword('');
                        setErrorMessage('');
                      }}
                      className="w-full py-3 px-4 border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition text-center"
                    >
                      + Masuk / Daftar dengan Email Lain
                    </button>
                  </div>
                ) : (
                  /* High Fidelity Custom Email & Password form */
                  <form onSubmit={handleCustomSubmit} className="space-y-4">
                    {/* Tab Selector */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 border border-slate-850 rounded-xl mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setErrorMessage('');
                        }}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          authMode === 'signin'
                            ? 'bg-slate-900 text-white shadow'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Masuk (Sign In)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setErrorMessage('');
                        }}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          authMode === 'signup'
                            ? 'bg-slate-900 text-white shadow'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Pendaftaran (Sign Up)
                      </button>
                    </div>

                    <div className="space-y-3">
                      {authMode === 'signup' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Nama Lengkap
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                              type="text"
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value)}
                              placeholder="Masukkan nama lengkap"
                              className="w-full pl-10 pr-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Alamat E-mail *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                            placeholder="nama@lazuardi.sch.id"
                            className="w-full pl-10 pr-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Kata Sandi / Password *
                        </label>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
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
                          setErrorMessage('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={!customEmail || !password}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition disabled:opacity-50"
                      >
                        {authMode === 'signin' ? 'Masuk Sekarang' : 'Daftar Baru'}
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
