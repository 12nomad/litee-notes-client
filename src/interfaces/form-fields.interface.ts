import { FieldValue, FieldValues } from "react-hook-form";

export interface IFormField<T extends FieldValues> {
  name: FieldValue<T>;
  label: string;
  type?: string;
}
