import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Candidate, CandidateStage } from '../types';
import { candidatesAPI } from '../utils/api';

const stages: CandidateStage[] = [
  'applied',
  'screening',
  'interview',
  'assessment',
  'offer',
  'hired',
  'rejected'
];

const stageColors: Record<CandidateStage, string> = {
  applied: 'bg-gray-100',
  screening: 'bg-gray-200',
  interview: 'bg-gray-300',
  assessment: 'bg-gray-400',
  offer: 'bg-gray-500',
  hired: 'bg-gray-600',
  rejected: 'bg-gray-700'
};

interface CandidateCardProps {
  candidate: Candidate;
  jobId?: string | null;
}

const CandidateCard = ({ candidate, jobId }: CandidateCardProps) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'CANDIDATE',
    item: { candidateId: candidate.id, currentStage: candidate.currentStage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(ref);

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/candidates/${candidate.id}${jobId ? `?jobId=${jobId}` : ''}`)}
      className={`bg-white border border-gray-300 rounded p-3 mb-2 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <p className="font-medium text-gray-800 text-sm">{candidate.name}</p>
      <p className="text-xs text-gray-600 truncate">{candidate.email}</p>
      {candidate.company && (
        <p className="text-xs text-gray-500 mt-1"> {candidate.company}</p>
      )}
    </div>
  );
};

interface StageColumnProps {
  stage: CandidateStage;
  candidates: Candidate[];
  onDrop: (candidateId: string, newStage: CandidateStage) => void;
  jobId?: string | null;
}

const StageColumn = ({ stage, candidates, onDrop, jobId }: StageColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop({
    accept: 'CANDIDATE',
    drop: (item: { candidateId: string; currentStage: CandidateStage }) => {
      if (item.currentStage !== stage) {
        onDrop(item.candidateId, stage);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`flex-1 min-w-[250px] ${stageColors[stage]} rounded-lg p-4 ${
        isOver ? 'ring-2 ring-black' : ''
      }`}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 capitalize">{stage}</h3>
        <p className="text-sm text-black-600">{candidates.length} candidates</p>
      </div>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} jobId={jobId} />
        ))}
      </div>
    </div>
  );
};

const CandidateKanbanPage = () => {
  const navigate = useNavigate();
      const [searchParams] = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    loadCandidates();
  }, [jobId]);

  const loadCandidates = async () => {
    const filters = jobId ? { jobId } : {};
    const result = await candidatesAPI.getAll(filters);
    setCandidates(result.candidates);
  };

  const handleDrop = async (candidateId: string, newStage: CandidateStage) => {
    // Update candidate stage
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Update with both stage (DB format) and currentStage (UI format)
    const updatedCandidate: any = {
      stage: newStage,
      currentStage: newStage
    };

    await candidatesAPI.update(candidateId, updatedCandidate);
    loadCandidates();
  };

  const getCandidatesByStage = (stage: CandidateStage) => {
    return candidates.filter(c => (c as any).currentStage === stage || (c as any).stage === stage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button when coming from job details */}
      {jobId && (
        <button
          onClick={() => navigate(`/jobs/${jobId}`)}
          className="text-gray-600 hover:text-black mb-6 flex items-center gap-2 group transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Job Details</span>
        </button>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent">Candidate Pipeline</h1>
        <button
          onClick={() => navigate(`/candidates${jobId ? `?jobId=${jobId}` : ''}`)}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          List View
        </button>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              candidates={getCandidatesByStage(stage)}
              onDrop={handleDrop}
              jobId={jobId}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default CandidateKanbanPage;
