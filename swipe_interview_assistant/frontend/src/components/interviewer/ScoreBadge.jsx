import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ScoreBadge = ({ score, size = 'md', showTrend = false, previousScore }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-700 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-lg font-bold';
      default:
        return 'px-3 py-1.5 text-sm font-semibold';
    }
  };

  const getTrend = () => {
    if (!previousScore || previousScore === score) return 'neutral';
    return score > previousScore ? 'up' : 'down';
  };

  const getTrendIcon = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-full border ${getScoreColor(score)} ${getSizeClasses(size)}`}>
        {score}
        <span className="text-xs opacity-75 ml-1">/100</span>
      </span>
      
      {/* Trend Indicator */}
      {showTrend && previousScore !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          {getTrend() !== 'neutral' && (
            <span>
              {Math.abs(score - previousScore)} points
            </span>
          )}
        </div>
      )}
      
      {/* Score Label (for larger sizes) */}
      {size === 'lg' && (
        <span className={`text-sm font-medium ml-2 ${getScoreColor(score).split(' ')[0]}`}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;