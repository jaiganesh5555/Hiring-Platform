import { http, HttpResponse } from 'msw';
import { db, genId } from '../db';
import type { Job, Candidate, Assessment, Submission } from '../db';

const delay = (min = 200, max = 1200) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));
const shouldError = (rate = 0.05) => Math.random() < rate;
const createErrorResponse = (message: string, status = 500) => HttpResponse.json({ error: message }, { status });

const jobsHandlers = [
  http.get('/api/jobs', async ({ request }) => {
      await delay();
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const tagsParam = url.searchParams.get('tags') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const sort = url.searchParams.get('sort') || 'order';
    let jobs = await db.jobs.toArray();
  if (search) jobs = jobs.filter((j: Job) => j.title.toLowerCase().includes(search.toLowerCase()) || (j.company?.toLowerCase().includes(search.toLowerCase())) || j.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())));
  if (status) jobs = jobs.filter((j: Job) => j.status === status);
  
  if (tagsParam) {
    const requested = tagsParam.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    if (requested.length) {
      jobs = jobs.filter((j: Job) => j.tags && requested.every(rt => j.tags.map(t => t.toLowerCase()).includes(rt)));
    }
  }
  if (sort === 'order') jobs.sort((a: Job, b: Job) => a.order - b.order);
  else if (sort === 'title') jobs.sort((a: Job, b: Job) => a.title.localeCompare(b.title));
  else if (sort === 'createdAt') jobs.sort((a: Job, b: Job) => b.createdAt - a.createdAt);
    const total = jobs.length;
    const start = (page - 1) * pageSize;
    const paged = jobs.slice(start, start + pageSize);
    return HttpResponse.json({ jobs: paged, total, page, pageSize });
  }),
  http.post('/api/jobs', async ({ request }) => {
    await delay();
    if (shouldError()) return createErrorResponse('Failed to create job');
    const jobData = await request.json();
    if (
      typeof jobData === 'object' && jobData !== null &&
      'title' in jobData && 'slug' in jobData && 'description' in jobData && 'status' in jobData && 'company' in jobData
    ) {
      const newJob: Job = {
        id: genId(),
        title: jobData.title,
        slug: jobData.slug,
        description: jobData.description,
        status: jobData.status,
        company: jobData.company,
        tags: Array.isArray(jobData.tags) ? jobData.tags : [],
        order: typeof jobData.order === 'number' ? jobData.order : 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.jobs.add(newJob);
      return HttpResponse.json(newJob, { status: 201 });
    } else {
      return HttpResponse.json({ error: 'Invalid job data' }, { status: 400 });
    }
  }),
  http.patch('/api/jobs/:id', async ({ request, params }) => {
    await delay();
    if (shouldError()) return createErrorResponse('Failed to update job');
    const { id } = params;
    const updates = await request.json();
    if (typeof updates === 'object' && updates !== null) {
      const job = await db.jobs.get(id as string);
      if (!job) return createErrorResponse('Job not found', 404);
      const updatedJob: Job = {
        ...job,
        ...(updates as Partial<Job>),
        updatedAt: Date.now(),
      };
      await db.jobs.put(updatedJob);
      return HttpResponse.json(updatedJob);
    } else {
      return HttpResponse.json({ error: 'Invalid update data' }, { status: 400 });
    }
  }),
  http.patch('/api/jobs/:id/reorder', async ({ request }) => {
    await delay();
  if (shouldError(0.08)) return createErrorResponse('Failed to reorder jobs', 500);
    const reorderBody = await request.json();
    let fromOrder: number | undefined;
    let toOrder: number | undefined;
    if (reorderBody && typeof reorderBody === 'object' && 'fromOrder' in reorderBody && 'toOrder' in reorderBody) {
      fromOrder = (reorderBody as { fromOrder: number }).fromOrder;
      toOrder = (reorderBody as { toOrder: number }).toOrder;
    } else {
      return HttpResponse.json({ error: 'Invalid reorder body' }, { status: 400 });
    }
    let jobs = await db.jobs.orderBy('order').toArray();
  const fromIdx = jobs.findIndex((j: Job) => j.order === fromOrder);
    if (fromIdx === -1) return createErrorResponse('Job not found', 404);
    const [moved] = jobs.splice(fromIdx, 1);
    jobs.splice(toOrder, 0, moved);
    jobs = jobs.map((j: Job, idx: number) => ({
      ...j,
      order: idx,
      updatedAt: Date.now(),
    }));
    await db.jobs.bulkPut(jobs);
    return HttpResponse.json({ success: true });
  }),
];

