import { useEffect, useState } from 'react';
import Router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadFromStorage } from '@repo/auth';
import { Toaster } from '@/components/toast/toaster';
import { useLocation } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    loadFromStorage().then(() => {
      console.log('app is fully loaded');
      setAppLoaded(true);
    });
  }, []);

  if (!appLoaded) {
    return null;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <Router />
        <Toaster />
      </QueryClientProvider>
    </>
  );
}

export default App;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
