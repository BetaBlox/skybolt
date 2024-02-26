import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const routeError: any = useRouteError();
  console.error(routeError);

  const getMessage = () => {
    try {
      const { statusText, message } = routeError || {
        statusText: "",
        message: "",
      };
      return statusText || message;
    } catch (e) {
      console.error(routeError);
      return "Unknown Error";
    }
  };

  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
        <p className="text-gray-600">
          Sorry, an unexpected error has occurred.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          {" "}
          Go back to Home{" "}
        </a>

        <p className="text-gray-600 text-sm mt-10">
          <i>{getMessage()}</i>
        </p>
      </div>
    </div>
  );
}
