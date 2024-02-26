import { redirect } from "react-router-dom";
import AuthProvider from "./AuthProvider";

export default async function loginLoader() {
  const isAuthenticated = await AuthProvider.isAuthenticatedAsync();
  console.log("loginLoader", AuthProvider);

  if (isAuthenticated) {
    return redirect("/");
  }

  return null;
}
