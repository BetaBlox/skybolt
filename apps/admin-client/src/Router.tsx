import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import protectedLoader from '@/auth/protectedLoader';
import RootLayout from '@/layout/RootLayout';
import {
  HOME,
  MODEL,
  MODEL_RECORD,
  MODEL_RECORD_CREATE,
  MODEL_RECORD_EDIT,
} from '@/common/routes';
import HomePage from '@/features/home/HomePage';
import ModelPage from '@/features/models/ModelPage';
import RecordPage from '@/features/models/RecordPage';
import RecordEditPage from './features/models/RecordEditPage';
import RecordCreatePage from './features/models/RecordCreatePage';

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
      {
        path: MODEL_RECORD,
        loader: protectedLoader,
        element: <RecordPage />,
      },
      {
        path: MODEL_RECORD_CREATE,
        loader: protectedLoader,
        element: <RecordCreatePage />,
      },
      {
        path: MODEL_RECORD_EDIT,
        loader: protectedLoader,
        element: <RecordEditPage />,
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
