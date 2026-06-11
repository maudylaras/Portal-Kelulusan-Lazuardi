import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  ExternalLink,
  Award,
  Download,
  UserPlus,
  Check,
  X,
  FileCheck2,
  Save,
} from 'lucide-react';
import { Batch, Training, Participant } from '../types';

interface BatchViewProps {
  batch: Batch;
  isAdmin: boolean;
  onUpdateBatch: (updatedBatch: Batch) => void;
}

export default function BatchView({ batch, isAdmin, onUpdateBatch }: BatchViewProps) {
  // Batch/Program name editing state
  const [isEditingBatchName, setIsEditingBatchName] = useState(false);
  const [editBatchName, setEditBatchName] = useState(batch.name);

  useEffect(() => {
    setEditBatchName(batch.name);
  }, [batch.name]);

  // Local state for forms
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  // Training form states
  const [newTrainingTitle, setNewTrainingTitle] = useState('');
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachCert, setNewCoachCert] = useState('');
  const [newAssistantName, setNewAssistantName] = useState('');
  const [newAssistantCert, setNewAssistantCert] = useState('');
  const [newCoach2Name, setNewCoach2Name] = useState('');
  const [newCoach2CertUrl, setNewCoach2CertUrl] = useState('');
  const [newAssistant2Name, setNewAssistant2Name] = useState('');
  const [newAssistant2CertUrl, setNewAssistant2CertUrl] = useState('');

  // Participant form states
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  const [newParticipantStatus, setNewParticipantStatus] = useState<'Lulus' | 'Tidak Lulus'>('Lulus');
  const [newParticipantCert, setNewParticipantCert] = useState('');

  // Editing Participant inline states
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<'Lulus' | 'Tidak Lulus'>('Lulus');
  const [editCertUrl, setEditCertUrl] = useState('');
  const [editTrainingId, setEditTrainingId] = useState('');

  // Editing Training states
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);
  const [editTrainingTitle, setEditTrainingTitle] = useState('');
  const [editCoachName, setEditCoachName] = useState('');
  const [editCoachCert, setEditCoachCert] = useState('');
  const [editAssistantName, setEditAssistantName] = useState('');
  const [editAssistantCert, setEditAssistantCert] = useState('');
  const [editCoach2Name, setEditCoach2Name] = useState('');
  const [editCoach2CertUrl, setEditCoach2CertUrl] = useState('');
  const [editAssistant2Name, setEditAssistant2Name] = useState('');
  const [editAssistant2CertUrl, setEditAssistant2CertUrl] = useState('');

  // Add a new training
  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainingTitle || !newCoachName) return;

    const newId = `t-${Date.now()}`;
    const newTraining: Training = {
      id: newId,
      title: newTrainingTitle,
      coachName: newCoachName,
      coachCertUrl: newCoachCert || 'https://drive.google.com',
      assistantName: newAssistantName || '-',
      assistantCertUrl: newAssistantCert || 'https://drive.google.com',
      coach2Name: newCoach2Name.trim() || undefined,
      coach2CertUrl: newCoach2CertUrl.trim() || undefined,
      assistant2Name: newAssistant2Name.trim() || undefined,
      assistant2CertUrl: newAssistant2CertUrl.trim() || undefined,
    };

    const updatedBatch: Batch = {
      ...batch,
      trainings: [...batch.trainings, newTraining],
    };

    onUpdateBatch(updatedBatch);

    // Reset fields
    setNewTrainingTitle('');
    setNewCoachName('');
    setNewCoachCert('');
    setNewAssistantName('');
    setNewAssistantCert('');
    setNewCoach2Name('');
    setNewCoach2CertUrl('');
    setNewAssistant2Name('');
    setNewAssistant2CertUrl('');
    setShowAddTraining(false);
  };

  // Add a new participant
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName || !newParticipantEmail || !selectedTrainingId) return;

    const matchedTraining = batch.trainings.find((t) => t.id === selectedTrainingId);
    if (!matchedTraining) return;

    const newId = `p-${Date.now()}`;
    const newParticipant: Participant = {
      id: newId,
      employeeName: newParticipantName,
      email: newParticipantEmail,
      trainingId: selectedTrainingId,
      trainingTitle: matchedTraining.title,
      status: newParticipantStatus,
      certUrl: newParticipantStatus === 'Lulus' ? newParticipantCert || 'https://drive.google.com' : '',
    };

    const updatedBatch: Batch = {
      ...batch,
      participants: [...batch.participants, newParticipant],
    };

    onUpdateBatch(updatedBatch);

    // Reset fields
    setNewParticipantName('');
    setNewParticipantEmail('');
    setSelectedTrainingId('');
    setNewParticipantStatus('Lulus');
    setNewParticipantCert('');
    setShowAddParticipant(false);
  };

  // Delete training & related participants
  const handleDeleteTraining = (trainingId: string) => {
    const updatedTrainings = batch.trainings.filter((t) => t.id !== trainingId);
    const updatedParticipants = batch.participants.filter((p) => p.trainingId !== trainingId);

    const updatedBatch: Batch = {
      ...batch,
      trainings: updatedTrainings,
      participants: updatedParticipants,
    };
    onUpdateBatch(updatedBatch);
  };

  // Delete participant
  const handleDeleteParticipant = (participantId: string) => {
    const updatedParticipants = batch.participants.filter((p) => p.id !== participantId);
    const updatedBatch: Batch = {
      ...batch,
      participants: updatedParticipants,
    };
    onUpdateBatch(updatedBatch);
  };

  // Begin inline edit participant
  const startEditParticipant = (p: Participant) => {
    setEditingParticipantId(p.id);
    setEditStatus(p.status);
    setEditCertUrl(p.certUrl);
    setEditTrainingId(p.trainingId);
  };

  // Save inline edit participant
  const saveEditParticipant = (pId: string) => {
    const matchedTraining = batch.trainings.find((t) => t.id === editTrainingId);
    if (!matchedTraining) return;

    const updatedParticipants = batch.participants.map((p) => {
      if (p.id === pId) {
        return {
          ...p,
          trainingId: editTrainingId,
          trainingTitle: matchedTraining.title,
          status: editStatus,
          certUrl: editStatus === 'Lulus' ? editCertUrl : '',
        };
      }
      return p;
    });

    const updatedBatch: Batch = {
      ...batch,
      participants: updatedParticipants,
    };
    onUpdateBatch(updatedBatch);
    setEditingParticipantId(null);
  };

  // Begin edit training
  const startEditTraining = (t: Training) => {
    setEditingTrainingId(t.id);
    setEditTrainingTitle(t.title);
    setEditCoachName(t.coachName);
    setEditCoachCert(t.coachCertUrl);
    setEditAssistantName(t.assistantName);
    setEditAssistantCert(t.assistantCertUrl);
    setEditCoach2Name(t.coach2Name || '');
    setEditCoach2CertUrl(t.coach2CertUrl || '');
    setEditAssistant2Name(t.assistant2Name || '');
    setEditAssistant2CertUrl(t.assistant2CertUrl || '');
  };

  // Save edit training
  const saveEditTraining = (tId: string) => {
    const updatedTrainings = batch.trainings.map((t) => {
      if (t.id === tId) {
        return {
          ...t,
          title: editTrainingTitle,
          coachName: editCoachName,
          coachCertUrl: editCoachCert,
          assistantName: editAssistantName,
          assistantCertUrl: editAssistantCert,
          coach2Name: editCoach2Name.trim() || undefined,
          coach2CertUrl: editCoach2CertUrl.trim() || undefined,
          assistant2Name: editAssistant2Name.trim() || undefined,
          assistant2CertUrl: editAssistant2CertUrl.trim() || undefined,
        };
      }
      return t;
    });

    // Also update trainingTitle caches inside participants
    const updatedParticipants = batch.participants.map((p) => {
      if (p.trainingId === tId) {
        return {
          ...p,
          trainingTitle: editTrainingTitle,
        };
      }
      return p;
    });

    const updatedBatch: Batch = {
      ...batch,
      trainings: updatedTrainings,
      participants: updatedParticipants,
    };
    onUpdateBatch(updatedBatch);
    setEditingTrainingId(null);
  };

  // Cancel edits
  const cancelEditParticipant = () => {
    setEditingParticipantId(null);
  };

  const cancelEditTraining = () => {
    setEditingTrainingId(null);
  };

  const handleSaveBatchName = () => {
    if (!editBatchName.trim()) return;
    const updatedBatch: Batch = {
      ...batch,
      name: editBatchName.trim(),
    };
    onUpdateBatch(updatedBatch);
    setIsEditingBatchName(false);
  };

  const activeGraduationCount = batch.participants.filter((p) => p.status === 'Lulus').length;
  const activePercent = batch.participants.length > 0 ? Math.round((activeGraduationCount / batch.participants.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-sans text-slate-200">
      {/* Batch Header Cover */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0d162d] via-[#111e3c] to-[#0d162d] px-6 py-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-3 py-1 rounded-md border border-sky-500/20">
              Manajemen Kelompok
            </span>
            {isEditingBatchName ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={editBatchName}
                  onChange={(e) => setEditBatchName(e.target.value)}
                  className="bg-[#0b1329] text-white font-bold text-xl px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 w-full max-w-sm"
                  autoFocus
                />
                <button
                  onClick={handleSaveBatchName}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                  title="Simpan Nama Program"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditBatchName(batch.name);
                    setIsEditingBatchName(false);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="Batal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-2xl font-black tracking-tight">{batch.name} - Portal Kelulusan</h2>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditBatchName(batch.name);
                      setIsEditingBatchName(true);
                    }}
                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-sky-400 hover:text-sky-350 rounded-lg transition border border-slate-700"
                    title="Ubah Nama Program Training"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Daftar program sertifikasi &amp; kepesertaan karyawan pada {batch.name}.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900/65 px-4 py-2 rounded-lg border border-slate-800 text-center min-w-[90px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Lulus</p>
              <p className="text-lg font-bold text-emerald-400">{activeGraduationCount} Org</p>
            </div>
            <div className="bg-slate-900/65 px-4 py-2 rounded-lg border border-slate-800 text-center min-w-[90px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Rasio</p>
              <p className="text-lg font-bold text-sky-400">{activePercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: TRAININGS LIST WITH COACH & ASSISTANTS */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kurikulum &amp; Coach Sertifikat</h3>
              <p className="text-xs text-slate-400">
                Sertifikat kelayakan formal untuk Coach dan Asisten Coach.
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddTraining(!showAddTraining)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-lg transition-all shadow-lg shadow-sky-900/20"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Training</span>
            </button>
          )}
        </div>

        {/* Add Training Inline Block */}
        {isAdmin && showAddTraining && (
          <form
            onSubmit={handleAddTraining}
            className="p-5 mb-6 border border-slate-800 bg-slate-900/40 rounded-xl space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                Formulir Training Baru
              </span>
              <button
                type="button"
                onClick={() => setShowAddTraining(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Batal
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Program Training *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Flutter Mobile Dev"
                  value={newTrainingTitle}
                  onChange={(e) => setNewTrainingTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nama Coach *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Coach"
                    value={newCoachName}
                    onChange={(e) => setNewCoachName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Sertifikat Coach (GDrive)
                  </label>
                  <input
                    type="url"
                    placeholder="Link GDrive"
                    value={newCoachCert}
                    onChange={(e) => setNewCoachCert(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nama Asisten Coach
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Asisten"
                    value={newAssistantName}
                    onChange={(e) => setNewAssistantName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Sertifikat Asisten (GDrive)
                  </label>
                  <input
                    type="url"
                    placeholder="Link GDrive"
                    value={newAssistantCert}
                    onChange={(e) => setNewAssistantCert(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Special Case: Coach 2 & Assistant 2 */}
              <div className="grid grid-cols-2 gap-2 md:col-span-2 border-t border-slate-805/50 pt-3">
                <span className="col-span-2 text-[10px] font-extrabold tracking-wider text-amber-400 uppercase">
                  Kasus Khusus / Tambahan Mandiri (Coach 2 &amp; Asisten 2)
                </span>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nama Coach Kedua (Coach 2)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Coach 2 (Khusus)"
                    value={newCoach2Name}
                    onChange={(e) => setNewCoach2Name(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Link Sertifikat Coach Kedua
                  </label>
                  <input
                    type="url"
                    placeholder="Link GDrive"
                    value={newCoach2CertUrl}
                    onChange={(e) => setNewCoach2CertUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="mt-2 text-left">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nama Asisten Kedua (Asisten 2)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Asisten 2 (Khusus)"
                    value={newAssistant2Name}
                    onChange={(e) => setNewAssistant2Name(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="mt-2 text-left">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Link Sertifikat Asisten Kedua
                  </label>
                  <input
                    type="url"
                    placeholder="Link GDrive"
                    value={newAssistant2CertUrl}
                    onChange={(e) => setNewAssistant2CertUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTraining(false)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-800 text-slate-400 hover:text-white rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
              >
                Simpan Training
              </button>
            </div>
          </form>
        )}

        {/* Trainings List Display */}
        {batch.trainings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batch.trainings.map((t) => {
              const isEditing = editingTrainingId === t.id;
              return (
                <div
                  key={t.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 relative group hover:border-[#1e293b] hover:bg-slate-900/60 transition shadow-xl"
                >
                  {isEditing ? (
                    // Editing Form
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 w-full">
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Edit Program &amp; Sertifikat</span>
                        <div className="flex gap-2">
                          <button
                            onClick={cancelEditTraining}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Batal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 uppercase">Judul Training</label>
                        <input
                          type="text"
                          value={editTrainingTitle}
                          onChange={(e) => setEditTrainingTitle(e.target.value)}
                          className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase">Coach</label>
                          <input
                            type="text"
                            value={editCoachName}
                            onChange={(e) => setEditCoachName(e.target.value)}
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-455 uppercase">Coach Cert Link</label>
                          <input
                            type="text"
                            value={editCoachCert}
                            onChange={(e) => setEditCoachCert(e.target.value)}
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase">Asisten</label>
                          <input
                            type="text"
                            value={editAssistantName}
                            onChange={(e) => setEditAssistantName(e.target.value)}
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-455 uppercase">Asisten Cert Link</label>
                          <input
                            type="text"
                            value={editAssistantCert}
                            onChange={(e) => setEditAssistantCert(e.target.value)}
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-amber-500 uppercase">Coach 2 (Opsional)</label>
                          <input
                            type="text"
                            value={editCoach2Name}
                            onChange={(e) => setEditCoach2Name(e.target.value)}
                            placeholder="Nama Coach 2"
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-500 uppercase">Coach 2 Cert Link</label>
                          <input
                            type="text"
                            value={editCoach2CertUrl}
                            onChange={(e) => setEditCoach2CertUrl(e.target.value)}
                            placeholder="Link GDrive"
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase">Asisten 2 (Opsional)</label>
                          <input
                            type="text"
                            value={editAssistant2Name}
                            onChange={(e) => setEditAssistant2Name(e.target.value)}
                            placeholder="Nama Asisten 2"
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-455 uppercase">Asisten 2 Cert Link</label>
                          <input
                            type="text"
                            value={editAssistant2CertUrl}
                            onChange={(e) => setEditAssistant2CertUrl(e.target.value)}
                            placeholder="Link GDrive"
                            className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => saveEditTraining(t.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" /> Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <>
                      {/* Action buttons floats */}
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-1 bg-slate-800 border border-slate-700 rounded-md p-1 opacity-0 group-hover:opacity-100 transition duration-150">
                          <button
                            onClick={() => startEditTraining(t)}
                            className="p-1 hover:bg-slate-700 text-sky-400 rounded"
                            title="Edit Training & Sertifikat Instruktur"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTraining(t.id)}
                            className="p-1 hover:bg-rose-950/40 text-rose-400 rounded"
                            title="Hapus Training"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold rounded-md uppercase font-mono">
                          Materi Diklat
                        </span>
                        <h4 className="font-extrabold text-white text-sm mt-1.5">{t.title}</h4>
                      </div>

                      {/* Coach & Assistant Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-800">
                        {/* Coach Box */}
                        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between min-h-[85px]">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-450">
                              Coach Pelaksana
                            </span>
                            <p className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">{t.coachName}</p>
                          </div>
                          <a
                            href={t.coachCertUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:underline"
                          >
                            <Download className="w-3 h-3" /> Unduh Sertifikat
                          </a>
                        </div>

                        {/* Assistant Box */}
                        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between min-h-[85px]">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
                              Asisten Coach
                            </span>
                            <p className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">{t.assistantName}</p>
                          </div>
                          <a
                            href={t.assistantCertUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:underline"
                          >
                            <Download className="w-3 h-3" /> Unduh Sertifikat
                          </a>
                        </div>

                        {/* Coach 2 Box (Special Case) */}
                        {t.coach2Name && (
                          <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between min-h-[85px]">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400">
                                Coach Kedua (Coach 2)
                              </span>
                              <p className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">{t.coach2Name}</p>
                            </div>
                            {t.coach2CertUrl ? (
                              <a
                                href={t.coach2CertUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline"
                              >
                                <Download className="w-3 h-3" /> Unduh Sertifikat 2
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic mt-2">Sertifikat GDrive tidak ada</span>
                            )}
                          </div>
                        )}

                        {/* Assistant 2 Box (Special Case) */}
                        {t.assistant2Name && (
                          <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between min-h-[85px]">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400">
                                Asisten Kedua (Asisten 2)
                              </span>
                              <p className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">{t.assistant2Name}</p>
                            </div>
                            {t.assistant2CertUrl ? (
                              <a
                                href={t.assistant2CertUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline"
                              >
                                <Download className="w-3 h-3" /> Unduh Sertifikat 2
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic mt-2">Sertifikat GDrive tidak ada</span>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400">Belum ada data materi &amp; sertifikat pengajar.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: PARTICIPANTS TABLE FOR THIS BATCH */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daftar Kelulusan Karyawan</h3>
              <p className="text-xs text-slate-400">
                Data kelulusan peserta serta tautan sertifikat kompetensi karyawan.
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                if (batch.trainings.length === 0) {
                  alert('Tambahkan program training terlebih dahulu sebelum mendaftarkan karyawan!');
                  return;
                }
                setSelectedTrainingId(batch.trainings[0].id);
                setShowAddParticipant(!showAddParticipant);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg transition shadow-sm hover:shadow-emerald-500/10"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Peserta</span>
            </button>
          )}
        </div>

        {/* Add Participant Inline Form */}
        {isAdmin && showAddParticipant && (
          <form
            onSubmit={handleAddParticipant}
            className="p-5 mb-6 border border-slate-800 bg-slate-900/40 rounded-xl space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-bold text-sky-450 uppercase tracking-wide">
                Daftarkan Peserta Baru
              </span>
              <button
                type="button"
                onClick={() => setShowAddParticipant(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Batal
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Karyawan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ketik Nama Lengkap"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Email Kantor *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Pilih Program Training *
                </label>
                <select
                  required
                  value={selectedTrainingId}
                  onChange={(e) => setSelectedTrainingId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-[#0f172a] text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {batch.trainings.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Kelulusan *
                </label>
                <select
                  value={newParticipantStatus}
                  onChange={(e) => setNewParticipantStatus(e.target.value as 'Lulus' | 'Tidak Lulus')}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-[#0f172a] text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Lulus">Lulus</option>
                  <option value="Tidak Lulus">Tidak Lulus</option>
                </select>
              </div>
            </div>

            {newParticipantStatus === 'Lulus' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tautan File Sertifikat di Google Drive
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={newParticipantCert}
                  onChange={(e) => setNewParticipantCert(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setShowAddParticipant(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Tambahkan Peserta
              </button>
            </div>
          </form>
        )}

        {/* Participants Table Grid */}
        {batch.participants.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/20">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-[#0b1329]">
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nama Karyawan
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Program Training
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tautan Drive Sertifikat
                  </th>
                  {isAdmin && (
                    <th scope="col" className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-slate-800/60 text-sm">
                {batch.participants.map((p) => {
                  const isEditing = editingParticipantId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/35 transition-colors">
                      {/* Name / Email */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-white">{p.employeeName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{p.email}</div>
                      </td>

                      {/* Training Badge Title */}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <select
                            value={editTrainingId}
                            onChange={(e) => setEditTrainingId(e.target.value)}
                            className="text-xs bg-slate-950 text-white border border-slate-800 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 w-full max-w-xs"
                          >
                            {batch.trainings.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.title}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="font-medium text-slate-300 line-clamp-2 max-w-xs">{p.trainingTitle}</div>
                        )}
                      </td>

                      {/* Status / Toggle (If Admin editing) */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as 'Lulus' | 'Tidak Lulus')}
                            className="text-xs bg-slate-950 text-white border border-slate-800 p-1 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="Lulus">Lulus</option>
                            <option value="Tidak Lulus">Tidak Lulus</option>
                          </select>
                        ) : p.status === 'Lulus' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Lulus
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                            <X className="w-3 h-3" /> Tidak Lulus
                          </span>
                        )}
                      </td>

                      {/* GDrive Certificate Link */}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          editStatus === 'Lulus' ? (
                            <input
                              type="text"
                              value={editCertUrl}
                              onChange={(e) => setEditCertUrl(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className="w-full text-xs p-1.5 border border-slate-800 bg-slate-950 text-white rounded focus:outline-none"
                            />
                          ) : (
                            <span className="text-xs text-slate-400 italic">No cert required (Tidak Lulus)</span>
                          )
                        ) : p.status === 'Lulus' ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={p.certUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-bold bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-lg border border-sky-500/20 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Buka GDrive
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic font-medium">Sertifikat N/A</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      {isAdmin && (
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => saveEditParticipant(p.id)}
                                className="p-1 px-2.5 bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-emerald-500"
                              >
                                <Check className="w-3.5 h-3.5" /> Simpan
                              </button>
                              <button
                                onClick={cancelEditParticipant}
                                className="p-1 text-slate-400 hover:text-white font-semibold text-xs"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => startEditParticipant(p)}
                                className="p-1.5 hover:bg-slate-800 text-sky-400 rounded-md transition"
                                title="Edit Status / Sertifikat"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteParticipant(p.id)}
                                className="p-1.5 hover:bg-rose-950/40 text-rose-400 rounded-md transition"
                                title="Hapus Peserta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Karyawan Belum Didaftarkan</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
              Belum ada data partisipan sesudah training ini. Silakan draf data training terlebih dahulu sekiranya Anda berkewenangan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
