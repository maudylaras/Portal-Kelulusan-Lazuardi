import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import BatchView from './components/BatchView';
import { initialBatches } from './data/initialData';
import { Batch } from './types';
import { Shield, Sparkles, LogOut, Award, UserCheck } from 'lucide-react';
import GoogleAuthModal, { GoogleUser } from './components/GoogleAuthModal';
import LoginGate from './components/LoginGate';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

export default function App() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard'); // 'dashboard' or 'batch-1', 'batch-2', etc.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  // Custom states for durable cloud persistence tracking and error handling
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isCheckingUserDoc, setIsCheckingUserDoc] = useState<boolean>(false);
  const [isBatchesLoading, setIsBatchesLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [batchesError, setBatchesError] = useState<string>('');

  // Function to load batches from Firestore
  const loadBatchesFromFirestore = async (userRole: string) => {
    setIsBatchesLoading(true);
    setBatchesError('');
    try {
      const batchesCol = collection(db, 'batches');
      let querySnapshot;
      try {
        querySnapshot = await getDocs(batchesCol);
      } catch (getErr: any) {
        // Requirement 12: If Firestore returns permission-denied, do not treat it as an empty collection.
        handleFirestoreError(getErr, OperationType.GET, 'batches');
      }

      if (querySnapshot.empty) {
        // Requirement 11: Only initialize default batch data after confirming:
        // - the logged-in user role is "admin"
        // - the batches collection is truly empty
        if (userRole === 'admin' || userRole === 'Admin') {
          const initialList = [...initialBatches];
          for (const b of initialList) {
            await setDoc(doc(db, 'batches', b.id), b);
          }
          setBatches(initialList);
          localStorage.setItem('training_portal_batches', JSON.stringify(initialList));
        } else {
          setBatches([]);
        }
      } else {
        const loaded: Batch[] = [];
        querySnapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as Batch);
        });
        loaded.sort((a, b) => a.id.localeCompare(b.id));
        setBatches(loaded);
        localStorage.setItem('training_portal_batches', JSON.stringify(loaded));
      }
    } catch (error: any) {
      console.error("Gagal mengambil data dari Firestore:", error);
      // Requirement 15: Add Indonesian error messages
      let msg = "Database belum dapat dimuat. Silakan refresh halaman.";
      if (error.message && (error.message.includes("permission") || error.message.includes("Missing or insufficient permissions"))) {
        msg = "Anda tidak memiliki izin untuk mengakses data ini.";
      } else if (error.message && error.message.includes("Role admin")) {
        msg = "Role admin belum terdaftar di Firestore.";
      }
      setBatchesError(msg);
    } finally {
      setIsBatchesLoading(false);
    }
  };

  // Initialize data and loaded Google User on mount
  useEffect(() => {
    // 10. Only call getDocs(collection(db, "batches")) after Firebase Auth state is fully ready.
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthError('');
      setBatchesError('');
      
      if (firebaseUser) {
        setIsCheckingUserDoc(true);
        try {
          const uid = firebaseUser.uid;
          const userDocRef = doc(db, 'users', uid);
          
          let docSnap;
          try {
            docSnap = await getDoc(userDocRef);
          } catch (getErr) {
            handleFirestoreError(getErr, OperationType.GET, 'users/' + uid);
          }

          let dbRole = 'user';
          const emailLower = (firebaseUser.email || '').toLowerCase();
          const isAdminEmail = emailLower === 'maudy@lazuardi.sch.id' || emailLower.includes('maudy@lazuardi');

          // If the user document does not exist, create it automatically
          if (!docSnap.exists()) {
            dbRole = isAdminEmail ? 'admin' : 'user';

            const newUserDoc = {
              uid: uid,
              name: firebaseUser.displayName || emailLower.split('@')[0].replace(/[\._]/g, ' '),
              email: firebaseUser.email || '',
              emailLower: emailLower,
              photoURL: firebaseUser.photoURL || '',
              role: dbRole,
              status: "active",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            };

            try {
              await setDoc(userDocRef, newUserDoc);
            } catch (setErr) {
              handleFirestoreError(setErr, OperationType.CREATE, 'users/' + uid);
            }
          } else {
            // If user document already exists, don't recreate it to preserve current role
            const existingData = docSnap.data();
            dbRole = existingData.role || 'user';

            // Check if admin email does not have admin role
            if (isAdminEmail && dbRole !== 'admin') {
              // Ensure we check and escalate if it's the official administrator maudy
              dbRole = 'admin';
              try {
                await updateDoc(userDocRef, { role: 'admin' });
              } catch (updErr) {
                handleFirestoreError(updErr, OperationType.UPDATE, 'users/' + uid);
              }
            }

            // Update safety light info on login
            const updatePayload: any = {
              lastLoginAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            if (firebaseUser.photoURL && firebaseUser.photoURL !== existingData.photoURL) {
              updatePayload.photoURL = firebaseUser.photoURL;
            }
            try {
              await updateDoc(userDocRef, updatePayload);
            } catch (updErr) {
              handleFirestoreError(updErr, OperationType.UPDATE, 'users/' + uid);
            }
          }

          // Role admin verification: if admin email has been registered incorrectly or blocked
          if (isAdminEmail && dbRole !== 'admin') {
            throw new Error("Role admin belum terdaftar di Firestore.");
          }

          const isDbAdmin = dbRole === 'admin' || dbRole === 'Admin';
          const reactRole = isDbAdmin ? 'Admin' : 'Staff';

          let finalName = firebaseUser.displayName;
          if (!finalName) {
            const storedProfile = localStorage.getItem(`profile_name_${emailLower}`);
            finalName = storedProfile || emailLower.split('@')[0].replace(/[\._]/g, ' ');
          }
          const formattedName = finalName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const avatar = formattedName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'US';

          const userObj: GoogleUser = {
            name: formattedName,
            email: firebaseUser.email || '',
            avatar: avatar,
            role: reactRole as any,
            uid: uid
          };

          setCurrentUser(userObj);
          setIsAdmin(isDbAdmin);
          setIsCheckingUserDoc(false);

          // Now start fetching batches only after Auth setup is solid
          await loadBatchesFromFirestore(dbRole);

        } catch (error: any) {
          console.error("Firestore user verification/sync error:", error);
          let friendlyError = "Data akun belum dapat dibuat. Silakan hubungi admin.";
          if (error.message && (error.message.includes("permission") || error.message.includes("insufficient permissions"))) {
            friendlyError = "Anda tidak memiliki izin untuk mengakses data ini.";
          } else if (error.message && error.message.includes("Role admin")) {
            friendlyError = "Role admin belum terdaftar di Firestore.";
          }
          setAuthError(friendlyError);
          try {
            await signOut(auth);
          } catch (soErr) {
            console.error("Sign-out failed:", soErr);
          }
          setCurrentUser(null);
          setIsAdmin(false);
          setIsCheckingUserDoc(false);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        // Keep simulated bypass user if loaded previously (does not have a uid)
        setCurrentUser((prev) => {
          if (prev && !prev.uid) {
            return prev;
          }
          return null;
        });
        setIsAdmin((prev) => {
          return auth.currentUser ? false : prev;
        });
        setIsAuthLoading(false);
        setIsCheckingUserDoc(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state back to localStorage and write to Firestore if admin is authenticated
  const handleUpdateBatch = async (updatedBatch: Batch) => {
    const nextBatches = batches.map((b) => (b.id === updatedBatch.id ? updatedBatch : b));
    setBatches(nextBatches);
    localStorage.setItem('training_portal_batches', JSON.stringify(nextBatches));

    if (auth.currentUser && isAdmin) {
      try {
        await setDoc(doc(db, 'batches', updatedBatch.id), updatedBatch);
      } catch (error) {
        console.error("Failed to save batch updates to Firestore:", error);
        alert("Gagal menyimpan perubahan ke Firestore. Silakan hubungi admin.");
      }
    }
  };

  const handleLoginSuccess = (user: GoogleUser) => {
    setCurrentUser(user);
    const emailLower = user.email.toLowerCase();
    const isMaudy = emailLower === 'maudy@lazuardi.sch.id' || emailLower.includes('maudy@lazuardi');
    setIsAdmin(isMaudy);

    // Load local storage fallback for simulation accounts
    const storedData = localStorage.getItem('training_portal_batches');
    if (storedData) {
      try {
        setBatches(JSON.parse(storedData));
      } catch (e) {
        setBatches(initialBatches);
      }
    } else {
      setBatches(initialBatches);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error during sign out:', e);
    }
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // Find the selected batch object if activeView starts with 'batch-'
  const selectedBatch = batches.find((b) => b.id === activeView);

  if (isAuthLoading || isCheckingUserDoc || isBatchesLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md z-10 text-center flex flex-col items-center justify-center min-h-[220px]">
          <div className="relative flex items-center justify-center mb-6">
            <span className="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping"></span>
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-bold text-slate-200">
            {isAuthLoading ? "Memverifikasi Autentikasi..." : 
             isCheckingUserDoc ? "Pengecekan Profil Karyawan..." : 
             "Sinkronisasi Database Pelatihan..."}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-mono">Lazuardi Portal Keamanan Berbasis Firestore</p>
        </div>
      </div>
    );
  }

  // Indonesian security or connection error handler screen
  if (authError || batchesError) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-sm z-10 text-center bg-[#0f172a] border border-red-500/20 p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 mb-4 animate-pulse">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Terjadi Hambatan Akses</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{authError || batchesError}</p>
          
          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 transition-colors"
            >
              Refresh Halaman
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 font-semibold rounded-xl text-[11px] text-white transition-colors"
            >
              Keluar Sesi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginGate onLoginSuccess={handleLoginSuccess} initialErrorMessage={authError} />;
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
        batches={batches}
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
