import { Dispatch } from "@reduxjs/toolkit";
import { updateAuthenticationStatus } from "../../store/slices/auth-slice";
import { API_END_POINTS } from "../../api/api-end-points";
import api from "../../api/api-manager";
import { User } from "../../types/users-types";

export const handleLogout = (dispatch: Dispatch) => {
  localStorage.removeItem("accessToken");
  dispatch(updateAuthenticationStatus(false));
};

interface GetUserDetailsProps {
  id: string;
  setterMethod: React.Dispatch<React.SetStateAction<User>>;
}

interface GetUserDetaisResponse {
  message: string;
  result: User;
}

export const getUserDetails = async ({
  id,
  setterMethod,
}: GetUserDetailsProps) => {
  const response = await api.get<GetUserDetaisResponse>(
    `${API_END_POINTS.getUserDetails}/${id}`
  );
  setterMethod(response?.data?.result);
};
