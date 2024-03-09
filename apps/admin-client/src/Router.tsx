import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import protectedLoader from '@/auth/protectedLoader';
import RootLayout from '@/layout/RootLayout';
import {
  FORGOT_PASSWORD,
  HOME,
  LOGIN,
  LOGOUT,
  MODEL,
  MODEL_RECORD,
  MODEL_RECORD_CREATE,
  MODEL_RECORD_EDIT,
  PASSWORD_RESET,
} from '@/common/routes';
import HomePage from '@/features/home/HomePage';
import ModelPage from '@/features/models/ModelPage';
import RecordShowPage from '@/features/models/RecordShowPage';
import RecordEditPage from './features/models/RecordEditPage';
import RecordCreatePage from './features/models/RecordCreatePage';
import loginAction from './auth/loginAction';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import Login from './auth/Login';
import Logout from './auth/Logout';
import PasswordResetPage from './auth/PasswordResetPage';
import loginLoader from './auth/loginLoader';

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
        element: <RecordShowPage />,
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
  {
    path: LOGIN,
    action: loginAction,
    loader: loginLoader,
    element: <Login />,
  },
  {
    path: LOGOUT,
    element: <Logout />,
  },
  {
    path: FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: PASSWORD_RESET,
    element: <PasswordResetPage />,
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
