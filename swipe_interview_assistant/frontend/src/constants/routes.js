// Application Routes Configuration
export const ROUTES = {
  // Main application routes
  ROOT: {
    path: '/',
    name: 'Home',
    component: 'App',
    exact: true,
    requiresAuth: false,
    showInNavigation: true,
    navigationLabel: 'Home',
    icon: '🏠'
  },

  // Interviewer Dashboard routes
  INTERVIEWER: {
    path: '/interviewer',
    name: 'Interviewer Dashboard',
    component: 'Dashboard',
    exact: true,
    requiresAuth: false,
    showInNavigation: true,
    navigationLabel: 'Dashboard',
    icon: '📊',
    
    // Nested routes for interviewer
    CHILDREN: {
      CANDIDATES: {
        path: '/interviewer/candidates',
        name: 'Candidates List',
        component: 'CandidateList',
        exact: true,
        requiresAuth: false,
        showInNavigation: true,
        navigationLabel: 'Candidates',
        icon: '👥'
      },
      CANDIDATE_DETAIL: {
        path: '/interviewer/candidate/:candidateId',
        name: 'Candidate Details',
        component: 'CandidateDetail',
        exact: true,
        requiresAuth: false,
        showInNavigation: false,
        dynamic: true
      },
      ANALYTICS: {
        path: '/interviewer/analytics',
        name: 'Analytics',
        component: 'Analytics',
        exact: true,
        requiresAuth: false,
        showInNavigation: true,
        navigationLabel: 'Analytics',
        icon: '📈'
      },
      SETTINGS: {
        path: '/interviewer/settings',
        name: 'Settings',
        component: 'Settings',
        exact: true,
        requiresAuth: false,
        showInNavigation: true,
        navigationLabel: 'Settings',
        icon: '⚙️'
      }
    }
  },

  // Interviewee routes
  INTERVIEWEE: {
    path: '/interviewee',
    name: 'Interviewee',
    component: 'IntervieweeFlow',
    exact: true,
    requiresAuth: false,
    showInNavigation: true,
    navigationLabel: 'Take Interview',
    icon: '🎤',
    
    // Interview flow steps
    STEPS: {
      RESUME_UPLOAD: {
        path: '/interviewee/upload',
        name: 'Resume Upload',
        component: 'ResumeUpload',
        step: 1,
        progress: 0,
        canSkip: false
      },
      MISSING_FIELDS: {
        path: '/interviewee/complete-info',
        name: 'Complete Information',
        component: 'MissingFieldsForm',
        step: 2,
        progress: 20,
        canSkip: false
      },
      INTERVIEW_READY: {
        path: '/interviewee/ready',
        name: 'Interview Ready',
        component: 'InterviewReady',
        step: 3,
        progress: 40,
        canSkip: false
      },
      INTERVIEW_IN_PROGRESS: {
        path: '/interviewee/interview',
        name: 'Interview in Progress',
        component: 'ChatInterface',
        step: 4,
        progress: 60,
        canSkip: false
      },
      INTERVIEW_COMPLETE: {
        path: '/interviewee/complete',
        name: 'Interview Complete',
        component: 'InterviewComplete',
        step: 5,
        progress: 100,
        canSkip: false
      }
    }
  },

  // Authentication routes (for future expansion)
  AUTH: {
    path: '/auth',
    name: 'Authentication',
    component: 'Auth',
    exact: false,
    requiresAuth: false,
    showInNavigation: false,
    
    CHILDREN: {
      LOGIN: {
        path: '/auth/login',
        name: 'Login',
        component: 'Login',
        exact: true,
        requiresAuth: false,
        showInNavigation: false
      },
      REGISTER: {
        path: '/auth/register',
        name: 'Register',
        component: 'Register',
        exact: true,
        requiresAuth: false,
        showInNavigation: false
      },
      FORGOT_PASSWORD: {
        path: '/auth/forgot-password',
        name: 'Forgot Password',
        component: 'ForgotPassword',
        exact: true,
        requiresAuth: false,
        showInNavigation: false
      }
    }
  },

  // Utility routes
  UTILITY: {
    NOT_FOUND: {
      path: '*',
      name: 'Not Found',
      component: 'NotFound',
      exact: false,
      requiresAuth: false,
      showInNavigation: false
    },
    ERROR: {
      path: '/error',
      name: 'Error',
      component: 'ErrorBoundary',
      exact: true,
      requiresAuth: false,
      showInNavigation: false
    },
    ABOUT: {
      path: '/about',
      name: 'About',
      component: 'About',
      exact: true,
      requiresAuth: false,
      showInNavigation: true,
      navigationLabel: 'About',
      icon: 'ℹ️'
    },
    HELP: {
      path: '/help',
      name: 'Help',
      component: 'Help',
      exact: true,
      requiresAuth: false,
      showInNavigation: true,
      navigationLabel: 'Help',
      icon: '❓'
    }
  }
};

