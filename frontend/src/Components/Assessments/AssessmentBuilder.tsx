import { useState } from 'react';
import type { Assessment, AssessmentSection, Question, QuestionType, QuestionOption } from '../../types';

interface AssessmentBuilderProps {
  assessment: Assessment;
  onSave: (assessment: Assessment) => void;
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multi-choice', label: 'Multiple Choice' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'file-upload', label: 'File Upload' }
];

const AssessmentBuilder = ({ assessment, onSave }: AssessmentBuilderProps) => {
  const [localAssessment, setLocalAssessment] = useState<Assessment>(assessment);

  const handleAddSection = () => {
    const newSection: AssessmentSection = {
      id: crypto.randomUUID(),
      title: `Section ${localAssessment.sections.length + 1}`,
      description: '',
      questions: [],
      order: localAssessment.sections.length
    };
    const updated = {
      ...localAssessment,
      sections: [...localAssessment.sections, newSection]
    };
    setLocalAssessment(updated);
    onSave(updated);
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    const updated = {
      ...localAssessment,
      sections: localAssessment.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      )
    };
    setLocalAssessment(updated);
    onSave(updated);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updated = {
      ...localAssessment,
      sections: localAssessment.sections.filter(s => s.id !== sectionId)
    };
    setLocalAssessment(updated);
    onSave(updated);
  };

  const handleAddQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: 'short-text',
      label: 'New Question',
      order: 0,
      validation: { required: false }
    };
    
    const updated = {
      ...localAssessment,
      sections: localAssessment.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, { ...newQuestion, order: s.questions.length }] }
          : s
      )
    };
    setLocalAssessment(updated);
    onSave(updated);
  };

  const handleUpdateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    const updated = {
      ...localAssessment,
      sections: localAssessment.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId ? { ...q, ...updates } : q
              )
            }
          : s
      )
    };
    setLocalAssessment(updated);
    onSave(updated);
  };

  const handleDeleteQuestion = (sectionId: string, questionId: string) => {
    const updated = {
      ...localAssessment,
      sections: localAssessment.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
          : s
      )
    };
    setLocalAssessment(updated);
    onSave(updated);
  };

  const handleAddOption = (sectionId: string, questionId: string) => {
    const section = localAssessment.sections.find(s => s.id === sectionId);
    const question = section?.questions.find(q => q.id === questionId);
    
    const newOption: QuestionOption = {
      id: crypto.randomUUID(),
      label: 'New Option',
      value: `option_${(question?.options?.length || 0) + 1}`
    };

    handleUpdateQuestion(sectionId, questionId, {
      options: [...(question?.options || []), newOption]
    });
  };

  const handleUpdateOption = (sectionId: string, questionId: string, optionId: string, updates: Partial<QuestionOption>) => {
    const section = localAssessment.sections.find(s => s.id === sectionId);
    const question = section?.questions.find(q => q.id === questionId);
    
    handleUpdateQuestion(sectionId, questionId, {
      options: question?.options?.map(o => o.id === optionId ? { ...o, ...updates } : o)
    });
  };

  const handleDeleteOption = (sectionId: string, questionId: string, optionId: string) => {
    const section = localAssessment.sections.find(s => s.id === sectionId);
    const question = section?.questions.find(q => q.id === questionId);
    
    handleUpdateQuestion(sectionId, questionId, {
      options: question?.options?.filter(o => o.id !== optionId)
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div>
        <input
          type="text"
          value={localAssessment.title}
          onChange={(e) => {
            const updated = { ...localAssessment, title: e.target.value };
            setLocalAssessment(updated);
            onSave(updated);
          }}
          className="text-2xl font-bold w-full border-none focus:outline-none focus:ring-0"
          placeholder="Assessment Title"
        />
        <textarea
          value={localAssessment.description || ''}
          onChange={(e) => {
            const updated = { ...localAssessment, description: e.target.value };
            setLocalAssessment(updated);
            onSave(updated);
          }}
          rows={2}
          className="text-gray-600 w-full mt-2 border-none focus:outline-none focus:ring-0 resize-none"
          placeholder="Assessment description..."
        />
      </div>

      {localAssessment.sections.map((section) => (
        <div key={section.id} className="border border-gray-300 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                className="text-xl font-semibold w-full border-none focus:outline-none focus:ring-0"
                placeholder="Section Title"
              />
              <input
                type="text"
                value={section.description || ''}
                onChange={(e) => handleUpdateSection(section.id, { description: e.target.value })}
                className="text-gray-600 w-full mt-1 border-none focus:outline-none focus:ring-0"
                placeholder="Section description"
              />
            </div>
            <button
              onClick={() => handleDeleteSection(section.id)}
              className="text-red-600 hover:text-red-800 ml-4"
            >
              Delete Section
            </button>
          </div>

          {section.questions.map((question) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded space-y-3">
              <div className="flex justify-between items-start">
                <input
                  type="text"
                  value={question.label}
                  onChange={(e) => handleUpdateQuestion(section.id, question.id, { label: e.target.value })}
                  className="flex-1 font-medium border-none bg-transparent focus:outline-none focus:ring-0"
                  placeholder="Question"
                />
                <button
                  onClick={() => handleDeleteQuestion(section.id, question.id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-4"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Type</label>
                  <select
                    value={question.type}
                    onChange={(e) => handleUpdateQuestion(section.id, question.id, { type: e.target.value as QuestionType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={question.validation?.required || false}
                      onChange={(e) => handleUpdateQuestion(section.id, question.id, {
                        validation: { ...question.validation, required: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    Required
                  </label>
                </div>
              </div>

              <input
                type="text"
                value={question.helpText || ''}
                onChange={(e) => handleUpdateQuestion(section.id, question.id, { helpText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Help text (optional)"
              />

              
              {question.type === 'numeric' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      value={question.validation?.min || ''}
                      onChange={(e) => handleUpdateQuestion(section.id, question.id, {
                        validation: { ...question.validation, min: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      value={question.validation?.max || ''}
                      onChange={(e) => handleUpdateQuestion(section.id, question.id, {
                        validation: { ...question.validation, max: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              )}

              
              {(question.type === 'single-choice' || question.type === 'multi-choice') && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">Options</label>
                  {question.options?.map((option) => (
                    <div key={option.id} className="flex gap-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => handleUpdateOption(section.id, question.id, option.id, { label: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Option label"
                      />
                      <button
                        onClick={() => handleDeleteOption(section.id, question.id, option.id)}
                        className="text-red-600 hover:text-red-800 text-sm px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddOption(section.id, question.id)}
                    className="text-sm text-black hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
              )}
              
              
              <div className="border-t pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditional Display (Show this question based on another answer)
                </label>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
                  {question.conditional ? (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Depends on Question</label>
                          <select
                            value={question.conditional.dependsOn}
                            onChange={(e) => handleUpdateQuestion(section.id, question.id, {
                              conditional: { ...question.conditional!, dependsOn: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select question...</option>
                            {section.questions
                              .filter(q => q.id !== question.id && q.order < question.order)
                              .map(q => (
                                <option key={q.id} value={q.id}>
                                  {q.label}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Condition</label>
                          <select
                            value={question.conditional.operator}
                            onChange={(e) => handleUpdateQuestion(section.id, question.id, {
                              conditional: { ...question.conditional!, operator: e.target.value as any }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="equals">Equals</option>
                            <option value="not-equals">Not Equals</option>
                            <option value="contains">Contains</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Value</label>
                          <input
                            type="text"
                            value={question.conditional.value}
                            onChange={(e) => handleUpdateQuestion(section.id, question.id, {
                              conditional: { ...question.conditional!, value: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Expected value"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-blue-700">
                        <span>✓ This question will only show if the condition is met</span>
                        <button
                          onClick={() => handleUpdateQuestion(section.id, question.id, { conditional: undefined })}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove Condition
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleUpdateQuestion(section.id, question.id, {
                        conditional: { dependsOn: '', operator: 'equals', value: '' }
                      })}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Conditional Logic
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(section.id)}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-black hover:text-black transition-colors"
          >
            + Add Question
          </button>
        </div>
      ))}

      <button
        onClick={handleAddSection}
        className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        + Add Section
      </button>
    </div>
  );
};

export default AssessmentBuilder;
