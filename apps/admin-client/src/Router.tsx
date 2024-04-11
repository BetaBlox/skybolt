import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import protectedLoader from '@/auth/protected-loader';
import RootLayout from '@/layout/root-layout';
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
import HomePage from '@/features/home/home-page';
import ModelPage from '@/features/models/model-page';
import RecordShowPage from '@/features/records/record-show-page';
import ErrorPage from '@/error-page';
import ForgotPasswordPage from '@/auth/forgot-password-page';
import loginAction from '@/auth/login-action';
import loginLoader from '@/auth/login-loader';
import Login from '@/auth/login-page';
import Logout from '@/auth/logout-page';
import PasswordResetPage from '@/auth/password-reset-page';
import RecordCreatePage from '@/features/records/record-create-page';
import RecordEditPage from '@/features/records/record-edit-page';

const router = createBrowserRouter([
  {
    id: 'root',
    path: HOME,
    errorElement: <ErrorPage />,
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
