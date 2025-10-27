import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { seedInitialData, reseedData } from '../utils/init';
import { jobsAPI, candidatesAPI } from '../utils/api';

const HomePage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalCandidates: 0,
        pendingCandidates: 0
    });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        async function init() {
            // Check if data exists, if not seed it
            const result = await jobsAPI.getAll();
            if (result.jobs.length === 0) {
                await seedInitialData();
                setIsInitialized(true);
            }
            
            // Debug: Check if companies exist in data
            const sampleJobs = result.jobs.slice(0, 3);
            const hasCompanies = sampleJobs.some(job => job.company);
            console.log('Dashboard - Sample jobs:', sampleJobs.map(j => ({ title: j.title, company: j.company })));
            console.log('Dashboard - Has companies:', hasCompanies);
            if (!hasCompanies && result.jobs.length > 0) {
                console.warn('⚠️ Jobs exist but have no companies! Click "Reseed Data" to add companies.');
            }
            
            // Load stats
            loadStats();
        }
        init();
    }, []);

    const loadStats = async () => {
        const [allJobs, activeJobs, allCandidates, pendingCandidates] = await Promise.all([
            jobsAPI.getAll(),
            jobsAPI.getAll({ status: 'active' }),
            candidatesAPI.getAll(),
            candidatesAPI.getAll({ stage: 'applied' })
        ]);

        setStats({
            totalJobs: allJobs.total,
            activeJobs: activeJobs.total,
            totalCandidates: allCandidates.total,
            pendingCandidates: pendingCandidates.total
        });
    };

    const handleReseed = async () => {
        if (window.confirm('This will clear all data and generate new sample data with companies. Continue?')) {
            await reseedData();
            loadStats();
            window.location.reload();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {isInitialized && (
                <div className="bg-gray-200 border border-gray-400 text-gray-800 px-4 py-3 rounded mb-6">
                    ✓ Initial data seeded successfully! You now have sample jobs and candidates to work with.
                </div>
            )}

            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mb-2">Welcome to TalentFlow</h1>
                        <p className="text-gray-600 text-lg">Your comprehensive hiring platform</p>
                    </div>
                    <button
                        onClick={handleReseed}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors"
                        title="Clear all data and generate new sample data with companies"
                    >
                        🔄 Reseed Data
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Total Jobs</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalJobs}</p>
                    <p className="text-sm text-gray-600 mt-2">{stats.activeJobs} active</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Total Candidates</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalCandidates}</p>
                    <p className="text-sm text-gray-600 mt-2">{stats.pendingCandidates} new applications</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Assessments</h3>
                    <p className="text-3xl font-bold text-gray-800">-</p>
                    <p className="text-sm text-gray-600 mt-2">Manage job assessments</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Pipeline</h3>
                    <p className="text-3xl font-bold text-gray-800">View</p>
                    <p className="text-sm text-gray-600 mt-2">Kanban board</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/jobs')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
                    >
                        <h3 className="font-semibold text-gray-800 mb-2">📋 Manage Jobs</h3>
                        <p className="text-gray-600 text-sm">Create, edit, and organize job postings</p>
                    </button>

                    <button
                        onClick={() => navigate('/candidates')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
                    >
                        <h3 className="font-semibold text-gray-800 mb-2">👥 View Candidates</h3>
                        <p className="text-gray-600 text-sm">Browse and manage candidate applications</p>
                    </button>

                    <button
                        onClick={() => navigate('/candidates/kanban')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
                    >
                        <h3 className="font-semibold text-gray-800 mb-2">📊 Kanban Board</h3>
                        <p className="text-gray-600 text-sm">Drag and drop candidates through stages</p>
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mb-6">Platform Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Jobs Management</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Pagination & filtering</li>
                            <li>• Drag-and-drop reordering</li>
                            <li>• Archive/unarchive jobs</li>
                            <li>• Deep linking support</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Candidates</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Virtualized list (1000+)</li>
                            <li>• Kanban pipeline view</li>
                            <li>• Status timeline</li>
                            <li>• Notes with @mentions</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Assessments</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Custom question builder</li>
                            <li>• Live preview</li>
                            <li>• Form validation</li>
                            <li>• Conditional questions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;