import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
    isSnackbarOpen:boolean;
    snackbarMessage:string | null;
    snackbarSeverity:"success" | "error" | null;
    showTime:number
}
const initialState: CommonState = {
    isSnackbarOpen: false,
    snackbarMessage:null,
    snackbarSeverity:null,
    showTime:5000
}
export const commonSlice = createSlice({
    name:"common",
    initialState,
    reducers: {
        activateSnackbar(state,action:PayloadAction<{message:string | null,type:"success" | "error" | null}>){
            state.isSnackbarOpen = action?.payload?.message?.length ? true : false,
            state.snackbarMessage = action.payload?.message || "",
            state.snackbarSeverity = action.payload.type
        },
    }
})

export const {activateSnackbar} = commonSlice.actions;
export default commonSlice.reducer