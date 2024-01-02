import { createBrowserRouter, RouterProvider } from "react-router-dom";
import protectedLoader from "@/auth/protectedLoader";
import RootLayout from "@/layout/RootLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import { HOME } from "@/common/routes";

const router = createBrowserRouter([
  {
    id: "root",
    path: HOME,
    Component: RootLayout,
    children: [
      {
        index: true,
        path: HOME,
        loader: protectedLoader,
        element: <Dashboard />,
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
