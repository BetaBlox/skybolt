import { LoaderFunctionArgs, redirect } from "react-router-dom";
import AuthProvider from "./AuthProvider";

export default async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate our form inputs and return validation errors via useActionData()
  if (!email) {
    return {
      error: "You must provide a email to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    const res = await AuthProvider.signin(email, password);

    if (!res.ok) {
      return {
        error: "Invalid login attempt",
      };
    }
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: "Invalid login attempt",
    };
  }

  const redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo || "/");
}