const candidatesHandlers = [
  http.get('/api/candidates', async ({ request }) => {
      await delay();
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const jobId = url.searchParams.get('jobId') || '';
    const company = url.searchParams.get('company') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    let candidates = await db.candidates.toArray();
  if (search) candidates = candidates.filter((c: Candidate) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.email?.toLowerCase().includes(search.toLowerCase())));
  if (stage && stage !== 'all') candidates = candidates.filter((c: Candidate) => c.stage === stage);
  if (jobId) candidates = candidates.filter((c: Candidate) => c.jobId === jobId);
  if (company) candidates = candidates.filter((c: Candidate) => c.company === company);
    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const paged = candidates.slice(start, start + pageSize);
    return HttpResponse.json({ candidates: paged, total, page, pageSize });
  }),
  http.post('/api/candidates', async ({ request }) => {
    await delay();
    if (shouldError()) return createErrorResponse('Failed to create candidate');
    const candidateData = await request.json();
    if (
      typeof candidateData === 'object' && candidateData !== null &&
      'name' in candidateData && 'stage' in candidateData
    ) {
      const newCandidate: Candidate = {
        id: genId(),
        name: candidateData.name,
        stage: candidateData.stage,
        appliedAt: Date.now(),
        email: candidateData.email,
        notes: [],
      };
      await db.candidates.add(newCandidate);
      return HttpResponse.json(newCandidate, { status: 201 });
    } else {
      return HttpResponse.json({ error: 'Invalid candidate data' }, { status: 400 });
    }
  }),
  http.patch('/api/candidates/:id', async ({ request, params }) => {
    await delay();
    if (shouldError()) return createErrorResponse('Failed to update candidate');
    const { id } = params;
    const updates = await request.json();
    if (typeof updates === 'object' && updates !== null) {
      const candidate = await db.candidates.get(id as string);
      if (!candidate) return createErrorResponse('Candidate not found', 404);
      const updatedCandidate: Candidate = {
        ...candidate,
        ...(updates as Partial<Candidate>),
      };
      await db.candidates.put(updatedCandidate);
      return HttpResponse.json(updatedCandidate);
    } else {
      return HttpResponse.json({ error: 'Invalid update data' }, { status: 400 });
    }
  }),
  http.get('/api/candidates/:id/timeline', async ({ params }) => {
     await delay();
    const { id } = params;
    const candidate = await db.candidates.get(id as string);
    if (!candidate) return createErrorResponse('Candidate not found', 404);

    
    const events = await db.timeline.where('candidateId').equals(id as string).sortBy('timestamp');
    if (!events || events.length === 0) {
      return HttpResponse.json({ candidateId: id, timeline: [{ id: 'applied', stage: candidate.stage, timestamp: candidate.appliedAt }] });
    }

    const mapped = events.map((ev: any) => ({
      id: ev.id,
      stage: ev.metadata?.toStage || ev.metadata?.stage || ev.description || null,
      timestamp: ev.timestamp,
      note: ev.description,
      metadata: ev.metadata || {}
    }));

    return HttpResponse.json({ candidateId: id, timeline: mapped });
  }),
];

const assessmentsHandlers = [
  http.get('/api/assessments/:jobId', async ({ params }) => {
     await delay();
    const { jobId } = params;
    const assessments = await db.assessments.where('jobId').equals(jobId as string).toArray();
    if (!assessments.length) return HttpResponse.json(null);
    return HttpResponse.json(assessments[0]);
  }),
  http.put('/api/assessments/:jobId', async ({ request, params }) => {
    await delay();
    if (shouldError()) return createErrorResponse('Failed to update assessment');
    const { jobId } = params;
    const assessmentData = await request.json();
    if (
      typeof assessmentData === 'object' && assessmentData !== null &&
      'title' in assessmentData
    ) {
      let assessment = await db.assessments.where('jobId').equals(jobId as string).first();
      if (assessment) {
        const updatedAssessment: Assessment = {
          ...assessment,
          ...assessmentData,
          updatedAt: Date.now(),
        };
        await db.assessments.put(updatedAssessment);
        return HttpResponse.json(updatedAssessment);
      } else {
        const newAssessment: Assessment = {
          id: genId(),
          jobId: jobId as string,
          title: assessmentData.title,
          sections: Array.isArray(assessmentData.sections) ? assessmentData.sections : [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await db.assessments.add(newAssessment);
        return HttpResponse.json(newAssessment, { status: 201 });
      }
    } else {
      return HttpResponse.json({ error: 'Invalid assessment data' }, { status: 400 });
    }
  }),
  http.post('/api/assessments/:jobId/submit', async ({ request, params }) => {
    await delay();
    if (shouldError()) return createErrorResponse('Failed to submit assessment');
    const responseData = await request.json();
    if (
      typeof responseData === 'object' && responseData !== null &&
      'responses' in responseData && Array.isArray(responseData.responses)
    ) {
      const submission: Submission = {
        id: genId(),
        assessmentId: params.jobId as string,
        responses: responseData.responses,
        createdAt: Date.now(),
      };
      await db.submissions.add(submission);
      return HttpResponse.json(submission, { status: 201 });
    } else {
      return HttpResponse.json({ error: 'Invalid submission data' }, { status: 400 });
    }
  }),
];

export const handlers = [
  ...jobsHandlers,
  ...candidatesHandlers,
  ...assessmentsHandlers,
];
