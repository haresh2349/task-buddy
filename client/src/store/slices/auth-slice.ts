import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    isAuthenticated:boolean;
}
const initialState:AuthState = {
    isAuthenticated : Boolean(localStorage.getItem('accessToken')) || false,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        updateAuthenticationStatus(state,action:PayloadAction<boolean>){
            state.isAuthenticated = action?.payload
        }
    }
})

export const {updateAuthenticationStatus} = authSlice.actions
export default authSlice.reducer