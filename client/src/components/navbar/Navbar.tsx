import { useEffect, useRef, useState } from "react";
import { NoteIcon } from "../../assets/icon-components/NoteIcon"
import { handleLogout } from "./navbar-manager";
import { useAppDispatch } from "../../hooks/app.hooks";

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const [isOpen,setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);



    // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    return <div className="h-[10%] flex border border-black justify-between items-center py-2 px-4 shadow-[rgba(100, 100, 111, 0.2) 0px 7px 29px 0px]">
            <div className="flex items-center gap-5">
                <NoteIcon/>
                <h4 className="text-[1rem] text-[#2F2F2F] font-bold">Task Buddy</h4>
            </div>
            <div className="relative" ref={popoverRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-[50px] h-[50px] rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
        >
          HS
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            {/* <button
              onClick={() => {
                // navigate('/profile');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button> */}
            <button
              onClick={() => handleLogout(dispatch)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
        </div>
}