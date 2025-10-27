import type { JobFilters } from '../../types';

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

const JobFiltersComponent = ({ filters, onFiltersChange }: JobFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-3 w-full md:w-auto">
      
      <div className="flex-1 md:flex-none">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search..."
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full"
        />
      </div>

      
      <div className="flex-1 md:flex-none">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      
      <div className="flex-1 md:flex-none">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          placeholder="Tags..."
          onChange={(e) => {
            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
            onFiltersChange({ ...filters, tags: tags.length > 0 ? tags : undefined });
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full"
        />
      </div>
    </div>
  );
};

export default JobFiltersComponent;
