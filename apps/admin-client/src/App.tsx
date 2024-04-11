import { useState, useEffect } from 'react';
import Router from './Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadFromStorage } from '@repo/auth';
import { Toaster } from '@/components/toast/toaster';

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
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
