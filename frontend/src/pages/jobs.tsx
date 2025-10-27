import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Job, JobFilters } from '../types';
import { jobsAPI } from '../utils/api';
import JobCard from '../Components/Jobs/JobCard';
import JobModal from '../Components/Jobs/JobModal';
import DeleteJobModal from '../Components/Jobs/DeleteJobModal';

const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<JobFilters>({ status: 'active' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [page, filters]);

  const loadJobs = async () => {
    const result = await jobsAPI.getAll(filters, { page, pageSize });
    setJobs(result.jobs.sort((a, b) => a.order - b.order));
    setTotal(result.total);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (editingJob) {
      await jobsAPI.update(editingJob.id, jobData);
    } else {
      await jobsAPI.create(jobData as Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
    }
    loadJobs();
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    await jobsAPI.update(job.id, { status: newStatus });
    loadJobs();
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (jobId: string) => {
    await jobsAPI.delete(jobId);
    loadJobs();
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleReorder = async (dragIndex: number, hoverIndex: number) => {
    const dragJob = jobs[dragIndex];
    const newJobs = [...jobs];
    newJobs.splice(dragIndex, 1);
    newJobs.splice(hoverIndex, 0, dragJob);
    setJobs(newJobs);
    setIsDragging(true);

    // Save to backend
    try {
      await jobsAPI.reorder(dragIndex, hoverIndex);
    } catch (error) {
      // Rollback on failure
      console.error('Failed to reorder:', error);
      loadJobs();
    } finally {
      setIsDragging(false);
    }
  };

  const handleJobClick = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent whitespace-nowrap">
          Jobs Board
        </h1>
        
        
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search jobs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        
        <div className="w-40">
          <select
            value={filters.status || 'all'}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        
        <div className="w-48">
          <input
            type="text"
            placeholder="Filter by tags..."
            onChange={(e) => {
              const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
              setFilters({ ...filters, tags: tags.length > 0 ? tags : undefined });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        
        <button
          onClick={handleCreateJob}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap ml-auto"
          aria-label="Create Job"
        >
          Create Job
        </button>
      </div>

      

      <DndProvider backend={HTML5Backend}>
        <div className={`space-y-4 ${isDragging ? 'opacity-70' : ''}`}>
          {jobs.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              index={index}
              onEdit={handleEditJob}
              onToggleStatus={handleToggleStatus}
              onReorder={handleReorder}
              onClick={handleJobClick}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      </DndProvider>

      {jobs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No jobs found. Create your first job to get started!
        </div>
      )}

      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      <JobModal
        isOpen={isModalOpen}
        job={editingJob}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
      />

      <DeleteJobModal
        job={jobToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default JobsPage;