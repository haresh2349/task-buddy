import axios from "axios";
import { HandleApiFailureProps } from "../types/common-types";
import { activateSnackbar } from "../store/slices/common-slice";
import { updateAuthenticationStatus } from "../store/slices/auth-slice";

export const getToken = () => {
    return localStorage.getItem('accessToken') || ''
}

export const handleApiFailure = ({error,defaultMessage,dispatch}:HandleApiFailureProps) => {
    let errorMessage = "";
    if (axios.isAxiosError(error)){
      errorMessage = error.response?.data?.message;
      // dispatch(activateSnackbar({message:error.response?.data?.message,type:"error"}))
    } else if(error instanceof Error) {
      errorMessage = error?.message
      // dispatch(activateSnackbar({message:error?.message || defaultMessage,type:"error"}))
    }
    if(errorMessage === "Token expired."){
      localStorage.removeItem('accessToken')
      localStorage.removeItem('loggedInUser');
      dispatch(activateSnackbar({message:errorMessage || defaultMessage,type:"error"}));
      dispatch(updateAuthenticationStatus(false))
    }
}

export function getDDMMYYYY(dateString:string) {
  if(!dateString){
    return
  }
  const istDate = convertUTCToIST(dateString);
  const dateArr = istDate.split("T");
  const [year,month,day] = dateArr[0];
  const [hr,min,sec] = dateArr[1];
 
  return `${day}-${month}-${year}`
}

export const convertUTCToIST = (utcDateString: string): string => {
  const utcDate = new Date(utcDateString);

  if (isNaN(utcDate.getTime())) {
    return "Invalid UTC date string"
  }

  // IST is UTC + 5 hours 30 minutes
  const istOffsetInMinutes = 5.5 * 60;
  const istDate = new Date(utcDate.getTime() + istOffsetInMinutes * 60 * 1000);

  // Format to YYYY-MM-DDTHH:mm:ss
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, "0");
  const day = String(istDate.getDate()).padStart(2, "0");
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  const seconds = String(istDate.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatRelativeDate = (inputDateString: string): string => {
  const inputDate = new Date(inputDateString);
  const now = new Date();

  if (isNaN(inputDate.getTime())) {
    return "Invalid date string";
  }

  // Normalize both dates to remove time
  const inputDateOnly = new Date(inputDate.toDateString());
  const nowDateOnly = new Date(now.toDateString());

  const msInADay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.floor((inputDateOnly.getTime() - nowDateOnly.getTime()) / msInADay);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === -1) {
    return "Yesterday";
  } else if (diffInDays > -7 && diffInDays < 0) {
    return dayNames[inputDate.getDay()];
  } else {
    // Format as YYYY-MM-DD
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  }
};

export const getFormattedDateForInputTag = (dateString:string) => {
  const istDate = convertUTCToIST(dateString);
  let date = new Date(istDate);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  console.log(year,month,day)
  let result = `${year}-${month > 9 ? month : "0" + month}-${day > 9 ? day : "0" + day}`;
  console.log(result,"result")
  return result
}

