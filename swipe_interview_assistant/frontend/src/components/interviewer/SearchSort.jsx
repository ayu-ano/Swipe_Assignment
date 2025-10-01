import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchSort = ({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  const sortOptions = [
    { value: 'score', label: 'Score' },
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Candidates' },
    { value: 'top', label: 'Top Performers (80+)' },
    { value: 'good', label: 'Good Fit (60-79)' },
    { value: 'average', label: 'Needs Review (<60)' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search candidates..."
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} {sortBy === option.value ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </option>
          ))}
        </select>
        
        {/* Sort Order Toggle */}
        <button
          onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
        >
          <span className="text-sm text-gray-600">
            {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
          </span>
        </button>
      </div>

      {/* Active Filters Badge */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
              {statusOptions.find(opt => opt.value === statusFilter)?.label}
              <button
                onClick={() => onStatusFilterChange('all')}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSort;