import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  text = '',
  overlay = false,
  fullScreen = false 
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="text-center">
          {spinner}
          {text && (
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
        <div className="text-center">
          {spinner}
          {text && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex items-center justify-center space-x-3">
        {spinner}
        <span className="text-gray-600 dark:text-gray-400">{text}</span>
      </div>
    );
  }

  return spinner;
};

// Skeleton Loader Component
export const SkeletonLoader = ({ 
  type = 'text',
  lines = 3,
  className = '' 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  if (type === 'card') {
    return (
      <div className={`p-4 space-y-3 ${className}`}>
        <div className={`h-4 ${baseClasses} w-3/4`} />
        <div className={`h-4 ${baseClasses} w-1/2`} />
        <div className={`h-4 ${baseClasses} w-5/6`} />
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className={`${baseClasses} rounded-full w-12 h-12 ${className}`} />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 ${baseClasses} ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;