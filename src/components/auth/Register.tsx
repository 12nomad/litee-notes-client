import { FieldValues, Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useUserContext, IUser } from "../../context/user/user.context";
import { IFormField } from "../../interfaces/form-fields.interface";
import { IResponse } from "../../interfaces/response.interface";
import {
  RegisterValidationSchema,
  registerValidationSchema,
} from "../../schema/user.schema";
import client from "../../utils/axios.util";
import Input from "../common/Input";
import ServerError from "../common/ServerError";

const registerFields: IFormField<FieldValues>[] = [
  { name: "username", label: "Team Name: " },
  { name: "password", label: "Password: ", type: "password" },
  {
    name: "passwordConfirmation",
    label: "Confirm Password: ",
    type: "password",
  },
];

const Register = <T extends FieldValues>() => {
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterValidationSchema>({
    resolver: zodResolver(registerValidationSchema),
  });

  const onSubmit = async (data: RegisterValidationSchema) => {
    try {
      setIsLoading(true);
      const {
        data: { token, data: userData },
      } = await client.post<IResponse<IUser>>("/user/register", data);

      if (!token || !userData) {
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setUser(userData);
      localStorage.setItem("notes_at", token);

      reset();
      setServerError("");
      navigate("/", { replace: true });
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) setServerError(error.response?.data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 h-full lg:h-screen">
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl text-center font-medium leading-tight tracking-tight text-gray-900 md:text-2xl">
            Register.
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {registerFields.map((el) => (
              <Input
                key={el.name}
                name={el.name}
                type={el.type || "text"}
                label={el.label}
                register={register}
                errors={errors}
              />
            ))}

            <div>
              <button
                type="submit"
                className={`w-full text-white ${
                  isLoading ? "bg-sky-700" : "bg-sky-600"
                } hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Sign up"}
              </button>
              <ServerError serverError={serverError} />
            </div>
            <p className="text-sm font-light text-gray-500 ">
              Already have an account?{" "}
              <Link
                to="/auth"
                className="font-medium text-sky-600 hover:underline "
              >
                Sign in.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
