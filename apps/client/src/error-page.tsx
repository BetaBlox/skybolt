import { Button } from '@/components/button';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
        <p className="text-gray-600">
          Sorry, an unexpected error has occurred.
        </p>
        <Button asChild className="mt-4">
          <a href="/"> Go back to Home </a>
        </Button>
      </div>
    </div>
  );
}
