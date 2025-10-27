import { 
  db, 
  genId, 
  type Job, 
  type Candidate, 
  type Assessment, 
  type AssessmentSection,
  type Question,
  type QuestionOption,
  type Note,
  type TimelineEvent 
} from '../db';
const companies = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 
  'Netflix', 'Stripe', 'Airbnb', 'Uber', 'Tesla',
  'Spotify', 'Adobe', 'Salesforce', 'Oracle', 'IBM',
  'Intel', 'NVIDIA', 'PayPal', 'Shopify', 'Zoom'
];

export const AUTO_SEED_CANDIDATES = (() => {
  try {
    const v = localStorage.getItem('seed:candidates');
    if (v === 'false') return false;
  } catch (e) {
    
  }
  return true;
})();

const jobTitles = [
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer',
  'Data Scientist', 'Product Manager', 'UX Designer', 'UI Designer',
  'Mobile Developer', 'Software Architect', 'QA Engineer', 'Site Reliability Engineer',
  'Machine Learning Engineer', 'Security Engineer', 'Technical Writer', 'Engineering Manager'
];

const techTags = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Python', 'Java', 'Go',
  'Node.js', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'PostgreSQL',
  'MongoDB', 'Redis', 'Elasticsearch', 'Microservices', 'Remote', 'Senior', 'Junior'
];
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Sage', 'River', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper',
  'Jamie', 'Kendall', 'Lane', 'Marley', 'Nico', 'Parker', 'Reagan', 'Skyler'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White'
];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
export const generateSlug = slugify;

export function generateJobs(): Job[] {
  const jobs: Job[] = [];
  const now = Date.now();

  for (let i = 0; i < 25; i++) {
    const title = randomChoice(jobTitles);
    const company = randomChoice(companies);
  const isArchived = Math.random() < 0.2;
  const tags = randomChoices(techTags, Math.floor(Math.random() * 4) + 2);
    
    const job: Job = {
      id: genId(),
      title,
      slug: slugify(`${title}-${company}-${i + 1}`),
      description: `We are looking for an experienced ${title} to join our team at ${company}. You will work on cutting-edge projects and collaborate with a talented team of engineers.`,
      company,
      status: isArchived ? 'archived' : 'active',
      tags,
      order: i,
      createdAt: now - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      updatedAt: now - (Math.random() * 7 * 24 * 60 * 60 * 1000)   // Random date within last 7 days
    };

    jobs.push(job);
  }

  return jobs;
}

export function generateCandidates(jobs: Job[]): Candidate[] {
  const candidates: Candidate[] = [];
  const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected'];
  const now = Date.now();
  const total = 1000;
  for (let i = 0; i < total; i++) {
    const firstName = randomChoice(firstNames);
    const lastName = randomChoice(lastNames);
    const job = (jobs && jobs.length > 0) ? jobs[i % jobs.length] : ({ id: '', company: '', title: '' } as Job);
    const stage = randomChoice(stages);
    
    
    const emailVariations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@outlook.com`,
      `${firstName.toLowerCase()}${i}@example.com`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}@yahoo.com`
    ];
    
    const candidate: Candidate = {
      id: genId(),
      name: `${firstName} ${lastName}`,
      email: randomChoice(emailVariations),
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: job.company || '',
      jobTitle: job.title || '',
      stage,
      jobId: job.id || '',
      appliedAt: now - (Math.random() * 60 * 24 * 60 * 60 * 1000) // Applied within last 60 days
    };

    candidates.push(candidate);
  }

  return candidates;
}

export function generateNCandidates(jobs: Job[], count: number): Candidate[] {
  const candidates: Candidate[] = [];
  const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected'];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(firstNames);
    const lastName = randomChoice(lastNames);
    const job = (jobs && jobs.length > 0) ? jobs[i % jobs.length] : ({ id: '', company: '', title: '' } as Job);
    const stage = randomChoice(stages);

  const emailVariations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@outlook.com`,
      `${firstName.toLowerCase()}${i}@example.com`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}@yahoo.com`
    ];

    const candidate: Candidate = {
      id: genId(),
      name: `${firstName} ${lastName}`,
      email: randomChoice(emailVariations),
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: job.company || '',
      jobTitle: job.title || '',
      stage,
      jobId: job.id || '',
      appliedAt: now - (Math.random() * 60 * 24 * 60 * 60 * 1000)
    };

    candidates.push(candidate);
  }

  return candidates;
}

