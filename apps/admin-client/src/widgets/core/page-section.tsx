interface Props {
  children: React.ReactNode;
}
export const PageSection = ({ children }: Props) => {
  return <div className="mb-20">{children}</div>;
};
