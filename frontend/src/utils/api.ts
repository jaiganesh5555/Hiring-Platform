import type { 
  Job, 
  Candidate, 
  Assessment, 
  AssessmentResponse,
  PaginationParams,
  JobFilters,
  CandidateFilters
} from '../types';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    const errorMessage = error.error || `HTTP ${response.status}`;

    if (response.status >= 500) {
      const toast = (await import('react-hot-toast')).toast;
      toast.error(errorMessage);
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

const createQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

export const jobsAPI = {
  getAll: async (filters?: JobFilters, pagination?: PaginationParams): Promise<{ jobs: Job[]; total: number; page: number; pageSize: number }> => {
    const params: Record<string, any> = {};
    
    if (filters) {
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');
    }
    
    if (pagination) {
      params.page = pagination.page;
      params.pageSize = pagination.pageSize;
    }
    
    const queryString = createQueryString(params);
    const response = await fetch(`/api/jobs${queryString ? `?${queryString}` : ''}`);
    const data = await handleResponse<{ jobs: Job[]; total: number; page: number; pageSize: number }>(response);
    
    return { jobs: data.jobs, total: data.total, page: data.page, pageSize: data.pageSize };
  },
  
  getById: async (id: string): Promise<Job | null> => {
    const { db } = await import('../db');
    const job = await db.jobs.get(id);
    if (!job) return null;
    return {
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt)
    } as Job;
  },
  
  getBySlug: async (slug: string): Promise<Job | null> => {
    const { db } = await import('../db');
    const job = await db.jobs.where('slug').equals(slug).first();
    if (!job) return null;
    return {
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt)
    } as Job;
  },
  
  create: async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Job> => {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    return handleResponse<Job>(response);
  },
  
  update: async (id: string, updates: Partial<Job>): Promise<Job> => {
    const response = await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return handleResponse<Job>(response);
  },
  
  reorder: async (fromOrder: number, toOrder: number): Promise<any> => {
    const response = await fetch(`/api/jobs/${fromOrder}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromOrder, toOrder })
    });
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    await jobsAPI.update(id, { status: 'archived' });
  }
};

export const candidatesAPI = {
  getAll: async (filters?: CandidateFilters): Promise<{ candidates: Candidate[]; total: number }> => {
    const params: Record<string, any> = {};
    
    if (filters) {
      if (filters.stage && filters.stage !== 'all') params.stage = filters.stage;
      if (filters.search) params.search = filters.search;
      if (filters.jobId) params.jobId = filters.jobId;
      if (filters.company) params.company = filters.company;
    }
    if (!('page' in params)) {
      params.page = 1;
  params.pageSize = 1000;
    }

    const queryString = createQueryString(params);
    const response = await fetch(`/api/candidates${queryString ? `?${queryString}` : ''}`);
    const data = await handleResponse<{ candidates: any[]; total: number }>(response);
    
    const mappedCandidates = data.candidates.map((c: any) => ({
      ...c,
      currentStage: c.stage || c.currentStage,
      statusHistory: [] as any[],
      notes: [],
      appliedAt: typeof c.appliedAt === 'number' ? new Date(c.appliedAt) : c.appliedAt
    }));
    
    return { candidates: mappedCandidates as Candidate[], total: data.total };
  },
  
  getById: async (id: string): Promise<Candidate | null> => {
    const { db } = await import('../db');
    const candidate = await db.candidates.get(id);
    if (!candidate) return null;

  const rawNotes = await db.notes.where('candidateId').equals(id).toArray();
  console.debug('[candidatesAPI.getById] candidateId=', id, 'rawNotesCount=', rawNotes.length);
    const notes = rawNotes.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt)
    }));

  const rawTimeline = await db.timeline.where('candidateId').equals(id).sortBy('timestamp');
  console.debug('[candidatesAPI.getById] candidateId=', id, 'rawTimelineCount=', rawTimeline.length, 'rawTimelineSample=', rawTimeline.slice(0,3));
    const statusHistory = rawTimeline.map((ev: any) => {
      const stage = (ev.metadata && (ev.metadata.toStage || ev.metadata.stage)) || candidate.stage;
      return {
        id: ev.id,
        stage,
        timestamp: new Date(ev.timestamp),
        note: ev.description,
        changedBy: ev.metadata?.changedBy,
        statusNumber: typeof ev.metadata?.statusNumber === 'number' ? ev.metadata.statusNumber : undefined
      };
    });

    return {
      ...candidate,
      currentStage: candidate.stage as any,
      statusHistory: statusHistory,
      notes: notes,
      appliedAt: new Date(candidate.appliedAt)
    } as any as Candidate;
  },
  
  update: async (id: string, updates: Partial<Candidate>): Promise<Candidate> => {
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return handleResponse<Candidate>(response);
  },
  
  addNote: async (candidateId: string, note: Omit<import('../types').Note, 'id' | 'createdAt'>): Promise<void> => {
    const candidate = await candidatesAPI.getById(candidateId);
    if (!candidate) throw new Error('Candidate not found');
    
    const newNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedNotes = [...(candidate.notes || []), newNote];
    await candidatesAPI.update(candidateId, { notes: updatedNotes });
  },
  
  getTimeline: async (id: string): Promise<any> => {
    
    const { db } = await import('../db');
    const rawTimeline = await db.timeline.where('candidateId').equals(id).sortBy('timestamp');
    console.debug('[candidatesAPI.getTimeline] candidateId=', id, 'rawTimelineCount=', rawTimeline.length);
    if (!rawTimeline || rawTimeline.length === 0) {
      const candidate = await db.candidates.get(id);
      if (!candidate) {
        console.debug('[candidatesAPI.getTimeline] candidate not found for id=', id);
        return { candidateId: id, timeline: [] };
      }
      console.debug('[candidatesAPI.getTimeline] fallback to applied event for id=', id);
      return { candidateId: id, timeline: [{ id: 'applied', stage: candidate.stage, timestamp: candidate.appliedAt }] };
    }

    const timeline = rawTimeline.map((ev: any) => ({
      id: ev.id,
      stage: ev.metadata?.toStage || ev.metadata?.stage || ev.description || null,
      timestamp: ev.timestamp,
      note: ev.description,
      metadata: ev.metadata || {}
    }));

    console.debug('[candidatesAPI.getTimeline] mapped count=', timeline.length, 'for id=', id);
    return { candidateId: id, timeline };
  }
};

export const assessmentsAPI = {
  getAll: async (): Promise<Assessment[]> => {
    return [];
  },
  
  getById: async (_id: string): Promise<Assessment | null> => {
    
    return null;
  },
  
  getByJobId: async (jobId: string): Promise<Assessment | null> => {
    const response = await fetch(`/api/assessments/${jobId}`);
    try {
      return await handleResponse<Assessment>(response);
    } catch (error) {
      return null;
    }
  },
  
  getAllByJobId: async (jobId: string): Promise<Assessment[]> => {
    const assessment = await assessmentsAPI.getByJobId(jobId);
    return assessment ? [assessment] : [];
  },
  
  create: async (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Assessment> => {
    
    const response = await fetch(`/api/assessments/${assessment.jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment)
    });
    return handleResponse<Assessment>(response);
  },
  
  update: async (id: string, assessment: Partial<Assessment>): Promise<Assessment> => {
    
    if (!assessment.jobId) {
      const existing = await assessmentsAPI.getById(id);
      if (!existing) throw new Error('Assessment not found');
      assessment.jobId = existing.jobId;
    }
    
    const response = await fetch(`/api/assessments/${assessment.jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment)
    });
    return handleResponse<Assessment>(response);
  },
  
  delete: async (_id: string): Promise<void> => {
    
    throw new Error('Delete not implemented');
  }
};

 
export const responsesAPI = {
  getByCandidate: async (_candidateId: string): Promise<AssessmentResponse[]> => {
    // This would need additional MSW handler support
    return [];
  },
  
  save: async (response: AssessmentResponse): Promise<void> => {
    const responseData = await fetch(`/api/assessments/${response.assessmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        responses: response.answers,
        candidateId: response.candidateId
      })
    });
    await handleResponse(responseData);
  }
};