function generateQuestions(_jobTitle: string, sectionType: string): Question[] {
  const questions: Question[] = [];
  const questionTypes: Question['type'][] = ['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric'];

  const questionTemplates = {
    technical: [
      'What is your experience with React?',
      'Explain the concept of closures in JavaScript',
      'How do you handle state management in large applications?',
      'What is your preferred testing framework?',
      'Describe your experience with CI/CD pipelines'
    ],
    experience: [
      'How many years of experience do you have in software development?',
      'Tell us about your most challenging project',
      'What is your preferred programming language?',
      'Have you worked in an Agile environment?',
      'Describe your leadership experience'
    ],
    cultural: [
      'What motivates you in your work?',
      'How do you handle tight deadlines?',
      'Describe your ideal work environment',
      'What are your career goals?',
      'How do you stay updated with technology trends?'
    ]
  };

  const templates = questionTemplates[sectionType as keyof typeof questionTemplates] || questionTemplates.technical;

  for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
    const type = randomChoice(questionTypes);
    const template = templates[i % templates.length];
    
    const question: Question = {
      id: genId(),
      type,
      label: template,
      helpText: `Please provide detailed information about ${template.toLowerCase()}`,
      order: i,
      validation: {
        required: Math.random() < 0.7
      }
    };

    
    if (type === 'single-choice' || type === 'multi-choice') {
      const options: QuestionOption[] = [
        { id: genId(), label: 'Excellent', value: 'excellent' },
        { id: genId(), label: 'Good', value: 'good' },
        { id: genId(), label: 'Average', value: 'average' },
        { id: genId(), label: 'Poor', value: 'poor' }
      ];
      question.options = options;
    }

    
    if (type === 'numeric') {
      question.validation = {
        ...question.validation,
        min: 0,
        max: 10
      };
    }

    
    if (type === 'short-text' || type === 'long-text') {
      question.validation = {
        ...question.validation,
        minLength: type === 'short-text' ? 10 : 50,
        maxLength: type === 'short-text' ? 100 : 1000
      };
    }

    questions.push(question);
  }

  return questions;
}

export function generateAssessments(jobs: Job[]): Assessment[] {
  const assessments: Assessment[] = [];
  const now = Date.now();

  const activeJobs = jobs.filter(job => job.status === 'active');
  const jobsToAssess = activeJobs.slice(0, Math.max(3, Math.min(activeJobs.length, 8)));

  jobsToAssess.forEach((job) => {
    const sections: AssessmentSection[] = [
      {
        id: genId(),
        title: 'Technical Skills',
        description: 'Evaluate technical competency and problem-solving abilities',
        questions: generateQuestions(job.title, 'technical'),
        order: 0
      },
      {
        id: genId(),
        title: 'Experience & Background', 
        description: 'Assess relevant work experience and qualifications',
        questions: generateQuestions(job.title, 'experience'),
        order: 1
      },
      {
        id: genId(),
        title: 'Cultural Fit',
        description: 'Determine alignment with company values and work style',
        questions: generateQuestions(job.title, 'cultural'),
        order: 2
      }
    ];

    const assessment: Assessment = {
      id: genId(),
      jobId: job.id,
      title: `${job.title} Assessment - ${job.company}`,
      description: `Comprehensive assessment for ${job.title} position at ${job.company}. This assessment evaluates technical skills, experience, and cultural fit.`,
      sections,
      createdAt: now - (Math.random() * 14 * 24 * 60 * 60 * 1000),
      updatedAt: now - (Math.random() * 7 * 24 * 60 * 60 * 1000)
    };

    assessments.push(assessment);
  });

  return assessments;
}

