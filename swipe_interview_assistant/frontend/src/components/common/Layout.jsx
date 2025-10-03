import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setScreenSize } from '../../store/slices/uiSlice';

const Layout = ({ 
  children, 
  sidebar = null, 
  header = null,
  mobileBreakpoint = 768 
}) => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, isMobile } = useSelector(state => state.ui.responsive);
  
  // Handle responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < mobileBreakpoint;
      
      dispatch(setScreenSize({
        isMobile: mobile,
        isTablet: width >= mobileBreakpoint && width < 1024,
        isDesktop: width >= 1024,
        screenSize: mobile ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
      }));

      // Auto-collapse sidebar on mobile
      if (mobile && !sidebarCollapsed) {
        dispatch(toggleSidebar());
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, mobileBreakpoint, sidebarCollapsed]);

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
  const mainMargin = sidebar && !isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : '';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {sidebar && !isMobile && (
        <aside className={`
          ${sidebarWidth} 
          fixed left-0 top-0 h-full 
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          z-30
          flex flex-col
        `}>
          {sidebar}
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebar && isMobile && sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebar && isMobile && (
        <aside className={`
          fixed left-0 top-0 h-full 
          w-64
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          z-50
          ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `}>
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${mainMargin}`}>
        {/* Header */}
        {header && (
          <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            {header}
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Header Component
export const Header = ({ title, actions, breadcrumbs = [] }) => {
  const dispatch = useDispatch();
  const { isMobile } = useSelector(state => state.ui.responsive);

  return (
    <div className="flex items-center justify-between p-4 md:px-6 md:py-4">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label}>
                  {index > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                  <span className={`
                    ${index === breadcrumbs.length - 1 
                      ? 'text-gray-900 dark:text-white font-medium' 
                      : 'hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer'
                    }
                  `}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Layout;