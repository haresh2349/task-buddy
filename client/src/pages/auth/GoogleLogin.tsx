// GoogleLoginButton.jsx
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { handleLoginWithGoogle } from "./managers/login-manager";
import { useAppDispatch } from "../../hooks/app.hooks";
import { GoogleJWTPayload } from "../../types/auth-types";
import { activateSnackbar } from "../../store/slices/common-slice";

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();

  const responseMessage = (response: any) => {
    const userData: GoogleJWTPayload = jwtDecode(response.credential);
    const { name, email, sub: googleId } = userData;
    handleLoginWithGoogle({ name, email, googleId, dispatch });
  };

  const errorMessage = () => {
    dispatch(activateSnackbar({ message: "Please try again!", type: "error" }));
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <div style={{ width: "100%" }}>
        <GoogleLogin
          onSuccess={responseMessage}
          onError={errorMessage}
          logo_alignment="center"
          size="large"
          text="signin_with"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
