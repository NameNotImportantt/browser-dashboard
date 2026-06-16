export interface TextColorFieldProps {
  label: string;
  value: string;
  swatches: string[];
  onChange: (value: string, commit?: boolean) => void;
}
