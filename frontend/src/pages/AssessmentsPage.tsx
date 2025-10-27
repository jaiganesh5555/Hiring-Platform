import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Assessment } from '../types';
import { assessmentsAPI, jobsAPI } from '../utils/api';
import { AssessmentBuilder, AssessmentPreview } from '../Components/Assessments';

const AssessmentsPage = () => {
  const { jobId, assessmentId } = useParams<{ jobId: string; assessmentId?: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState<string>('');

  useEffect(() => {
    if (!jobId) {
      navigate('/jobs');
      return;
    }

    loadData();
  }, [jobId, assessmentId, navigate]);

  const loadData = async () => {
    if (!jobId) return;
    
    
    const job = await jobsAPI.getById(jobId);
    if (job) {
      setJobTitle(job.title);
    }

    
    if (assessmentId && assessmentId !== 'new') {
      
      const existing = await assessmentsAPI.getById(assessmentId);
      if (existing) {
        setAssessment(existing);
      } else {
        navigate(`/jobs/${jobId}`);
      }
    } else {
      
      const newAssessment: Assessment = {
        id: crypto.randomUUID(),
        jobId,
        title: 'New Assessment',
        description: '',
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setAssessment(newAssessment);
    }

    setLoading(false);
  };

  const handleSave = async (updatedAssessment: Assessment) => {
    if (assessmentId === 'new') {
      // Save new assessment
      await assessmentsAPI.create(updatedAssessment);
    } else {
      // Update existing assessment
      await assessmentsAPI.update(updatedAssessment.id, updatedAssessment);
    }
    setAssessment(updatedAssessment);
  };

  const handleBack = () => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading || !assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-black mb-4 flex items-center gap-2"
          >
            ← Back to {jobTitle}
          </button>
          <h1 className="text-3xl font-bold">
            {assessmentId === 'new' ? 'Create New Assessment' : 'Edit Assessment'}
          </h1>
        </div>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isPreview
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isPreview ? 'Back to Edit' : 'Preview'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={isPreview ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {!isPreview ? (
            <AssessmentBuilder assessment={assessment} onSave={handleSave} />
          ) : (
            <AssessmentPreview assessment={assessment} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
