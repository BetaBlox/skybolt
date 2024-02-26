import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import HomePage from "@/features/home/HomePage";
import Login from "@/auth/Login";
import loginAction from "@/auth/loginAction";
import loginLoader from "@/auth/loginLoader";
import protectedLoader from "@/auth/protectedLoader";
import Logout from "@/auth/Logout";
import {
  HOME,
  LOGIN,
  LOGOUT,
  PROFILE,
} from "@/common/routes";
import SidebarLayout from "@/layouts/SidebarLayout";
import UserProfilePage from "./features/user-profile/UserProfilePage";

const router = createBrowserRouter([
  {
    id: "root",
    path: HOME,
    errorElement: <ErrorPage />,
    Component: SidebarLayout,
    children: [
      {
        index: true,
        path: HOME,
        loader: protectedLoader,
        element: <HomePage />,
      },
      {
        path: PROFILE,
        loader: protectedLoader,
        element: <UserProfilePage />,
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
]);

function Router() {
  return (
    // Only creating router once this component is rendered, otherwise loaders
    // will kick off and start executing, which screws with our authentication
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

export default Router;