export function generateNotesAndTimeline(candidates: Candidate[]): { notes: Note[], timeline: TimelineEvent[] } {
  const notes: Note[] = [];
  const timeline: TimelineEvent[] = [];
  const now = Date.now();

  
  const stageOrder: Candidate['stage'][] = ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected'];
  const getStatusNumber = (stage?: string) => {
    if (!stage) return -1;
    const idx = stageOrder.indexOf(stage as any);
    return idx >= 0 ? idx : Math.max(0, stageOrder.length - 2);
  };

  const richCount = Math.floor(candidates.length * 0.3);
  const richCandidates = candidates.slice(0, richCount);

  const pushEvent = (candidateId: string, type: TimelineEvent['type'], description: string, ts: number, metadata?: any) => {
    const meta = metadata ? { ...metadata } : {};
    
    if (meta.statusNumber === undefined) {
      const toStage = (meta.toStage || meta.stage || undefined);
      meta.statusNumber = getStatusNumber(toStage || undefined);
    }
    timeline.push({ id: genId(), candidateId, type, description, timestamp: ts, metadata: meta });
  };

  richCandidates.forEach(candidate => {
    const appliedAt = candidate.appliedAt || now - (Math.random() * 30 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'stage_change', `Applied to ${candidate.jobTitle || 'position'}`, appliedAt, { fromStage: null, toStage: 'applied' });

    
  if (Math.random() < 0.8) {
  const screeningAt = appliedAt + Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'stage_change', `Moved to screening`, screeningAt, { fromStage: 'applied', toStage: 'screening' });

      
      if (Math.random() < 0.5) {
        notes.push({ id: genId(), candidateId: candidate.id, content: `Screening call completed — positive initial impression.`, mentions: [], createdAt: screeningAt + 1000, createdBy: 'recruiter' });
      }
    }

    
  if (Math.random() < 0.5) {
  const interviewScheduledAt = (candidate.appliedAt || appliedAt) + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'interview_scheduled', `Interview scheduled`, interviewScheduledAt, { interviewer: randomChoice(['@john', '@jane', '@alex', '@sarah']) });

      
      if (Math.random() < 0.9) {
        const interviewCompletedAt = interviewScheduledAt + Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'stage_change', `Interview completed`, interviewCompletedAt, { fromStage: 'screening', toStage: 'interview' });
        notes.push({ id: genId(), candidateId: candidate.id, content: `Interview feedback: strong problem solving and communication.`, mentions: [], createdAt: interviewCompletedAt + 5000, createdBy: 'interviewer' });
      }
    }

    
    if (Math.random() < 0.4) {
      const assessmentStart = now - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000);
      pushEvent(candidate.id, 'assessment_completed', `Assessment completed`, assessmentStart + 1000, { score: Math.floor(Math.random() * 51) + 50, toStage: 'assessment' });
    }

    
    if (Math.random() < 0.2) {
  const offerAt = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'stage_change', `Offer extended`, offerAt, { fromStage: 'interview', toStage: 'offer' });
      
      if (Math.random() < 0.6) {
  const hiredAt = offerAt + Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'stage_change', `Hired`, hiredAt, { fromStage: 'offer', toStage: 'hired' });
      } else {
  const rejectedAt = offerAt + Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000);
  pushEvent(candidate.id, 'stage_change', `Rejected after offer`, rejectedAt, { fromStage: 'offer', toStage: 'rejected' });
      }
    } else {
      
      if (Math.random() < 0.1) {
        const rejAt = now - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000);
        pushEvent(candidate.id, 'stage_change', `Rejected`, rejAt, { fromStage: candidate.stage, toStage: 'rejected' });
      }
    }
  });

  
  const remaining = candidates.slice(richCount);
  remaining.forEach(candidate => {
    const appliedAt = candidate.appliedAt || now - (Math.random() * 30 * 24 * 60 * 60 * 1000);
    pushEvent(candidate.id, 'stage_change', `Applied`, appliedAt, { toStage: candidate.stage });
  });

  
  timeline.sort((a, b) => a.timestamp - b.timestamp);
  return { notes, timeline };
}

