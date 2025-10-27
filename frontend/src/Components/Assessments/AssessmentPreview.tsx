import { useState } from 'react';
import type { Assessment, AssessmentResponse } from '../../types';

interface AssessmentPreviewProps {
  assessment: Assessment;
  onSubmit?: (response: AssessmentResponse) => void;
}

const AssessmentPreview = ({ assessment, onSubmit }: AssessmentPreviewProps) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    assessment.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.conditional) {
          const dependsOnValue = answers[question.conditional.dependsOn];
          if (question.conditional.operator === 'equals' && dependsOnValue !== question.conditional.value) {
            return; 
          }
        }

        if (question.validation?.required) {
          const answer = answers[question.id];
          if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === '') {
            newErrors[question.id] = 'This field is required';
          }
        }
        if (question.type === 'numeric' && answers[question.id] !== undefined && answers[question.id] !== '') {
          const numValue = parseFloat(answers[question.id]);
          if (question.validation?.min !== undefined && numValue < question.validation.min) {
            newErrors[question.id] = `Value must be at least ${question.validation.min}`;
          }
          if (question.validation?.max !== undefined && numValue > question.validation.max) {
            newErrors[question.id] = `Value must be at most ${question.validation.max}`;
          }
        }
        if ((question.type === 'short-text' || question.type === 'long-text') && answers[question.id]) {
          const textValue = String(answers[question.id]);
          if (question.validation?.maxLength && textValue.length > question.validation.maxLength) {
            newErrors[question.id] = `Maximum ${question.validation.maxLength} characters`;
          }
          if (question.validation?.minLength && textValue.length < question.validation.minLength) {
            newErrors[question.id] = `Minimum ${question.validation.minLength} characters`;
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      const response: AssessmentResponse = {
        assessmentId: assessment.id,
        candidateId: 'preview-candidate',
        answers,
        submittedAt: new Date()
      };
      onSubmit(response);
    }
  };

  const shouldShowQuestion = (question: any): boolean => {
    if (!question.conditional) return true;
    
    const dependsOnValue = answers[question.conditional.dependsOn];
    if (question.conditional.operator === 'equals') {
      return dependsOnValue === question.conditional.value;
    }
    if (question.conditional.operator === 'not-equals') {
      return dependsOnValue !== question.conditional.value;
    }
    return true;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mb-2">{assessment.title}</h2>
      {assessment.description && (
        <p className="text-gray-600 mb-6">{assessment.description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {assessment.sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mb-2">{section.title}</h3>
            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}

            <div className="space-y-6">
              {section.questions.filter(shouldShowQuestion).map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="block">
                    <span className="font-medium text-gray-800">
                      {question.label}
                      {question.validation?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </span>
                    {question.helpText && (
                      <span className="block text-sm text-gray-500 mt-1">{question.helpText}</span>
                    )}
                  </label>
                  {question.type === 'short-text' && (
                    <input
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors[question.id] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your answer..."
                    />
                  )}
                  {question.type === 'long-text' && (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors[question.id] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your answer..."
                    />
                  )}
                  {question.type === 'numeric' && (
                    <input
                      type="number"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      min={question.validation?.min}
                      max={question.validation?.max}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors[question.id] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter a number..."
                    />
                  )}
                  {question.type === 'single-choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <label key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={(e) => handleChange(question.id, e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {question.type === 'multi-choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <label key={option.id} className="flex items-center">
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={(answers[question.id] || []).includes(option.value)}
                            onChange={(e) => {
                              const current = answers[question.id] || [];
                              const newValue = e.target.checked
                                ? [...current, option.value]
                                : current.filter((v: string) => v !== option.value);
                              handleChange(question.id, newValue);
                            }}
                            className="mr-2"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {question.type === 'file-upload' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        onChange={(e) => handleChange(question.id, e.target.files?.[0]?.name || '')}
                        className="hidden"
                        id={`file-${question.id}`}
                      />
                      <label
                        htmlFor={`file-${question.id}`}
                        className="cursor-pointer text-gray-600 hover:text-black"
                      >
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2">Click to upload a file</p>
                        {answers[question.id] && (
                          <p className="text-sm text-gray-600 mt-2">Selected: {answers[question.id]}</p>
                        )}
                      </label>
                    </div>
                  )}

                  {errors[question.id] && (
                    <p className="text-red-500 text-sm">{errors[question.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {onSubmit && (
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Submit Assessment
          </button>
        )}
      </form>
    </div>
  );
};

export default AssessmentPreview;
