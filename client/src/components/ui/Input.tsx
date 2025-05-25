import { TbEyeClosed } from "react-icons/tb";
import { LuEye } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import React, { useState, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({
  type = "text",
  className = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isDate = type === "date";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none pr-10 ${className}`}
        {...rest}
      />

      {/* Password eye toggle */}
      {isPassword && (
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
        >
          {showPassword ? <LuEye size={18} /> : <TbEyeClosed size={18} />}
        </span>
      )}

      {/* Date icon (non-functional, just UI indicator) */}
      {isDate && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
          <SlCalender size={18} />
        </span>
      )}
    </div>
  );
};

export default Input;
