import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { IFormField } from "../../interfaces/form-fields.interface";

interface IInput<T extends FieldValues> extends IFormField<T> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const Input = <T extends FieldValues>({
  errors,
  name,
  label,
  register,
  type = "text",
}: IInput<T>) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 text-sm text-gray-900">
        {label}
      </label>
      <input
        type={type}
        id={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
        placeholder="••••••••"
        {...register(name)}
      />
      {errors[name] && (
        <p role="alert" className="text-xs text-rose-700 mt-2">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default Input;
