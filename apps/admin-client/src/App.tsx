import { useState, useEffect } from 'react';
import Router from './Router';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './auth/AuthProvider';

const queryClient = new QueryClient();

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    AuthProvider.loadFromStorage().then(() => {
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
      <ToastContainer
        autoClose={5000}
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
}

export default App;
