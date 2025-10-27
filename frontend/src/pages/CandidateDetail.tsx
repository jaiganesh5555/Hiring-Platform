import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import type { Candidate } from '../types';
import { candidatesAPI, jobsAPI } from '../utils/api';

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const jobId = searchParams.get('jobId');

  const teamMembers = ['@john', '@jane', '@alex', '@sarah'];
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadCandidate();
    }
  }, [id]);

  const loadCandidate = async () => {
    if (id) {
      const found = await candidatesAPI.getById(id);
      setCandidate(found);
      if (found?.jobId) {
        const jobData = await jobsAPI.getById(found.jobId);
        setJob(jobData);
      }
    }
  };

  const handleAddNote = async () => {
    if (!candidate || !noteContent.trim()) return;

    // Extract @mentions
    const mentionRegex = /@(\w+)/g;
    const foundMentions = [...noteContent.matchAll(mentionRegex)].map(m => m[1]);

    await candidatesAPI.addNote(candidate.id, {
      content: noteContent,
      mentions: foundMentions,
      createdBy: 'Current User'
    });

    setNoteContent('');
    
    // Reload candidate
    await loadCandidate();
  };

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/candidates${jobId ? `?jobId=${jobId}` : ''}`)}
          className="text-gray-600 hover:text-black mb-6 flex items-center gap-2 group transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Candidates</span>
        </button>

        
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {candidate.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{candidate.name}</h1>
                <div className="flex flex-wrap gap-3">
                 
                  
                  {candidate.company && (
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-lg border border-white/20">
                       {candidate.company}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span
                className={`px-4 py-2 text-sm font-bold rounded-xl ${
                  candidate.currentStage === 'hired'
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                    : candidate.currentStage === 'rejected'
                    ? 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900'
                } shadow-lg uppercase tracking-wide`}
              >
                {candidate.currentStage}
              </span>
              <div className="text-right">
                <p className="text-gray-300 text-xs">Applied on</p>
                <p className="text-white font-semibold">{format(candidate.appliedAt, 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg font-medium">{job?.title || 'Unknown Position'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 via-gray-900 to-black bg-clip-text text-transparent mb-6">
              Journey Timeline
            </h3>
            
            <div className="space-y-4">
              {(() => {
                
                const rawHistory = Array.isArray(candidate.statusHistory) ? candidate.statusHistory : [];
                const history = rawHistory.map((s, idx) => ({
                  id: s.id || `s-${idx}`,
                  stage: s.stage || candidate.currentStage,
                  timestamp: s.timestamp ? new Date(s.timestamp) : new Date(candidate.appliedAt),
                  note: (s as any).note || (s as any).description || undefined
                }));

                return history.map((status, index) => {
                  const isLatest = index === history.length - 1;
                
                return (
                  <div key={status.id} className="group">
                    <div className={`relative flex gap-4 ${!isLatest ? 'pb-4' : ''}`}>
                      
                      {!isLatest && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-100"></div>
                      )}
                      
                      
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            isLatest
                              ? 'bg-gradient-to-br from-gray-800 to-black text-white shadow-lg scale-110'
                              : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 group-hover:scale-105'
                          }`}
                        >
                          {typeof (status as any).statusNumber === 'number' ? (status as any).statusNumber : index}
                        </div>
                        {isLatest && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl opacity-20 animate-pulse"></div>
                        )}
                      </div>
                      
                      
                      <div className={`flex-1 ${isLatest ? 'pt-1' : ''}`}>
                        <div className={`rounded-xl p-4 transition-all duration-300 ${
                          isLatest
                            ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300'
                            : 'bg-gray-50 border border-gray-200 group-hover:bg-gray-100'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-bold capitalize ${
                              isLatest ? 'text-lg text-gray-900' : 'text-gray-800'
                            }`}>
                              {status.stage}
                            </h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {format(status.timestamp, 'MMM d, HH:mm')}
                            </span>
                          </div>
                          {status.note && (
                            <p className="text-sm text-gray-600 mb-2">{status.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
                });
              })()}
            </div>
          </div>

          
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 via-gray-900 to-black bg-clip-text text-transparent mb-6">
              Notes & Comments
            </h3>
            
            
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                placeholder="Add a note... Use @ to mention team members"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white resize-none"
              />
              <div className="mt-3 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member) => (
                    <button
                      key={member}
                      onClick={() => setNoteContent(noteContent + ' ' + member)}
                      className="text-xs px-2 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      {member}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddNote}
                  disabled={!noteContent.trim()}
                  className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-lg hover:from-black hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg disabled:shadow-none"
                >
                  Post
                </button>
              </div>
            </div>

            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {candidate.notes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg font-medium">No notes yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start the conversation!</p>
                </div>
              ) : (
                candidate.notes.map((note) => (
                  <div key={note.id} className="group">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-black flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {note.createdBy.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900">{note.createdBy}</p>
                            <p className="text-xs text-gray-500">
                              {format(note.createdAt, 'MMM d, HH:mm')}
                            </p>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                            {note.content}
                          </p>
                          {note.mentions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {note.mentions.map((mention) => (
                                <span
                                  key={mention}
                                  className="text-xs bg-gray-800 text-white px-2 py-1 rounded-full font-medium"
                                >
                                  @{mention}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