// Main seeding function
export async function seedDatabase(): Promise<void> {
  console.log('🌱 Ensuring required seed data exists...');

  try {
    // Check existing counts
    const existingJobs = await db.jobs.toArray();
    const existingJobCount = existingJobs.length;
    const existingCandidateCount = await db.candidates.count();
    const existingAssessmentCount = await db.assessments.count();

    // Ensure jobs (target 25)
    const TARGET_JOBS = 25;
    let addedJobs: any[] = [];
    if (existingJobCount < TARGET_JOBS) {
      console.log(`📝 Found ${existingJobCount} jobs, creating ${TARGET_JOBS - existingJobCount} new jobs...`);
      const newJobs = generateJobs();
      // Only add the number required to reach TARGET_JOBS
      const jobsToAdd = newJobs.slice(0, TARGET_JOBS - existingJobCount).map((j) => ({ ...j }));
      if (jobsToAdd.length) {
        await db.jobs.bulkAdd(jobsToAdd);
        addedJobs = jobsToAdd;
      }
    }

    // Refresh jobs list to include any newly added jobs
    const jobs = await db.jobs.toArray();

    // Ensure candidates (target 1000)
    const TARGET_CANDIDATES = 1000;
    let addedCandidates: any[] = [];
    if (AUTO_SEED_CANDIDATES) {
      if (existingCandidateCount < TARGET_CANDIDATES) {
        const toCreate = TARGET_CANDIDATES - existingCandidateCount;
        console.log(`👥 Found ${existingCandidateCount} candidates, creating ${toCreate} new candidates...`);

        // Generate exactly the number of candidates needed
        const candidatesToAdd = generateNCandidates(jobs, toCreate);

        // Insert in chunks to avoid large single transaction
        const chunkSize = 200;
        for (let i = 0; i < candidatesToAdd.length; i += chunkSize) {
          const chunk = candidatesToAdd.slice(i, i + chunkSize);
          try {
            // eslint-disable-next-line no-await-in-loop
            await db.candidates.bulkAdd(chunk);
            addedCandidates.push(...chunk);
            console.log(`   +${chunk.length} candidates added (progress ${addedCandidates.length}/${toCreate})`);
          } catch (chunkErr) {
            console.error(`⚠️ Failed to add candidate chunk (items ${i}..${i + chunk.length - 1}):`, chunkErr);
            // Try adding items one by one to isolate failures
            for (let j = 0; j < chunk.length; j++) {
              try {
                // eslint-disable-next-line no-await-in-loop
                await db.candidates.add(chunk[j]);
                addedCandidates.push(chunk[j]);
              } catch (singleErr) {
                console.error(`   ✖ Failed to add candidate ${chunk[j].id}:`, singleErr);
              }
            }
            console.log(`   Progress after attempting individual inserts: ${addedCandidates.length}/${toCreate}`);
          }
        }
      }
    } else {
      console.log('ℹ️ AUTO_SEED_CANDIDATES is disabled; skipping candidate seeding.');
    }

    // Ensure assessments (target 3)
    const TARGET_ASSESSMENTS = 3;
    let addedAssessments: any[] = [];
    if (existingAssessmentCount < TARGET_ASSESSMENTS) {
      const toCreate = TARGET_ASSESSMENTS - existingAssessmentCount;
      console.log(`� Found ${existingAssessmentCount} assessments, creating ${toCreate} new assessments...`);

      const generatedAssessments = generateAssessments(jobs);
      const assessmentsToAdd = generatedAssessments.slice(0, toCreate).map(a => ({ ...a }));
      if (assessmentsToAdd.length) {
        await db.assessments.bulkAdd(assessmentsToAdd);
        addedAssessments = assessmentsToAdd;
      }
    }

    // Optionally add notes/timeline for newly added candidates
    let addedNotes: any[] = [];
    let addedTimeline: any[] = [];
    if (addedCandidates.length) {
      console.log('📝 Generating notes and timeline for newly added candidates...');
      const { notes, timeline } = generateNotesAndTimeline(addedCandidates);
      if (notes.length) {
        await db.notes.bulkAdd(notes);
        addedNotes = notes;
      }
      if (timeline.length) {
        await db.timeline.bulkAdd(timeline);
        addedTimeline = timeline;
      }
    }

    // Backfill timeline/notes for existing candidates if timeline table is empty
    try {
      const existingTimelineCount = await db.timeline.count();
      if (existingTimelineCount === 0) {
        console.log('🛠️ No timeline events found — backfilling timeline/notes for existing candidates...');
        const allCandidates = await db.candidates.toArray();
        const { notes: backNotes, timeline: backTimeline } = generateNotesAndTimeline(allCandidates);
        if (backNotes.length) {
          try { await db.notes.bulkAdd(backNotes); addedNotes.push(...backNotes); } catch (e) { console.error('Failed to bulk-add backfill notes:', e); }
        }
        if (backTimeline.length) {
          try { await db.timeline.bulkAdd(backTimeline); addedTimeline.push(...backTimeline); } catch (e) { console.error('Failed to bulk-add backfill timeline:', e); }
        }
        console.log(`   Backfilled notes: ${backNotes.length}, timeline events: ${backTimeline.length}`);
      }
    } catch (e) {
      console.error('Error checking/backfilling timeline:', e);
    }

    const finalJobs = await db.jobs.count();
    const finalCandidates = await db.candidates.count();
    const finalAssessments = await db.assessments.count();

    console.log('✅ Seeding ensured. Current counts:');
    console.log(`   jobs: ${finalJobs} (+${addedJobs.length})`);
    console.log(`   candidates: ${finalCandidates} (+${addedCandidates.length})`);
    console.log(`   assessments: ${finalAssessments} (+${addedAssessments.length})`);
    if (addedNotes.length) console.log(`   notes added: ${addedNotes.length}`);
    if (addedTimeline.length) console.log(`   timeline events added: ${addedTimeline.length}`);

  } catch (error) {
    console.error('❌ Error seeding database (non-fatal):', error);
    // Do not throw — seeding errors should not crash the app
  }
}

