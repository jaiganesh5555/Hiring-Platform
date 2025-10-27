import { useEffect, useState } from 'react';
import { jobsAPI, candidatesAPI } from '../utils/api';
import { reseedData } from '../utils/init';

const DataDebugPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allJobsResult = await jobsAPI.getAll();
    const allCandidatesResult = await candidatesAPI.getAll();
    setJobs(allJobsResult.jobs.slice(0, 5));
    setCandidates(allCandidatesResult.candidates.slice(0, 5));
  };

  const handleReseed = async () => {
    await reseedData();
    setMessage('✅ Data reseeded successfully! Companies have been added to all jobs.');
    loadData();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const hasCompanies = jobs.some(job => job.company);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Debug Page</h1>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {!hasCompanies && jobs.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
          ⚠️ <strong>No Companies Found!</strong> Your data was created before the company field was added.
          <br />
          Click the button below to regenerate data with companies.
        </div>
      )}

      {hasCompanies && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6">
          ✅ <strong>Companies Found!</strong> Jobs have company information.
        </div>
      )}

      <button
        onClick={handleReseed}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 mb-8"
      >
        🔄 Reseed Data with Companies
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div>
          <h2 className="text-2xl font-bold mb-4">Sample Jobs ({jobs.length})</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">ID: {job.id}</p>
                {job.company ? (
                  <p className="text-sm text-green-600">🏢 Company: {job.company}</p>
                ) : (
                  <p className="text-sm text-red-600">❌ No company</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        
        <div>
          <h2 className="text-2xl font-bold mb-4">Sample Candidates ({candidates.length})</h2>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold">{candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.email}</p>
                {candidate.company ? (
                  <p className="text-sm text-green-600">🏢 Company: {candidate.company}</p>
                ) : (
                  <p className="text-sm text-red-600">❌ No company</p>
                )}
                <p className="text-xs text-gray-500">Job ID: {candidate.jobId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">LocalStorage Info:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({
            jobsCount: jobs.length,
            candidatesCount: candidates.length,
            hasCompanies: hasCompanies,
            storageKeys: Object.keys(localStorage)
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DataDebugPage;
