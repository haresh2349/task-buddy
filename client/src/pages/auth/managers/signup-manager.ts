import { API_END_POINTS } from "../../../api/api-end-points";
import api from "../../../api/api-manager";
import { handleApiFailure } from "../../../common-managers/common-manager";
import { EMAIL_REGEX } from "../../../constants/app.constant";
import { activateSnackbar } from "../../../store/slices/common-slice";
import { HandleSignupProps, HandleSignupUserReponse, HandleSubmitSignupProps } from "../../../types/auth-types";

export const handleSubmitSignup = async ({e,formData,setErrors,dispatch,setIsLoading,setShowSignup}:HandleSubmitSignupProps) => {
    e.preventDefault()
    const {email,password,username} = formData;
    let isError = false;

    if(!username){
        setErrors(prev => ({...prev,username:"Username is required!"}));
        isError = true;
    }
    if(!email){
        setErrors(prev => ({...prev,email:"Email is required!"}));
        isError = true;
    }
    if(!password){
        setErrors(prev => ({...prev,password:"Password is required!"}));
        isError = true;
    }

    if(password && password?.length < 4){
        setErrors(prev => ({...prev,password:"Password must cotain 6 characters!"}));
        isError = true;
    }

    if(email && !EMAIL_REGEX.test(email)){
        setErrors(prev => ({...prev,email:"Invalide email!"}))
        isError = true;
    }
    if(isError) return

    const signupResponse = await handleSignupUser({payload:{email,password,username},dispatch,setIsLoading})
    if(signupResponse?.result?.id){
        setShowSignup(false);
        dispatch(activateSnackbar({message:signupResponse?.message,type:"success"}))
    }
}

const handleSignupUser = async ({payload,dispatch,setIsLoading}:HandleSignupProps) => {
    try {
        setIsLoading(true);
        const response = await api.post<HandleSignupUserReponse>(API_END_POINTS.registerUser,payload);
        const data = response?.data;
        return data
    } catch (error) {
        handleApiFailure({error,defaultMessage:"Login failed!",dispatch})
    } finally {
        setIsLoading(false)
    }
}