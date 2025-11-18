
import React, { useState, useCallback, useMemo } from 'react';
import LandingPage from './pages/LandingPage';
import MainAppPage from './pages/MainAppPage';
// FIX: Import User type to be used in AppContextType
import { Page, User } from './types';

export interface AppContextType {
  navigateTo: (page: Page) => void;
  // FIX: Add login method to context type to resolve error in AuthPage.tsx
  login: (user: User) => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  // FIX: Add a placeholder login function to provide in the context.
  const login = useCallback((user: User) => {
    console.log('Login action (placeholder) for user:', user);
    setCurrentPage(Page.MainApp);
  }, []);

  // FIX: Provide login function in context value
  const appContextValue = useMemo(() => ({
    navigateTo,
    login,
  }), [navigateTo, login]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Landing:
        return <LandingPage />;
      case Page.MainApp:
        return <MainAppPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="min-h-screen antialiased">
        {renderPage()}
      </div>
    </AppContext.Provider>
  );
};

export default App;
