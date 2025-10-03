import React from 'react';

const Tabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const variants = {
    default: 'border-b border-gray-200 dark:border-gray-700',
    pills: 'bg-gray-100 dark:bg-gray-800 rounded-2xl p-1',
    underlined: 'border-b border-gray-200 dark:border-gray-700',
    cards: 'gap-2'
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const tabSizes = {
    sm: 'px-3 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  };

  const getTabStyles = (tab, isActive) => {
    const baseStyles = `
      font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${sizes[size]} ${tabSizes[size]}
      ${fullWidth ? 'flex-1 text-center' : ''}
      ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105'}
    `;

    switch (variant) {
      case 'pills':
        return `
          ${baseStyles} rounded-xl
          ${isActive
            ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md border border-gray-200 dark:border-gray-700'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
          }
        `;
      
      case 'underlined':
        return `
          ${baseStyles} border-b-2 -mb-px
          ${isActive
            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `;
      
      case 'cards':
        return `
          ${baseStyles} rounded-2xl border-2 transition-all duration-300
          ${isActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
            : 'border-transparent bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
          }
        `;
      
      default:
        return `
          ${baseStyles} border-b-2 -mb-px
          ${isActive
            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `;
    }
  };

  return (
    <div className={`${className}`}>
      <div className={`flex ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              className={getTabStyles(tab, isActive)}
              disabled={tab.disabled}
            >
              <div className="flex items-center justify-center gap-3">
                {tab.icon && (
                  <span className={`transition-colors duration-200 ${
                    isActive ? 'text-current' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {tab.icon}
                  </span>
                )}
                
                <span className="whitespace-nowrap">{tab.label}</span>
                
                {tab.badge && (
                  <span className={`
                    inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 min-w-[2rem]
                    ${isActive 
                      ? variant === 'pills' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {tab.badge}
                  </span>
                )}
                
                {tab.status && (
                  <span className={`
                    w-2 h-2 rounded-full
                    ${tab.status === 'active' ? 'bg-green-500' :
                      tab.status === 'inactive' ? 'bg-gray-400' :
                      tab.status === 'warning' ? 'bg-orange-500' :
                      'bg-red-500'
                    }
                  `} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;