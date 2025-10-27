import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
  index: number;
  onEdit: (job: Job) => void;
  onToggleStatus: (job: Job) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onClick: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const JobCard = ({ job, index, onEdit, onToggleStatus, onReorder, onClick, onDelete }: JobCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'JOB',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'JOB',
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      
      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-move relative ${
        isDragging ? 'opacity-50' : ''
      } hover:border-gray-800`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
        
        <span
          className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full ${
            job.status === 'active'
              ? 'bg-gray-500 text-gray-700'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {job.status}
        </span>

        <div className="flex justify-between items-start">
          <div className="flex-1 pr-20" onClick={(e) => { e.stopPropagation(); onClick(job); }}>
            
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent hover:opacity-80 cursor-pointer">
                {job.title}
              </h3>
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag}
                </span>
            ))}
          </div>
          
          
          {job.company && (
            <p className="text-xs text-gray-500 mb-2">
               {job.company}
            </p>
          )}
          
          <p className="text-gray-600">{job.description}</p>
        </div>

        <div className="flex gap-2 ml-4 mt-8">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(job); }}
            className="px-4 py-2 text-sm text-maroon-700 border border-maroon-300 rounded hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus(job); }}
            className={`px-4 py-2 text-sm rounded ${
              job.status === 'active'
                ? 'text-brown-700 border border-brown-300 hover:bg-brown-50'
                : 'text-white bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {job.status === 'active' ? 'Archive' : 'Unarchive'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(job); }}
            className="px-4 py-2 text-sm text-red-700 border border-red-300 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