// Route helper functions
export const getRoute = (routeKey, params = {}) => {
  const keys = routeKey.split('.');
  let route = ROUTES;
  
  for (const key of keys) {
    route = route[key];
    if (!route) return '/';
  }
  
  let path = route.path;
  
  // Replace dynamic parameters in path
  if (route.dynamic && params) {
    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key]);
    });
  }
  
  return path;
};

export const getRouteConfig = (routeKey) => {
  const keys = routeKey.split('.');
  let route = ROUTES;
  
  for (const key of keys) {
    route = route[key];
    if (!route) return null;
  }
  
  return route;
};

export const getNavigationRoutes = () => {
  const navRoutes = [];
  
  // Main routes
  Object.values(ROUTES).forEach(route => {
    if (route.showInNavigation && !route.CHILDREN) {
      navRoutes.push({
        path: route.path,
        name: route.name,
        navigationLabel: route.navigationLabel,
        icon: route.icon,
        exact: route.exact
      });
    }
    
    // Child routes
    if (route.CHILDREN) {
      Object.values(route.CHILDREN).forEach(childRoute => {
        if (childRoute.showInNavigation) {
          navRoutes.push({
            path: childRoute.path,
            name: childRoute.name,
            navigationLabel: childRoute.navigationLabel,
            icon: childRoute.icon,
            exact: childRoute.exact,
            parent: route.name
          });
        }
      });
    }
  });
  
  return navRoutes;
};

export const getInterviewFlowSteps = () => {
  return Object.values(ROUTES.INTERVIEWEE.STEPS).map(step => ({
    ...step,
    path: `${ROUTES.INTERVIEWEE.path}${step.path}`
  }));
};

export const getCurrentStep = (pathname) => {
  const steps = getInterviewFlowSteps();
  return steps.find(step => pathname.includes(step.path)) || steps[0];
};

export const getNextStep = (currentPath) => {
  const steps = getInterviewFlowSteps();
  const currentIndex = steps.findIndex(step => currentPath.includes(step.path));
  
  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }
  
  return steps[currentIndex + 1];
};

export const getPreviousStep = (currentPath) => {
  const steps = getInterviewFlowSteps();
  const currentIndex = steps.findIndex(step => currentPath.includes(step.path));
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return steps[currentIndex - 1];
};

export const isInterviewFlowRoute = (pathname) => {
  return pathname.startsWith(ROUTES.INTERVIEWEE.path);
};

export const isInterviewerRoute = (pathname) => {
  return pathname.startsWith(ROUTES.INTERVIEWER.path);
};

export const getBreadcrumbPaths = (pathname) => {
  const breadcrumbs = [];
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    
    // Find route matching current path
    const route = findRouteByPath(currentPath);
    if (route) {
      breadcrumbs.push({
        path: currentPath,
        name: route.name,
        navigationLabel: route.navigationLabel
      });
    }
  });
  
  return breadcrumbs;
};

