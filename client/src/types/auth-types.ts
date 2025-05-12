import { Dispatch } from "@reduxjs/toolkit";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  username: string;
}

export type AppNavigate = ReturnType<typeof useNavigate>;

export interface HandleSubmitLoginProps {
  e: FormEvent<HTMLFormElement>;
  formData: LoginFormData;
  setErrors: React.Dispatch<React.SetStateAction<LoginFormData>>;
  dispatch: Dispatch;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HandleLoginUserReponse {
  message: string;
  result: {
    id: string;
    accessToken: string;
  };
}

export interface HandleLoginProps {
  payload: LoginFormData;
  dispatch: Dispatch;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HandleSubmitSignupProps {
  e: FormEvent<HTMLFormElement>;
  formData: SignupFormData;
  setErrors: React.Dispatch<React.SetStateAction<SignupFormData>>;
  dispatch: Dispatch;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HandleSignupProps {
  payload: SignupFormData;
  dispatch: Dispatch;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HandleSignupUserReponse {
  message: string;
  result: {
    id: string;
  };
}
