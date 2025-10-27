import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import type { Job, Assessment } from '../types';
import { jobsAPI, assessmentsAPI } from '../utils/api';
import { format } from 'date-fns';

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  useEffect(() => {
    if (jobId) {
      loadJobAndAssessments();
    }
  }, [jobId]);
  
  const loadJobAndAssessments = async () => {
    if (jobId) {
      const foundJob = await jobsAPI.getById(jobId);
      setJob(foundJob);
      await loadAssessments();
      setLoading(false);
    }
  };
  
  const loadAssessments = async () => {
    if (jobId) {
      const jobAssessments = await assessmentsAPI.getAllByJobId(jobId);
      setAssessments(jobAssessments);
    }
  };
  
  const handleDeleteAssessment = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (assessmentToDelete) {
      await assessmentsAPI.delete(assessmentToDelete.id);
      loadAssessments();
      setShowDeleteModal(false);
      setAssessmentToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
          <button
            onClick={() => navigate('/jobs')}
            className="text-black hover:underline"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/jobs')}
        className="text-gray-600 hover:text-black mb-6 flex items-center gap-2"
      >
        ← Back to Jobs
      </button>

      <Tilt tiltMaxAngleX={0} tiltMaxAngleY={0} scale={1.02} transitionSpeed={400}>
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mb-2">{job.title}</h1>
              {job.company && (
                <p className="text-sm text-gray-500 mb-1">
                  {job.company}
                </p>
              )}
              <p className="text-gray-600">Slug: {job.slug}</p>
            </div>
            <span
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                job.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {job.status}
            </span>
          </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">{format(job.createdAt, 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">{format(job.updatedAt, 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assessment Management</h2>
            <button
              onClick={() => navigate(`/assessments/${job.id}/new`)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Create Assessment
            </button>
          </div>
          
          {assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment) => {
                const totalQuestions = assessment.sections.reduce(
                  (sum: number, s) => sum + s.questions.length, 0
                );
                
                return (
                  <div key={assessment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {assessment.title}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            ✓ Active
                          </span>
                        </div>
                        
                        {assessment.description && (
                          <p className="text-gray-600 mb-3">{assessment.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📋 {assessment.sections.length} sections</span>
                          <span>❓ {totalQuestions} questions</span>
                          <span>🕒 Updated {format(assessment.updatedAt, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/assessments/${job.id}/${assessment.id}`)}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/assessments/${job.id}/${assessment.id}?preview=true`)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(assessment)}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-yellow-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Assessments Created</h3>
              <p className="text-gray-600 mb-4">Create assessments to evaluate candidates for this position</p>
              <button
                onClick={() => navigate(`/assessments/${job.id}/new`)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Your First Assessment
              </button>
            </div>
          )}
        </div>

        
        {showDeleteModal && assessmentToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Delete Assessment?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{assessmentToDelete.title}</strong>"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            onClick={() => navigate(`/candidates?jobId=${job.id}`)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Candidates
          </button>
        </div>
        </div>
      </Tilt>
    </div>
  );
};

export default JobDetailPage;
