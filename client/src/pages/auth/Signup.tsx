import { useState } from "react";
import { SignupFormData } from "../../types/auth-types";
import { useAppDispatch } from "../../hooks/app.hooks";
import {useNavigate} from "react-router-dom";
import { handleSubmitSignup } from "./managers/signup-manager";
import {BeatLoader} from 'react-spinners'
const Signup = ({setShowSignup}:{setShowSignup:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const dispatch = useAppDispatch();
    const Navigate = useNavigate();
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [errors,setErrors] = useState<SignupFormData>({email:"",password:"",username:""})
    const [formData,setFormData] = useState<SignupFormData>({email:"",password:"",username:""});

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setFormData(prev => ({...prev,[name]:value}))
    }
    return <div className="w-1/2 h-1/2 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create new account</h2>
        </div>
        <form className="mt-8 space-y-8" onSubmit={(e) => handleSubmitSignup({e,formData,setErrors,dispatch,setIsLoading,setShowSignup})}>
          <div className="rounded-md space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Username"
                />
                {errors?.username && <span className="text-sm font-medium text-red-500">{errors?.username}</span>}
                </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
              {errors?.email && <span className="text-sm font-medium text-red-500">{errors?.email}</span>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                // value={password}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
              {errors?.password && <span className="text-sm font-medium text-red-500">{errors?.password}</span>}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-700">Already have an account? <span onClick={() => setShowSignup(false)} className="underline cursor-pointer">Sign In</span> </p>
            </div>
          </div>
          <div >
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <BeatLoader color="#FFF"/> : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};

export default Signup;
 
