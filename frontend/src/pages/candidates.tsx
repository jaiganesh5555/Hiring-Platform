import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Candidate, CandidateFilters, CandidateStage } from '../types';
import { candidatesAPI, jobsAPI } from '../utils/api';

const CandidatesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId') || undefined;
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filters, setFilters] = useState<CandidateFilters>({
    stage: 'all',
    search: '',
    jobId: jobIdFromUrl,
    company: ''
  });
  
  const parentRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const jobIdParam = searchParams.get('jobId');
    if (jobIdParam) {
      
      setFilters(prev => ({ ...prev, jobId: jobIdParam }));
    } else {
      
      setFilters(prev => ({ ...prev, jobId: undefined }));
    }
  }, [searchParams]);

  
  const [availableJobs, setAvailableJobs] = useState<Array<{ id: string; title: string }>>([]);
  
  useEffect(() => {
    async function loadJobs() {
      
      const allCandidatesResult = await candidatesAPI.getAll();
      const uniqueJobIds = Array.from(new Set(allCandidatesResult.candidates.map(c => c.jobId)));
      const jobPromises = uniqueJobIds.map(jobId => jobsAPI.getById(jobId));
      const jobs = await Promise.all(jobPromises);
      const validJobs = jobs.filter(Boolean).map(job => ({ id: job!.id, title: job!.title }));
      validJobs.sort((a, b) => a.title.localeCompare(b.title));
      setAvailableJobs(validJobs);
      
      
      const sampleJobs = await Promise.all(uniqueJobIds.slice(0, 3).map(id => jobsAPI.getById(id)));
      console.log('Sample jobs with companies:', sampleJobs.map(j => ({ title: j?.title, company: j?.company })));
    }
    loadJobs();
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [filters]);

  const loadCandidates = async () => {
    const result = await candidatesAPI.getAll(filters);
    setCandidates(result.candidates);
  };

  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10
  });

  const handleCandidateClick = (candidate: Candidate) => {
    // Preserve jobId in navigation if it exists
    const queryParam = filters.jobId ? `?jobId=${filters.jobId}` : '';
    navigate(`/candidates/${candidate.id}${queryParam}`);
  };

  const stages: Array<CandidateStage | 'all'> = [
    'all',
    'applied',
    'screening',
    'interview',
    'assessment',
    'offer',
    'hired',
    'rejected'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button when coming from job details */}
      {filters.jobId && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/jobs/${filters.jobId}`)}
            className="text-gray-600 hover:text-black flex items-center gap-2 group transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Job Details</span>
          </button>
          <button
            onClick={() => navigate('/candidates')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors text-sm"
          >
            View All Candidates
          </button>
        </div>
      )}
      
      {/* Header with Search and Filter inline */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent whitespace-nowrap">
          Candidates
        </h1>
        
        {/* Search */}
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Stage Filter */}
        <div className="w-48">
          <select
            value={filters.stage || 'all'}
            onChange={(e) => setFilters({ ...filters, stage: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Job Filter - Only show if not already filtered by jobId from URL */}
        {!filters.jobId && (
          <div className="w-48">
            <select
              value={filters.jobId || ''}
              onChange={(e) => setFilters({ ...filters, jobId: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">All Jobs</option>
              {availableJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Kanban View Button */}
        <button
          onClick={() => navigate(`/candidates/kanban${filters.jobId ? `?jobId=${filters.jobId}` : ''}`)}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap ml-auto"
        >
          Kanban View
        </button>
      </div>

      {/* Virtualized List */}
      <div
        ref={parentRef}
        className="bg-white border border-gray-200 rounded-lg overflow-auto"
        style={{ height: '600px' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const candidate = candidates[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <div className="h-full border-b border-gray-400 hover:bg-gray-200 cursor-pointer
                  transition-all duration-100 hover:shadow-md relative"
                  onClick={() => handleCandidateClick(candidate)}
                >
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.email}</p>
                      {candidate.company && (
                        <p className="text-xs text-gray-500 mt-1"> {candidate.company}</p>
                      )}
                     
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        candidate.currentStage === 'hired'
                          ? 'bg-gray-300 text-gray-900'
                          : candidate.currentStage === 'rejected'
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {candidate.currentStage}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {candidates.length} candidates
      </div>
    </div>
  );
};

export default CandidatesPage;