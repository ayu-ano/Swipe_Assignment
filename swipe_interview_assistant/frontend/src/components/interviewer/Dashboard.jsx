import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, BarChart3, TrendingUp, Clock } from 'lucide-react';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import EmptyState from '../Common/EmptyState';

const Dashboard = () => {
  const { candidates } = useSelector(state => state.candidates);

  // Calculate dashboard statistics
  const stats = React.useMemo(() => {
    const totalCandidates = candidates.length;
    const averageScore = totalCandidates > 0 
      ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.score, 0) / totalCandidates)
      : 0;
    
    const topPerformers = candidates
      .filter(candidate => candidate.score >= 80)
      .length;
    
    const recentInterviews = candidates
      .filter(candidate => {
        const interviewDate = new Date(candidate.interviewDate);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return interviewDate > sevenDaysAgo;
      })
      .length;

    return {
      totalCandidates,
      averageScore,
      topPerformers,
      recentInterviews
    };
  }, [candidates]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interview Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Manage and review candidate interviews
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Candidates */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Candidates
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalCandidates}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Average Score
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.averageScore}
                            <span className="text-sm text-gray-500 ml-1">/100</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Top Performers
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.topPerformers}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Interviews */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Last 7 Days
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.recentInterviews}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {candidates.length === 0 ? (
            <EmptyState 
              title="No candidates yet"
              description="Candidate interviews will appear here once they complete their technical assessment."
              icon="👥"
              actionLabel="View Demo Data"
              onAction={() => console.log('Add demo data')}
            />
          ) : (
            <Routes>
              <Route index element={<CandidateList />} />
              <Route path="candidate/:candidateId" element={<CandidateDetail />} />
            </Routes>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;