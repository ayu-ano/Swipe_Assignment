import React from 'react';

const EmptyState = ({ 
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  variant = 'default'
}) => {
  const sizes = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24'
  };

  const variants = {
    default: {
      icon: 'text-gray-400',
      title: 'text-gray-900 dark:text-white',
      description: 'text-gray-500 dark:text-gray-400'
    },
    subtle: {
      icon: 'text-gray-300 dark:text-gray-600',
      title: 'text-gray-600 dark:text-gray-300',
      description: 'text-gray-500 dark:text-gray-500'
    }
  };

  const currentVariant = variants[variant];

  const defaultIcons = {
    candidate: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    interview: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    resume: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    search: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    error: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const displayIcon = icon && defaultIcons[icon] ? defaultIcons[icon] : icon;

  return (
    <div className={`text-center ${sizes[size]}`}>
      {/* Icon */}
      {displayIcon && (
        <div className={`mx-auto mb-4 ${currentVariant.icon}`}>
          {displayIcon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className={`text-lg font-medium mb-2 ${currentVariant.title}`}>
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className={`max-w-sm mx-auto mb-6 ${currentVariant.description}`}>
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {action && (
          <div>
            {action}
          </div>
        )}
        {secondaryAction && (
          <div>
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
};

// Pre-built empty states for common scenarios
export const EmptyStates = {
  NoCandidates: (props) => (
    <EmptyState
      icon="candidate"
      title="No candidates yet"
      description="Get started by adding your first candidate to the system."
      {...props}
    />
  ),
  
  NoInterviews: (props) => (
    <EmptyState
      icon="interview"
      title="No interviews scheduled"
      description="Schedule an interview to start evaluating candidates."
      {...props}
    />
  ),
  
  NoResume: (props) => (
    <EmptyState
      icon="resume"
      title="No resume uploaded"
      description="Upload a resume to generate personalized interview questions."
      {...props}
    />
  ),
  
  NoResults: (props) => (
    <EmptyState
      icon="search"
      title="No results found"
      description="Try adjusting your search criteria or filters."
      {...props}
    />
  ),
  
  Error: (props) => (
    <EmptyState
      icon="error"
      title="Unable to load data"
      description="There was a problem loading the requested information."
      {...props}
    />
  )
};

export default EmptyState;