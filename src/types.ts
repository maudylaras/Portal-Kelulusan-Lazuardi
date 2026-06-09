export interface Training {
  id: string;
  title: string;
  coachName: string;
  coachCertUrl: string;
  assistantName: string;
  assistantCertUrl: string;
}

export interface Participant {
  id: string;
  employeeName: string;
  email: string;
  trainingId: string; // references a training in the same batch
  trainingTitle: string; // redundant / cache for ease of lookup
  status: 'Lulus' | 'Tidak Lulus';
  certUrl: string; // Google Drive link
}

export interface Batch {
  id: string;
  name: string;
  trainings: Training[];
  participants: Participant[];
}
