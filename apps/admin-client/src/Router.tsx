import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import protectedLoader from '@/auth/protectedLoader';
import RootLayout from '@/layout/RootLayout';
import { HOME, MODEL } from '@/common/routes';
import HomePage from '@/features/home/HomePage';
import ModelPage from './features/models/ModelPage';

const router = createBrowserRouter([
  {
    id: 'root',
    path: HOME,
    Component: RootLayout,
    children: [
      {
        index: true,
        path: HOME,
        loader: protectedLoader,
        element: <HomePage />,
      },
      {
        path: MODEL,
        loader: protectedLoader,
        element: <ModelPage />,
      },
    ],
  },
]);

function Router() {
  return (
    // Only creating router once this component is rendered, otherwise loaders
    // will kick off and start executing, which screws with our authentication
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

export default Router;
