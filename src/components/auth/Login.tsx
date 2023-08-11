import { useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  LogInValidationSchema,
  logInValidationSchema,
} from "../../schema/user.schema";
import client from "../../utils/axios.util";
import { IResponse } from "../../interfaces/response.interface";
import { IUser, useUserContext } from "../../context/user/user.context";
import { IFormField } from "../../interfaces/form-fields.interface";
import Input from "../common/Input";
import ServerError from "../common/ServerError";

const loginFields: IFormField<FieldValues>[] = [
  { name: "username", label: "Team Name: " },
  { name: "password", label: "Password: ", type: "password" },
];

const Login = () => {
  const [serverError, setServerError] = useState("");
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LogInValidationSchema>({
    resolver: zodResolver(logInValidationSchema),
  });

  const onSubmit = async (data: LogInValidationSchema) => {
    try {
      const {
        data: { token, data: userData },
      } = await client.post<IResponse<IUser>>("/user/login", data);

      if (!token || !userData) return;

      setUser(userData);
      localStorage.setItem("notes_at", token);

      reset();
      setServerError("");
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) setServerError(error.response?.data);
    }
  };

  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-medium leading-tight tracking-tight text-gray-900 md:text-2xl">
              Login.
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {loginFields.map((el) => (
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
                  className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
                <ServerError serverError={serverError} />
              </div>
              <p className="text-sm font-light text-gray-500 ">
                Don't have an account yet?{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-sky-600 hover:underline "
                >
                  Register.
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
