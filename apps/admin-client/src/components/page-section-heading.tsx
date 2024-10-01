interface Props {
  children: React.ReactNode;
}
export const PageSectionHeading = ({ children }: Props) => {
  return (
    <h2 className="mb-4 text-2xl font-semibold leading-none tracking-tight">
      {children}
    </h2>
  );
};
