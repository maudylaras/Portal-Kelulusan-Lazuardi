import React from 'react';
import { Home, Award, Lock, Unlock, Shield, Users, X } from 'lucide-react';
import { GoogleUser } from './GoogleAuthModal';

interface SidebarProps {
  activeView: string; // 'dashboard' or 'batch-1', 'batch-2', etc.
  onViewChange: (view: string) => void;
  isAdmin: boolean;
  currentUser: GoogleUser | null;
  onLoginClick: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeView,
  onViewChange,
  isAdmin,
  currentUser,
  onLoginClick,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const batches = [1, 2, 3, 4, 5, 6];

  const handleNavClick = (view: string) => {
    onViewChange(view);
    if (onClose) onClose();
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#0f172a] text-slate-100 flex flex-col justify-between border-r border-[#1e293b] font-sans h-screen transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Branding Header */}
      <div className="p-6 border-b border-[#1e293b] bg-[#0b1329]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-sky-400 uppercase leading-tight">
                Portal Kelulusan
              </h1>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold tracking-wider">
                CARE &amp; R&amp;D TRAINING SYSTEM
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu / Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar">
        <div>
          <span className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-3">
            Menu Utama
          </span>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeView === 'dashboard'
                ? 'bg-sky-600/15 text-sky-400 border border-sky-500/20 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Dashboard &amp; Unduh</span>
          </button>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-3">
            Daftar Batch Kelulusan
          </span>
          <div className="space-y-1.5">
            {batches.map((num) => {
              const viewId = `batch-${num}`;
              const isSelected = activeView === viewId;
              return (
                <button
                  key={num}
                  onClick={() => handleNavClick(viewId)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isSelected
                      ? 'bg-sky-600/10 text-sky-400 border border-sky-500/20 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected
                        ? 'bg-sky-400 scale-125'
                        : 'bg-emerald-500/70 group-hover:bg-emerald-400'
                    }`}
                  />
                  <span>Batch {num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Help Box */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <h4 className="text-xs font-semibold text-sky-400 flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            Cari Cepat
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Peserta dapat langsung mencari kelulusan di <strong>Dashboard</strong> menggunakan Nama atau Email.
          </p>
        </div>
      </div>

      {/* Access Authentication Status Badge */}
      <div className="p-4 border-t border-[#1e293b] bg-[#0b1329] space-y-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isAdmin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800/50 text-slate-400'}`}>
              {isAdmin ? <Unlock className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Lock className="w-4 h-4 text-slate-500" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isAdmin ? 'Akses Admin Aktif' : 'Akses Terbuka (Viewer)'}
              </p>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
                {isAdmin ? 'Akses Sunting &amp; Tambah' : 'Lihat Data Saja'}
              </p>
            </div>
          </div>
          <div>
            {isAdmin ? (
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 shadow-emerald-500/20" />
            ) : (
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-600" />
            )}
          </div>
        </div>

        {/* Dynamic bottom message helper */}
        {!currentUser ? (
          <button
            onClick={onLoginClick}
            className="w-full text-center py-1.5 px-3 rounded bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/20 text-[10px] text-amber-400 font-semibold transition block"
          >
            🔒 Masuk Google (maudy@lazuardi) untuk mengelola data
          </button>
        ) : (currentUser.email.toLowerCase() === 'maudy@lazuardi' || currentUser.email.toLowerCase().includes('maudy@lazuardi')) ? (
          <div className="text-center py-1 px-3 bg-emerald-500/10 border border-emerald-500/15 text-[10px] text-emerald-450 rounded font-semibold">
            ✨ Terverifikasi sebagai Administrator Sistem
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full text-center py-1 px-3 bg-rose-500/10 border border-rose-500/15 text-[10px] text-rose-400 hover:text-rose-300 font-semibold rounded transition block"
          >
            Ganti ke Akun Admin maudy@lazuardi
          </button>
        )}
      </div>
    </div>
  );
}
