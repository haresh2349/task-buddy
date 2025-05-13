import { useEffect, useRef, useState } from "react";
import { NoteIcon } from "../../assets/icon-components/NoteIcon";
import { getUserDetails, handleLogout } from "./navbar-manager";
import { useAppDispatch } from "../../hooks/app.hooks";
import { User } from "../../types/users-types";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User);

  // Close popover when clicking outside
  useEffect(() => {
    const loggedInUserId = localStorage.getItem("loginUser") || "";
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    getUserDetails({ id: loggedInUserId, setterMethod: setLoggedInUser });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      data-testid="navbar"
      className="h-[10%] min-h-[60px] flex border border-black justify-between items-center py-2 px-4 shadow-[rgba(100, 100, 111, 0.2) 0px 7px 29px 0px]"
    >
      <div className="flex items-center gap-5">
        <NoteIcon />
        <h4 className="text-[1rem] text-[#2F2F2F] font-bold">Task Buddy</h4>
      </div>
      <div className="relative" ref={popoverRef}>
        <button
          data-testid="avatar-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="w-[30px] md:w-[50px] h-[30px] md:h-[50px] rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
        >
          {loggedInUser?.username
            ? `${loggedInUser?.username[0]?.toUpperCase()}`
            : ""}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 min-w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            {/* <button
              onClick={() => {
                // navigate('/profile');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button> */}
            <p className="px-4 py-2 t ext-sm text-gray-700 hover:bg-gray-100">
              {loggedInUser?.username}
            </p>
            <p className="px-4 py-2 t ext-sm text-gray-700 hover:bg-gray-100">
              {loggedInUser?.email}
            </p>
            <button
              onClick={() => handleLogout(dispatch)}
              className="block w-full text-left px-4 py-2 t ext-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
