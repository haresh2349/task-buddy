import { Dispatch } from "@reduxjs/toolkit";
import { updateAuthenticationStatus } from "../../store/slices/auth-slice";

export const handleLogout = (dispatch:Dispatch) => {
    localStorage.removeItem('accessToken');
    dispatch(updateAuthenticationStatus(false));
}