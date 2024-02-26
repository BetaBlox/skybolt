import { LoaderFunctionArgs, redirect } from "react-router-dom";
import AuthProvider from "./AuthProvider";

export default async function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  const isAuthenticated = await AuthProvider.isAuthenticatedAsync();
  console.log("protectedLoaded", AuthProvider);

  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}
