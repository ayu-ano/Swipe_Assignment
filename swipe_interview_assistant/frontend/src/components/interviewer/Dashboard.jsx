import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, BarChart3, TrendingUp, Clock, Award, Target } from 'lucide-react';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import EmptyState from '../common/EmptyState';

const Dashboard = () => {
  const { candidates } = useSelector(state => state.candidates);

  // Calculate dashboard statistics
  const stats = React.useMemo(() => {
    const totalCandidates = candidates.length;
    const averageScore = totalCandidates > 0 
      ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.score, 0) / totalCandidates)
      : 0;
    
    const topPerformers = candidates.filter(candidate => candidate.score >= 80).length;
    const goodCandidates = candidates.filter(candidate => candidate.score >= 60 && candidate.score < 80).length;
    
    const recentInterviews = candidates.filter(candidate => {
      const interviewDate = new Date(candidate.interviewDate);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return interviewDate > sevenDaysAgo;
    }).length;

    return {
      totalCandidates,
      averageScore,
      topPerformers,
      goodCandidates,
      recentInterviews
    };
  }, [candidates]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} ml-4`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Dashboard Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Interview Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Monitor candidate performance and manage technical interviews in real-time
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Total Candidates"
              value={stats.totalCandidates}
              subtitle="All interviews"
              color="bg-blue-500"
              trend={12}
            />
            
            <StatCard
              icon={BarChart3}
              title="Average Score"
              value={stats.averageScore}
              subtitle="out of 100"
              color="bg-green-500"
              trend={5}
            />
            
            <StatCard
              icon={Award}
              title="Top Performers"
              value={stats.topPerformers}
              subtitle="80+ score"
              color="bg-purple-500"
              trend={8}
            />
            
            <StatCard
              icon={Clock}
              title="This Week"
              value={stats.recentInterviews}
              subtitle="Last 7 days"
              color="bg-orange-500"
              trend={15}
            />
          </div>

          {/* Performance Distribution */}
          {candidates.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.topPerformers}</div>
                  <div className="text-sm text-gray-600">Excellent (80-100)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.goodCandidates}</div>
                  <div className="text-sm text-gray-600">Good (60-79)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {candidates.length - stats.topPerformers - stats.goodCandidates}
                  </div>
                  <div className="text-sm text-gray-600">Needs Improvement</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {candidates.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EmptyState 
              title="No interviews conducted yet"
              description="Candidate interviews and their results will appear here once they complete their technical assessments."
              icon="📊"
              actionLabel="View Sample Data"
              onAction={() => console.log('Add demo data')}
            />
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden">
            <Routes>
              <Route index element={<CandidateList />} />
              <Route path="candidate/:candidateId" element={<CandidateDetail />} />
            </Routes>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;