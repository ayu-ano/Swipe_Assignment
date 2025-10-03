import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, SortDesc, Download, Calendar, Award } from 'lucide-react';
import CandidateListItem from './CandidateListItem';
import SearchSort from './SearchSort';
import EmptyState from '../common/EmptyState';

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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmptyState 
          title="No interviews conducted yet"
          description="When candidates complete their technical interviews, their results will appear here."
          icon="📊"
          actionLabel="View Sample Data"
          onAction={() => console.log('Load sample data')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Dashboard</h1>
              <p className="text-lg text-gray-600">
                Review and manage all interview candidates in one place
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Download size={18} />
                Export Results
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{candidates.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {candidates.filter(c => c.score >= 80).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {candidates.filter(c => {
                    const interviewDate = new Date(c.interviewDate);
                    const now = new Date();
                    return interviewDate.getMonth() === now.getMonth() && 
                           interviewDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Search */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  All Candidates ({filteredCandidates.length})
                </h2>
                <p className="text-gray-600 mt-1">
                  Filter and sort candidates to find the best fit
                </p>
              </div>
              
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

          {/* Table Header - Desktop */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <div className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('name')}>
              Candidate {getSortIcon('name')}
            </div>
            <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('score')}>
              Score {getSortIcon('score')}
            </div>
            <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('date')}>
              Interview Date {getSortIcon('date')}
            </div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* Candidate List */}
          <div className="divide-y divide-gray-200">
            {filteredCandidates.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find what you're looking for.
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <span>
                Showing <span className="font-semibold">{filteredCandidates.length}</span> of{' '}
                <span className="font-semibold">{candidates.length}</span> candidates
              </span>
              <div className="flex items-center gap-4">
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;