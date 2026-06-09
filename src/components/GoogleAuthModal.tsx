import React, { useState } from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

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
      onClose();
    } catch (error: any) {
      console.error("Google Auth process error:", error);
      if (error.code === 'auth/popup-blocked') {
        setErrorMessage("Popup diblokir oleh browser. Silakan izinkan popup untuk situs ini.");
      } else if (error.code === 'auth/closed-by-user') {
        setErrorMessage("Konfirmasi Google Sign-In dibatalkan oleh pengguna.");
      } else {
        setErrorMessage(error.message || "Gagal autentikasi via Google.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Container */}
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl text-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Batal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading Spinner State */}
        {isLoading ? (
          <div className="p-8 py-16 text-center flex flex-col items-center justify-center min-h-[220px]">
            <div className="relative flex items-center justify-center mb-6">
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping"></span>
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-600">Menghubungkan ke Akun...</p>
            <p className="text-xs text-slate-400 mt-2">Membuka sesi aman dengan Firebase Auth</p>
          </div>
        ) : (
          <div>
            {/* Identity Styled Header */}
            <div className="p-6 pt-8 pb-4 text-center border-b border-slate-100">
              <h3 className="text-xl font-bold tracking-tight text-slate-800">
                Log In Portal Kelulusan
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Gunakan akun Google resmi Anda untuk masuk ke program
              </p>
            </div>

            {/* Content area */}
            <div className="p-6">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Gagal Autentikasi</p>
                    <p className="text-[11px] leading-relaxed mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Initial single beautiful Masuk dengan Google button */}
              <div className="space-y-4 py-4 text-center">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#1e293b] font-extrabold text-[#111827] text-xs uppercase tracking-wider rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-150 transform active:translate-y-px"
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

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
