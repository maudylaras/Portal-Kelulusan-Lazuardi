import React, { useState } from 'react';
import { Mail, Shield, User, X, AlertTriangle, ArrowRight } from 'lucide-react';

export interface GoogleUser {
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Staff' | 'Guest';
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: GoogleUser) => void;
}

export default function GoogleAuthModal({ isOpen, onClose, onLoginSuccess }: GoogleAuthModalProps) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GoogleUser | null>(null);

  if (!isOpen) return null;

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
      onClose();
    }, 1200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    // Default name if empty
    const derivedName = customName || customEmail.split('@')[0].replace('.', ' ');
    const emailLower = customEmail.toLowerCase().trim();

    // Check if the user entered any variation of "maudy@lazuardi" to promote them
    const isAdminAccount = emailLower.includes('maudy@lazuardi');

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
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      {/* Container */}
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl text-slate-800 animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Batal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading Spinner State */}
        {isLoading && selectedUser ? (
          <div className="p-8 py-16 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="relative flex items-center justify-center mb-6">
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping"></span>
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-600">Menghubungkan ke Akun Google...</p>
            <p className="text-xs text-slate-400 mt-2">Membuka sesi aman untuk {selectedUser.email}</p>
          </div>
        ) : (
          <div>
            {/* Google Identity Styled Header */}
            <div className="p-6 pt-8 pb-4 text-center border-b border-slate-100">
              <div className="flex justify-center mb-4">
                {/* Official standard Google high-fidelity SVG Icon */}
                <svg className="w-8 h-8" viewBox="0 0 24 24">
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
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-800">
                Log In dengan Google
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Pilih atau daftarkan akun e-mail Anda untuk mengakses program
              </p>
            </div>

            {/* Content area */}
            <div className="p-6">
              {!isAddingAccount ? (
                /* Select existing simulated Google accounts */
                <div className="space-y-4">
                  <div className="space-y-2">
                    {defaultAccounts.map((account) => {
                      const isMainAdmin = account.email === 'maudy@lazuardi.sch.id';
                      return (
                        <button
                          key={account.email}
                          onClick={() => handleSelectAccount(account)}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all text-left duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              isMainAdmin 
                                ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400/20' 
                                : 'bg-sky-100 text-sky-700'
                            }`}>
                              {account.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                                {account.name}
                                {isMainAdmin && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-700 text-[9px] font-bold rounded">
                                    <Shield className="w-2.5 h-2.5" /> Admin
                                  </span>
                                )}
                              </p>
                              <p className="text-xs font-mono text-slate-500 mt-0.5">{account.email}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Google Account Button */}
                  <button
                    onClick={() => setIsAddingAccount(true)}
                    className="w-full py-2.5 px-4 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition text-center"
                  >
                    + Gunakan Akun Google Lain
                  </button>
                </div>
              ) : (
                /* Custom Google Account Login Form */
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Alamat E-mail Google *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          placeholder="maudy@lazuardi.sch.id atau email Anda"
                          className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Nama Lengkap (Opsional)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="Maudy Lazuardi"
                          className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 bg-white"
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
                      className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={!customEmail}
                      className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition disabled:opacity-50"
                    >
                      Masuk dengan Google
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
