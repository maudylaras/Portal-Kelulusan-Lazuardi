import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import BatchView from './components/BatchView';
import { initialBatches } from './data/initialData';
import { Batch } from './types';
import { Shield, Sparkles, LogOut, Award, UserCheck } from 'lucide-react';
import GoogleAuthModal, { GoogleUser } from './components/GoogleAuthModal';
import LoginGate from './components/LoginGate';

export default function App() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard'); // 'dashboard' or 'batch-1', 'batch-2', etc.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Initialize data and loaded Google User on mount
  useEffect(() => {
    // Load training batches
    const storedData = localStorage.getItem('training_portal_batches');
    if (storedData) {
      try {
        setBatches(JSON.parse(storedData));
      } catch (e) {
        console.error('Error loading stored training batches, resetting to defaults.', e);
        setBatches(initialBatches);
      }
    } else {
      setBatches(initialBatches);
      localStorage.setItem('training_portal_batches', JSON.stringify(initialBatches));
    }

    // Load active Google Account
    const storedUser = localStorage.getItem('training_portal_user');
    if (storedUser) {
      try {
        const parsed: GoogleUser = JSON.parse(storedUser);
        setCurrentUser(parsed);
        const emailLower = parsed.email.toLowerCase();
        if (emailLower === 'maudy@lazuardi' || emailLower.includes('maudy@lazuardi')) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error('Error loading stored Google user:', e);
      }
    }
  }, []);

  // Sync state back to localStorage
  const handleUpdateBatch = (updatedBatch: Batch) => {
    const nextBatches = batches.map((b) => (b.id === updatedBatch.id ? updatedBatch : b));
    setBatches(nextBatches);
    localStorage.setItem('training_portal_batches', JSON.stringify(nextBatches));
  };

  const handleToggleAdmin = () => {
    if (currentUser && (currentUser.email.toLowerCase() === 'maudy@lazuardi' || currentUser.email.toLowerCase().includes('maudy@lazuardi'))) {
      setIsAdmin((prev) => !prev);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: GoogleUser) => {
    setCurrentUser(user);
    localStorage.setItem('training_portal_user', JSON.stringify(user));
    const emailLower = user.email.toLowerCase();
    if (emailLower === 'maudy@lazuardi' || emailLower.includes('maudy@lazuardi')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('training_portal_user');
  };

  // Find the selected batch object if activeView starts with 'batch-'
  const selectedBatch = batches.find((b) => b.id === activeView);

  if (!currentUser) {
    return <LoginGate onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex bg-[#020617] text-slate-200 min-h-screen relative antialiased leading-normal font-sans">
      {/* Sidebar with elegant dark blue-slate background */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#020617]">
        {/* Real-time elegant header bar */}
        <header className="bg-[#0f172a] border-b border-slate-800 h-20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            {/* Hamburger menu button for mobile screens */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 hover:text-white transition-colors"
              aria-label="Buka Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">
                Sistem Penyaluran Digital
              </p>
              <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                {activeView === 'dashboard' ? 'Menu Utama / Portal Pencarian' : `Manajemen Program - ${selectedBatch?.name || ''}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Real-time Indicator or Status Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium font-mono text-[11px]">Sistem Online &amp; Terlindungi</span>
            </div>

            {/* Google Authentication Account Status in top header */}
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900/70 border border-slate-800 px-3.5 py-1.5 rounded-xl">
                <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold text-xs ring-2 ${
                  isAdmin 
                    ? 'bg-amber-500/20 text-amber-400 ring-amber-500/40' 
                    : 'bg-sky-500/20 text-sky-400 ring-sky-500/30'
                }`}>
                  {currentUser.avatar}
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-[12px] font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                  {isAdmin ? (
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded">
                      Viewer
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-800/50 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 border border-slate-250 font-bold px-3.5 py-2 rounded-xl text-xs tracking-tight transition-all duration-150 shadow-sm hover:shadow-md"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Masuk dengan Google</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Container */}
        <main className="p-6 sm:p-10 flex-1 bg-[#020617]">
          <div id="applet-body">
            {activeView === 'dashboard' ? (
              <DashboardView
                batches={batches}
                onGoToBatch={(batchId) => setActiveView(batchId)}
              />
            ) : selectedBatch ? (
              <div key={selectedBatch.id}>
                <BatchView
                  batch={selectedBatch}
                  isAdmin={isAdmin}
                  onUpdateBatch={handleUpdateBatch}
                />
              </div>
            ) : (
              <div className="text-center py-20 bg-[#0f172a] border border-slate-850 rounded-2xl shadow-xl">
                <p className="text-sm text-slate-400">Memuat data portal...</p>
              </div>
            )}
          </div>
        </main>

        {/* Compact Footer */}
        <footer className="bg-[#0f172a] border-t border-slate-800 px-8 py-5 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans">
          <div>
            &copy; 2026 <strong>Lazuardi Training Center (CARE &amp; R&amp;D Division)</strong>. All rights reserved. Administrator <span className="font-mono text-slate-400 select-all">maudy@lazuardi.sch.id</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 transition cursor-default">Syarat &amp; Ketentuan</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-default">Pusat Bantuan CARE &amp; R&amp;D</span>
          </div>
        </footer>
      </div>

      {/* Google Sign In Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
