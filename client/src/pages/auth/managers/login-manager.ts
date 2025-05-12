import { API_END_POINTS } from "../../../api/api-end-points";
import api from "../../../api/api-manager";
import { handleApiFailure } from "../../../common-managers/common-manager";
import { EMAIL_REGEX } from "../../../constants/app.constant";
import { updateAuthenticationStatus } from "../../../store/slices/auth-slice";
import { activateSnackbar } from "../../../store/slices/common-slice";
import {
  HandleLoginProps,
  HandleLoginUserReponse,
  HandleSubmitLoginProps,
  LoginFormData,
} from "../../../types/auth-types";

export const handleSubmitLogin = async ({
  e,
  formData,
  setErrors,
  dispatch,
  setIsLoading,
}: HandleSubmitLoginProps) => {
  e.preventDefault();
  const { email, password } = formData;
  let isError = false;
  if (!email) {
    setErrors((prev) => ({ ...prev, email: "Email is required!" }));
    isError = true;
  }
  if (!password) {
    setErrors((prev) => ({ ...prev, password: "Password is required!" }));
    isError = true;
  }

  if (password && password?.length < 4) {
    setErrors((prev) => ({
      ...prev,
      password: "Password must cotain 6 characters!",
    }));
    isError = true;
  }

  if (email && !EMAIL_REGEX.test(email)) {
    setErrors((prev) => ({ ...prev, email: "Invalide email!" }));
    isError = true;
  }
  if (isError) return;

  const loginResponse = await handleLoginUser({
    payload: { email, password },
    dispatch,
    setIsLoading,
  });
  if (loginResponse?.result?.accessToken) {
    dispatch(
      activateSnackbar({ message: loginResponse?.message, type: "success" })
    );
    setTimeout(() => {
      dispatch(updateAuthenticationStatus(true));
      localStorage.setItem("accessToken", loginResponse?.result?.accessToken);
      localStorage.setItem("loginUser", loginResponse?.result?.id);
    }, 100);
  }
};

const handleLoginUser = async ({
  payload,
  dispatch,
  setIsLoading,
}: HandleLoginProps) => {
  try {
    setIsLoading(true);
    const response = await api.post<HandleLoginUserReponse>(
      API_END_POINTS.loginUser,
      payload,
      { "x-auth-require": false }
    );
    const data = response?.data;
    return data;
  } catch (error) {
    handleApiFailure({ error, defaultMessage: "Login failed!", dispatch });
  } finally {
    setIsLoading(false);
  }
};