// Check if database needs seeding
export async function isDatabaseEmpty(): Promise<boolean> {
  try {
    const jobCount = await db.jobs.count();
    return jobCount === 0;
  } catch (error) {
    console.error('Error checking database status:', error);
    return true; // Assume empty if we can't check
  }
}

// Convenience wrapper used by init scripts
export async function ensureSeed(): Promise<void> {
  await seedDatabase();
}

// Dev helper: force backfill timeline/notes for all candidates
export async function backfillAllTimelines(force = false): Promise<{ notes: number; timeline: number }> {
  try {
    const existingTimelineCount = await db.timeline.count();
    if (!force && existingTimelineCount > 0) {
      console.log('[backfillAllTimelines] timeline already has events, skipping (use force=true to override)');
      return { notes: 0, timeline: 0 };
    }

    const allCandidates = await db.candidates.toArray();
    console.log(`[backfillAllTimelines] generating timeline for ${allCandidates.length} candidates...`);
    const { notes, timeline } = generateNotesAndTimeline(allCandidates);
    let addedNotes = 0;
    let addedTimeline = 0;
    if (notes.length) {
      try { await db.notes.bulkAdd(notes); addedNotes = notes.length; } catch (e) { console.error('backfill notes bulkAdd failed', e); }
    }
    if (timeline.length) {
      try { await db.timeline.bulkAdd(timeline); addedTimeline = timeline.length; } catch (e) { console.error('backfill timeline bulkAdd failed', e); }
    }
    console.log(`[backfillAllTimelines] added notes=${addedNotes} timeline=${addedTimeline}`);
    return { notes: addedNotes, timeline: addedTimeline };
  } catch (error) {
    console.error('[backfillAllTimelines] failed:', error);
    return { notes: 0, timeline: 0 };
  }
}