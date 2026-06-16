import type { ReactNode } from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: ReactNode;
  className?: string;
  id?: string;
}
