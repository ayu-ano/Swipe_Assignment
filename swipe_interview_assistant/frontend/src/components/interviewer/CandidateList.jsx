import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import CandidateListItem from './CandidateListItem';
import SearchSort from './SearchSort';
import EmptyState from '../Common/EmptyState';

const CandidateList = () => {
  const navigate = useNavigate();
  const { candidates } = useSelector(state => state.candidates);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'top' && candidate.score >= 80) ||
        (statusFilter === 'good' && candidate.score >= 60 && candidate.score < 80) ||
        (statusFilter === 'average' && candidate.score < 60);
      
      return matchesSearch && matchesStatus;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.interviewDate);
          bValue = new Date(b.interviewDate);
          break;
        case 'score':
        default:
          aValue = a.score;
          bValue = b.score;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [candidates, searchTerm, sortBy, sortOrder, statusFilter]);

  const handleCandidateClick = (candidateId) => {
    navigate(`candidate/${candidateId}`);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  if (candidates.length === 0) {
    return (
      <EmptyState 
        title="No interviews conducted yet"
        description="When candidates complete their technical interviews, their results will appear here."
        icon="📊"
        actionLabel="View Sample Data"
        onAction={() => console.log('Load sample data')}
      />
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Candidates ({filteredCandidates.length})
          </h2>
          
          <SearchSort
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSort}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
        <div className="col-span-4 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('name')}>
          Candidate {getSortIcon('name')}
        </div>
        <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('score')}>
          Score {getSortIcon('score')}
        </div>
        <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('date')}>
          Interview Date {getSortIcon('date')}
        </div>
        <div className="col-span-2 text-center">Status</div>
      </div>

      {/* Candidate List */}
      <div className="divide-y divide-gray-200">
        {filteredCandidates.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          filteredCandidates.map(candidate => (
            <CandidateListItem
              key={candidate.id}
              candidate={candidate}
              onClick={() => handleCandidateClick(candidate.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </span>
          <div className="flex items-center gap-4">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Export Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;