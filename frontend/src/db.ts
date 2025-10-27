import Dexie, { type Table } from 'dexie';
export const genId = () => crypto.randomUUID();

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  company?: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  stage: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected';
  jobId?: string;
  appliedAt: number;
  notes?: Note[];
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  label: string;
  helpText?: string;
  options?: QuestionOption[];
  validation?: ValidationRule;
  conditional?: ConditionalLogic;
  order: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface ConditionalLogic {
  dependsOn: string;
  operator: 'equals' | 'not-equals' | 'contains';
  value: string | number;
}


export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  createdAt: number;
  updatedAt: number;
}

export interface Submission {
  id: string;
  assessmentId: string;
  candidateId?: string;
  responses: Record<string, any>;
  submittedAt?: number;
  completedAt?: number;
  createdAt: number;
}
export interface Note {
  id: string;
  candidateId?: string;
  content: string;
  mentions: string[];
  createdAt: number;
  createdBy: string;
}
export interface TimelineEvent {
  id: string;
  candidateId: string;
  type: 'stage_change' | 'note_added' | 'assessment_completed' | 'interview_scheduled';
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class HiringPlatformDB extends Dexie {
  jobs!: Table<Job, string>;
  candidates!: Table<Candidate, string>;
  assessments!: Table<Assessment, string>;
  submissions!: Table<Submission, string>;
  notes!: Table<Note, string>;
  timeline!: Table<TimelineEvent, string>;

  constructor() {
    super('HiringPlatformDB');
    
    this.version(1).stores({
      jobs: 'id, slug, status, order, company',
      candidates: 'id, jobId, stage, company, appliedAt',
      assessments: 'id, jobId, updatedAt',
      submissions: 'id, assessmentId, candidateId, createdAt',
      notes: 'id, candidateId, createdAt',
      timeline: 'id, candidateId, timestamp'
    });
  }
}

export const db = new HiringPlatformDB();