import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="mx-auto min-h-screen w-screen max-w-7xl p-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Admin
        </h1>
        <div className="py-4">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}