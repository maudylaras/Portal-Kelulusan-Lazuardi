import React, { useState, useMemo } from 'react';
import { Search, Download, CheckCircle2, XCircle, BookOpen, Award, FileCheck, Info, Sparkles } from 'lucide-react';
import { Batch, Participant } from '../types';

interface DashboardViewProps {
  batches: Batch[];
  onGoToBatch: (batchId: string) => void;
}

export default function DashboardView({ batches, onGoToBatch }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten participants and assign their batch name/id for fast global searching
  const allParticipantsWithBatch = useMemo(() => {
    return batches.flatMap((batch) =>
      batch.participants.map((p) => {
        // Find which training coaches/assistants apply to this participant's training
        const training = batch.trainings.find((t) => t.id === p.trainingId);
        return {
          ...p,
          batchId: batch.id,
          batchName: batch.name,
          coachName: training?.coachName || '-',
          assistantName: training?.assistantName || '-',
        };
      })
    );
  }, [batches]);

  // Filter participants by name or email or training name
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allParticipantsWithBatch.filter(
      (p) =>
        p.employeeName.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.trainingTitle.toLowerCase().includes(query)
    );
  }, [searchQuery, allParticipantsWithBatch]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalTrainings = 0;
    let totalParticipants = 0;
    let totalPassed = 0;

    batches.forEach((b) => {
      totalTrainings += b.trainings.length;
      totalParticipants += b.participants.length;
      totalPassed += b.participants.filter((p) => p.status === 'Lulus').length;
    });

    const passRate = totalParticipants > 0 ? Math.round((totalPassed / totalParticipants) * 100) : 0;

    return {
      totalTrainings,
      totalParticipants,
      totalPassed,
      passRate,
    };
  }, [batches]);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto py-4 text-slate-200">
      {/* Prime Header Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0d162d] via-[#111e3c] to-[#0d162d] border border-sky-500/10 p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Award className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Portal HR Mandiri
          </div>
          <h2 id="main-title" className="text-3xl font-extrabold tracking-tight mb-2">
            Portal Kelulusan Training Karyawan
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Selamat datang di layanan distribusi sertifikat mandiri. Di sini Anda dapat melakukan pencarian kelulusan secara praktis dan mengunduh sertifikat berlisensi yang tersertifikasi oleh Coach &amp; Asisten Coach kami.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 rounded-md border border-slate-800/80">
              <span className="text-emerald-450">●</span> 6 Batch Diklat Aktif
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 rounded-md border border-slate-800/80">
              <span className="text-sky-400">●</span> Cloud GDrive Server Terhubung
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-450 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Batch</p>
            <p className="text-2xl font-bold text-white">6 Batch</p>
          </div>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Materi Training</p>
            <p className="text-2xl font-bold text-white">{stats.totalTrainings} Kelas</p>
          </div>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-450 rounded-lg">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lulus Seleksi</p>
            <p className="text-2xl font-bold text-white">{stats.totalPassed} / {stats.totalParticipants}</p>
          </div>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-455 rounded-lg">
            <span className="text-xl font-black font-mono">%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tingkat Kelulusan</p>
            <p className="text-2xl font-bold text-white">{stats.passRate}%</p>
          </div>
        </div>
      </div>

      {/* Main Employee Search Portal */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="max-w-xl mx-auto text-center mb-8">
          <h3 className="text-lg font-bold text-white mb-1.5">
            Pencarian Cepat Sertifikat Peserta
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ketik nama lengkap Anda, alamat email kantor, atau nama training yang Anda ikuti untuk memverifikasi status kelulusan serta mengunduh dokumen sertifikat.
          </p>
        </div>

        {/* Input Bar */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-550">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik Nama Anda / Email (Contoh: Budi Santoso atau budi.santoso@company.com)..."
            className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-550 focus:border-sky-550 text-sm placeholder:text-slate-500 font-medium transition shadow-inner bg-slate-900/50 hover:bg-slate-900/80 text-white focus:bg-slate-950"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-white font-semibold"
            >
              Bersihkan
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {searchQuery ? (
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-slate-450 uppercase tracking-wide">
                  Hasil Pencarian untuk: "{searchQuery}"
                </span>
                <span className="text-xs px-2.5 py-1 bg-slate-905 text-slate-300 border border-slate-800 font-semibold rounded-md">
                  {filteredParticipants.length} Cocok
                </span>
              </div>

              {filteredParticipants.length > 0 ? (
                <div className="space-y-4">
                  {filteredParticipants.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-xl border border-slate-800 bg-slate-900/35 hover:bg-slate-900/65 transition flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-sky-500"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-white text-base">{p.employeeName}</span>
                          <span className="text-[10px] px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold rounded-md uppercase tracking-wider">
                            {p.batchName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-1 font-mono">{p.email}</p>
                        <p className="text-xs text-slate-200 font-semibold bg-slate-800 border border-slate-700/60 px-2.5 py-1 inline-block rounded mt-1">
                          Training: <span className="text-sky-300 font-bold">{p.trainingTitle}</span>
                        </p>
                        <div className="mt-2 text-xs text-slate-400 space-y-0.5">
                          <div>Coach: <span className="font-semibold text-slate-300">{p.coachName}</span></div>
                          <div>Asisten Coach: <span className="font-semibold text-slate-300">{p.assistantName}</span></div>
                        </div>
                      </div>

                      <div className="flex items-center md:flex-col md:items-end justify-between gap-3 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-slate-800">
                        <div className="flex items-center gap-1.5">
                          {p.status === 'Lulus' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Lulus
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                              <XCircle className="w-3.5 h-3.5" /> Tidak Lulus
                            </span>
                          )}
                        </div>

                        {p.status === 'Lulus' ? (
                          <a
                            href={p.certUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-sky-900/20"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Unduh Sertifikat (GDrive)
                          </a>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-slate-500 px-4 py-2.5 rounded-lg cursor-not-allowed border border-slate-750"
                            title="Sertifikat tidak tersedia karena status tidak kelulusan"
                          >
                            Sertifikat N/A
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/35 rounded-xl border border-dashed border-slate-800">
                  <p className="text-sm text-slate-300 font-semibold mb-1">
                    Nama atau Email Tidak Ditemukan
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Mohon pastikan ejaan nama atau email kantor Anda sudah benar. Jika Anda merasa sudah lulus berkas dan pelatihan namun data belum tercatat, silakan hubungi tim HR.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Petunjuk Pencarian Mandiri:
              </h4>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-5 leading-relaxed">
                <li>Gunakan <strong>Nama Lengkap Anda</strong> sesuai dengan data absensi atau ejaan KTP.</li>
                <li>Atau gunakan <strong>Email Kantor Resmi</strong> yang didaftarkan pada link registrasi awal.</li>
                <li>Hanya peserta dengan status kelulusan <strong className="text-emerald-450">Lulus</strong> yang akan mendapatkan tautan unduh sertifikat digital yang mengarah secara langsung ke folder resmi Google Drive perusahaan.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Directory of Batches */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-2">
          Ikhtisar Batch Kelulusan
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Saat ini terdapat 6 batch pelatihan terdokumentasi lengkap di portal ini. Klik pada kartu batch di bawah ini untuk melihat detail lengkap daftar karyawan, training yang diikuti, sertifikat instruktur, dan asisten.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((b) => {
            const passCount = b.participants.filter((p) => p.status === 'Lulus').length;
            const totalCount = b.participants.length;
            const batchPassRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

            return (
              <div
                key={b.id}
                onClick={() => onGoToBatch(b.id)}
                className="group border border-slate-800 hover:border-sky-500/30 rounded-xl p-5 hover:shadow-2xl hover:bg-slate-900/80 transition cursor-pointer text-left bg-slate-900/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-white font-mono">{b.name}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-405 border border-emerald-500/15 rounded-md">
                      Aktif
                    </span>
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                    PROGRAM PELATIHAN
                  </h4>
                  <div className="space-y-1.5 mb-4">
                    {b.trainings.length > 0 ? (
                      b.trainings.map((t) => (
                        <div key={t.id} className="text-xs font-bold text-slate-300 line-clamp-1">
                          • {t.title}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs italic text-slate-500">Belum ada kelas ditambahkan</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 mt-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                    <span>Partisipan: <strong className="text-slate-200">{totalCount} Karyawan</strong></span>
                    <span>Kelulusan: <strong className="text-emerald-400">{batchPassRate}%</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${batchPassRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
