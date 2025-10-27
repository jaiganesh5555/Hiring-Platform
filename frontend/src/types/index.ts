export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  company?: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CandidateStage = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'assessment' 
  | 'offer' 
  | 'hired' 
  | 'rejected';

export interface StatusChange {
  id: string;
  stage: CandidateStage;
  timestamp: Date;
  note?: string;
  changedBy?: string;
}

export interface Note {
  id: string;
  content: string;
  mentions: string[];
  createdAt: Date;
  createdBy: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  currentStage: CandidateStage;
  jobId: string;
  appliedAt: Date;
  statusHistory: StatusChange[];
  notes: Note[];
  resumeUrl?: string;
}

export type QuestionType = 
  | 'single-choice' 
  | 'multi-choice' 
  | 'short-text' 
  | 'long-text' 
  | 'numeric' 
  | 'file-upload';

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

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  helpText?: string;
  options?: QuestionOption[];
  validation?: ValidationRule;
  conditional?: ConditionalLogic;
  order: number;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentResponse {
  assessmentId: string;
  candidateId: string;
  answers: Record<string, any>;
  submittedAt?: Date;
  completedAt?: Date;
}
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface JobFilters {
  status?: 'active' | 'archived' | 'all';
  search?: string;
  tags?: string[];
}

export interface CandidateFilters {
  stage?: CandidateStage | 'all';
  search?: string;
  jobId?: string;
  company?: string;
}
