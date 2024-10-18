export const Spinner = () => {
  return (
    <div
      className="spinner-border inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