export const findRouteByPath = (path) => {
  // Flatten all routes for searching
  const allRoutes = flattenRoutes(ROUTES);
  return allRoutes.find(route => route.path === path);
};

export const flattenRoutes = (routes, parentPath = '') => {
  let flatRoutes = [];
  
  Object.values(routes).forEach(route => {
    if (typeof route === 'object' && route.path) {
      const fullPath = parentPath + route.path;
      flatRoutes.push({ ...route, path: fullPath });
      
      // Recursively flatten children
      if (route.CHILDREN) {
        flatRoutes = [...flatRoutes, ...flattenRoutes(route.CHILDREN, fullPath)];
      }
    }
  });
  
  return flatRoutes;
};

export const getRouteProgress = (pathname) => {
  if (isInterviewFlowRoute(pathname)) {
    const currentStep = getCurrentStep(pathname);
    return currentStep ? currentStep.progress : 0;
  }
  
  return 0;
};

export const canAccessRoute = (route, user = null) => {
  if (!route.requiresAuth) return true;
  return user !== null;
};

export const getDefaultRoute = (user = null) => {
  // For now, always return root since we don't have auth
  return ROUTES.ROOT.path;
};

// Route transitions and animations
export const ROUTE_TRANSITIONS = {
  DURATION: 300,
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  ENTER: 'fadeIn',
  EXIT: 'fadeOut'
};

// Route permissions (for future auth implementation)
export const ROUTE_PERMISSIONS = {
  PUBLIC: 'public',
  INTERVIEWER: 'interviewer',
  INTERVIEWEE: 'interviewee',
  ADMIN: 'admin'
};

// Route metadata for SEO and analytics
export const ROUTE_METADATA = {
  [ROUTES.ROOT.path]: {
    title: 'Crisp Interview Assistant - AI-Powered Technical Interviews',
    description: 'Conduct and take technical interviews with AI-powered evaluation and real-time feedback.',
    keywords: ['interview', 'technical', 'AI', 'evaluation', 'hiring']
  },
  [ROUTES.INTERVIEWER.path]: {
    title: 'Interviewer Dashboard - Crisp Interview Assistant',
    description: 'Manage candidates, review interviews, and analyze performance metrics.',
    keywords: ['dashboard', 'candidates', 'analytics', 'interviewer']
  },
  [ROUTES.INTERVIEWEE.path]: {
    title: 'Take Interview - Crisp Interview Assistant',
    description: 'Start your technical interview with AI-powered questions and real-time evaluation.',
    keywords: ['interview', 'technical', 'questions', 'evaluation']
  },
  [ROUTES.UTILITY.ABOUT.path]: {
    title: 'About - Crisp Interview Assistant',
    description: 'Learn about our AI-powered interview platform and how it helps in technical hiring.',
    keywords: ['about', 'platform', 'features', 'technology']
  }
};

export const getRouteMetadata = (pathname) => {
  const exactMatch = ROUTE_METADATA[pathname];
  if (exactMatch) return exactMatch;
  
  // Find closest match for nested routes
  const matchingPaths = Object.keys(ROUTE_METADATA)
    .filter(path => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length);
  
  return ROUTE_METADATA[matchingPaths[0]] || {
    title: 'Crisp Interview Assistant',
    description: 'AI-Powered Technical Interview Platform',
    keywords: ['interview', 'technical', 'AI']
  };
};

// Export commonly used routes for easy access
export const HOME_ROUTE = ROUTES.ROOT;
export const DASHBOARD_ROUTE = ROUTES.INTERVIEWER;
export const INTERVIEW_ROUTE = ROUTES.INTERVIEWEE;
export const CANDIDATES_ROUTE = ROUTES.INTERVIEWER.CHILDREN.CANDIDATES;
export const ANALYTICS_ROUTE = ROUTES.INTERVIEWER.CHILDREN.ANALYTICS;

export default ROUTES;