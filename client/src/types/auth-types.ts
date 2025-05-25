import { Dispatch } from "@reduxjs/toolkit";
import { JwtPayload } from "jwt-decode";
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

export interface HandleLoginWithGoogleProps {
  name: string;
  email: string;
  googleId: string;
  dispatch: Dispatch;
}

export interface GoogleJWTPayload extends JwtPayload {
  iss: string; // Issuer (accounts.google.com)
  azp: string; // Authorized party (client ID)
  aud: string; // Audience (client ID)
  sub: string; // Google's unique user ID
  email: string;
  email_verified: boolean;
  at_hash?: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration time (timestamp)
}
