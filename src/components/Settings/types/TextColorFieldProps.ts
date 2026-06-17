export interface TextColorFieldProps {
  label: string;
  value: string;
  placeholder: string;
  swatches: string[];
  onChange: (value: string, commit?: boolean) => void;
}
