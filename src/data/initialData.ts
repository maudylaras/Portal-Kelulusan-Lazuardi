import { Batch } from '../types';

export const initialBatches: Batch[] = [
  {
    id: 'batch-1',
    name: 'Batch 1',
    trainings: [
      {
        id: 'b1-t1',
        title: 'Effective Corporate Communication',
        coachName: 'Bambang Pamungkas, M.Psi.',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch1-coach-communication',
        assistantName: 'Siti Rahma',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch1-asst-communication'
      },
      {
        id: 'b1-t2',
        title: 'Introduction to Modern React',
        coachName: 'Reza Artamevia, S.Kom.',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch1-coach-react',
        assistantName: 'Fajar Shidiq',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch1-asst-react'
      }
    ],
    participants: [
      {
        id: 'b1-p1',
        employeeName: 'Budi Santoso',
        email: 'budi.santoso@company.com',
        trainingId: 'b1-t1',
        trainingTitle: 'Effective Corporate Communication',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b1-p1-cert-drive-link/view'
      },
      {
        id: 'b1-p2',
        employeeName: 'Dewi Lestari',
        email: 'dewi.lestari@company.com',
        trainingId: 'b1-t1',
        trainingTitle: 'Effective Corporate Communication',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b1-p2-cert-drive-link/view'
      },
      {
        id: 'b1-p3',
        employeeName: 'Agus Wijaya',
        email: 'agus.wijaya@company.com',
        trainingId: 'b1-t2',
        trainingTitle: 'Introduction to Modern React',
        status: 'Tidak Lulus',
        certUrl: ''
      },
      {
        id: 'b1-p4',
        employeeName: 'Siti Aminah',
        email: 'siti.aminah@company.com',
        trainingId: 'b1-t2',
        trainingTitle: 'Introduction to Modern React',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b1-p4-cert-drive-link/view'
      }
    ]
  },
  {
    id: 'batch-2',
    name: 'Batch 2',
    trainings: [
      {
        id: 'b2-t1',
        title: 'Agile & Scrum Project Management',
        coachName: 'Hendra Wijaya, PMP',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch2-coach-agile',
        assistantName: 'Diana Putri',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch2-asst-agile'
      }
    ],
    participants: [
      {
        id: 'b2-p1',
        employeeName: 'Rian Hidayat',
        email: 'rian.hidayat@company.com',
        trainingId: 'b2-t1',
        trainingTitle: 'Agile & Scrum Project Management',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b2-p1-cert-drive-link/view'
      },
      {
        id: 'b2-p2',
        employeeName: 'Lindaawati Siregar',
        email: 'linda.siregar@company.com',
        trainingId: 'b2-t1',
        trainingTitle: 'Agile & Scrum Project Management',
        status: 'Tidak Lulus',
        certUrl: ''
      },
      {
        id: 'b2-p3',
        employeeName: 'Joko Widodo',
        email: 'joko.widodo@company.com',
        trainingId: 'b2-t1',
        trainingTitle: 'Agile & Scrum Project Management',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b2-p3-cert-drive-link/view'
      }
    ]
  },
  {
    id: 'batch-3',
    name: 'Batch 3',
    trainings: [
      {
        id: 'b3-t1',
        title: 'Basic Financial Literacy for Leaders',
        coachName: 'Anindya Bakrie, MBA',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch3-coach-finance',
        assistantName: 'Tony Stark',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch3-asst-finance'
      }
    ],
    participants: [
      {
        id: 'b3-p1',
        employeeName: 'Aditya Pratama',
        email: 'aditya.pratama@company.com',
        trainingId: 'b3-t1',
        trainingTitle: 'Basic Financial Literacy for Leaders',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b3-p1-cert-drive-link/view'
      },
      {
        id: 'b3-p2',
        employeeName: 'Eka Sari',
        email: 'eka.sari@company.com',
        trainingId: 'b3-t1',
        trainingTitle: 'Basic Financial Literacy for Leaders',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b3-p2-cert-drive-link/view'
      },
      {
        id: 'b3-p3',
        employeeName: 'Rudi Hermawan',
        email: 'rudi.hermawan@company.com',
        trainingId: 'b3-t1',
        trainingTitle: 'Basic Financial Literacy for Leaders',
        status: 'Tidak Lulus',
        certUrl: ''
      }
    ]
  },
  {
    id: 'batch-4',
    name: 'Batch 4',
    trainings: [
      {
        id: 'b4-t1',
        title: 'Digital Marketing & Growth Hacking',
        coachName: 'Sandiaga Uno, B.B.A.',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch4-coach-mktg',
        assistantName: 'Merry Riana',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch4-asst-mktg'
      }
    ],
    participants: [
      {
        id: 'b4-p1',
        employeeName: 'Hendra Gunawan',
        email: 'hendra.gunawan@company.com',
        trainingId: 'b4-t1',
        trainingTitle: 'Digital Marketing & Growth Hacking',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b4-p1-cert-drive-link/view'
      },
      {
        id: 'b4-p2',
        employeeName: 'Mega Utami',
        email: 'mega.utami@company.com',
        trainingId: 'b4-t1',
        trainingTitle: 'Digital Marketing & Growth Hacking',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b4-p2-cert-drive-link/view'
      }
    ]
  },
  {
    id: 'batch-5',
    name: 'Batch 5',
    trainings: [
      {
        id: 'b5-t1',
        title: 'Design Thinking & UX Blueprint',
        coachName: 'Nadiem Makarim, M.B.A.',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch5-coach-design',
        assistantName: 'William Tanuwidjaja',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch5-asst-design'
      }
    ],
    participants: [
      {
        id: 'b5-p1',
        employeeName: 'Gita Wirjawan',
        email: 'gita.wirjawan@company.com',
        trainingId: 'b5-t1',
        trainingTitle: 'Design Thinking & UX Blueprint',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b5-p1-cert-drive-link/view'
      },
      {
        id: 'b5-p2',
        employeeName: 'Ahmad Dhani',
        email: 'ahmad.dhani@company.com',
        trainingId: 'b5-t1',
        trainingTitle: 'Design Thinking & UX Blueprint',
        status: 'Tidak Lulus',
        certUrl: ''
      }
    ]
  },
  {
    id: 'batch-6',
    name: 'Batch 6',
    trainings: [
      {
        id: 'b6-t1',
        title: 'Data Science & Machine Learning Foundations',
        coachName: 'Prof. Yohanes Surya, Ph.D.',
        coachCertUrl: 'https://drive.google.com/drive/folders/batch6-coach-ml',
        assistantName: 'Jerome Polin Sitorus',
        assistantCertUrl: 'https://drive.google.com/drive/folders/batch6-asst-ml'
      }
    ],
    participants: [
      {
        id: 'b6-p1',
        employeeName: 'Taufik Hidayat',
        email: 'taufik.hidayat@company.com',
        trainingId: 'b6-t1',
        trainingTitle: 'Data Science & Machine Learning Foundations',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b6-p1-cert-drive-link/view'
      },
      {
        id: 'b6-p2',
        employeeName: 'Susi Susanti',
        email: 'susi.susanti@company.com',
        trainingId: 'b6-t1',
        trainingTitle: 'Data Science & Machine Learning Foundations',
        status: 'Lulus',
        certUrl: 'https://drive.google.com/file/d/b6-p2-cert-drive-link/view'
      },
      {
        id: 'b6-p3',
        employeeName: 'Kevin Sanjaya',
        email: 'kevin.sanjaya@company.com',
        trainingId: 'b6-t1',
        trainingTitle: 'Data Science & Machine Learning Foundations',
        status: 'Tidak Lulus',
        certUrl: ''
      }
    ]
  }
];
