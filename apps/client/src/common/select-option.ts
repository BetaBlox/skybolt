export type SelectOption = {
  label: string;
  secondaryLabel?: string;
  value: string;
};

export const nullOption: SelectOption = {
  label: "All",
  secondaryLabel: "",
  value: "",
};
