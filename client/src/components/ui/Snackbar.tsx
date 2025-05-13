import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/app.hooks";
import { activateSnackbar } from "../../store/slices/common-slice";

interface SnackbarProps {
  type: "success" | "error" | null;
  message: string | null;
  showTime: number;
}
export const SnackBar = ({ type, message, showTime = 5000 }: SnackbarProps) => {
  const dispatch = useAppDispatch();
  const bgColor =
    type === "success" ? "bg-[#A2D6A0]" : type === "error" ? "bg-red-500" : "";
  const borderColor =
    type === "success"
      ? "border-teal-500"
      : type === "error"
      ? "border-red-500"
      : "";
  const textColor =
    type === "success" ? "text-teal-700" : type === "error" ? "text-white" : "";
  const iconColor =
    type === "success" ? "text-teal-700" : type === "error" ? "text-white" : "";
  useEffect(() => {
    setTimeout(() => {
      dispatch(activateSnackbar({ message: null, type: null }));
    }, showTime);
  }, []);

  return (
    <div
      className={`rounded absolute right-10 bottom-10 p-4 flex justify-between items-center gap-10 ${bgColor} ${borderColor}`}
    >
      <p className={`text-xl font-medium ${textColor}`}>{message}</p>
      <span
        className="cursor-pointer"
        onClick={() =>
          dispatch(activateSnackbar({ message: null, type: null }))
        }
      >
        <svg
          className={`fill-current h-6 w-6 ${iconColor}`}
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  );
};
