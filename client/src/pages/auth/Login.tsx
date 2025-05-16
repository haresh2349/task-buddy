import { useState } from "react";
import { LoginFormData } from "../../types/auth-types";
import { handleSubmitLogin } from "./managers/login-manager";
import { useAppDispatch } from "../../hooks/app.hooks";
import { BeatLoader } from "react-spinners";
import GoogleLoginButton from "./GoogleLogin";
import Input from "../../components/ui/Input";
const Login = ({
  setShowSignup,
}: {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="w-1/2 h-1/2 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
        </div>
        <form
          role="form"
          className="mt-8 space-y-8"
          onSubmit={(e) =>
            handleSubmitLogin({
              e,
              formData,
              setErrors,
              dispatch,
              setIsLoading,
            })
          }
        >
          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
              {errors?.email && (
                <span className="text-sm font-medium text-red-500">
                  {errors?.email}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                // value={password}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
              {errors?.password && (
                <span className="text-sm font-medium text-red-500">
                  {errors?.password}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Don't have an account?{" "}
                <span
                  onClick={() => setShowSignup(true)}
                  className="underline cursor-pointer"
                >
                  Create new account
                </span>{" "}
              </p>
            </div>
          </div>
          <div>
            <GoogleLoginButton />
          </div>
          <div>
            <button
              type="submit"
              className="relative w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <BeatLoader color="#FFF" /> : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
