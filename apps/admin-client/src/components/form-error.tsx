export default function FormError({ error }: { error: string }) {
  return <p className="mt-4 rounded bg-red-400 p-2 text-black">{error}</p>;
}