import { useState, useEffect } from 'react';
import type { Job } from '../../types';

interface DeleteJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobId: string) => void;
}

const DeleteJobModal = ({ job, isOpen, onClose, onConfirm }: DeleteJobModalProps) => {
  const [deleteText, setDeleteText] = useState('');
  const [error, setError] = useState('');
  const [randomNumber, setRandomNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      const number = Math.floor(Math.random() * 900000) + 100000;
      setRandomNumber(number.toString());
      setDeleteText('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const handleConfirm = () => {
    if (deleteText !== randomNumber) {
      setError(`Please type the number ${randomNumber} to confirm`);
      return;
    }
    onConfirm(job.id);
    handleClose();
  };

  const handleClose = () => {
    setDeleteText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent">
          Delete Job
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the job:
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            "{job.title}"
          </p>
          <p className="text-red-600 text-sm mb-4">
            This action cannot be undone. All associated data will be removed.
          </p>
        </div>

        <div className="mb-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">To confirm deletion, type this number:</p>
            <p className="text-3xl font-bold text-red-600 text-center font-mono tracking-widest">
              {randomNumber}
            </p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter the number above:
          </label>
          <input
            type="text"
            value={deleteText}
            onChange={(e) => {
              setDeleteText(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
            placeholder="0000"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleteText !== randomNumber}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobModal;
