import React, { useEffect, useRef, useState } from "react";
import { TASK_STATUS_VIEWABLE_TEXT } from "../../../../../constants/app.constant";
import { MdMoreHoriz } from "react-icons/md";
import { useAppDispatch } from "../../../../../hooks/app.hooks";
import {
  setSelectedTodoId,
  setTodosToDelete,
  toggleEditTodoModal,
} from "../../../../../store/slices/todos-slice";
import { Todo } from "../../../../../types/todos-types";
import { formatRelativeDate } from "../../../../../common-managers/common-manager";
import { ConfirmAction } from "../../../../../components/confirm-action/ConfirmAction";
import { handleDeleteTask } from "../../../managers/todos-manager";

interface AccordionProps {
  tasks: Todo[];
  status: string;
  isOpen: boolean;
  toggleSection: React.Dispatch<React.SetStateAction<boolean>>;
}

const Accordion: React.FC<AccordionProps> = ({
  tasks,
  status,
  isOpen,
  toggleSection,
}) => {
  const dispatch = useAppDispatch();
  const [showPopover, setShowPopover] = useState<string[]>([]);
  const [activePopover, setActivePopover] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [showDeleteDailoag, setShowDeleteDailog] = useState(false);
  const [taskToDelete,setTaskToDelete] = useState('');
  const handleClickMore = (rowId: string) => {
    setActivePopover(rowId);
    setShowPopover((prev) =>
      prev.includes(rowId)
        ? prev?.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };
  //For more action popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsidePopover = target.closest(".popover");

      if (!isInsidePopover) {
        setShowPopover([]);
        setActivePopover("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(activePopover,"ap")
  return (
    <>
      <div className="rounded-b-md shadow-sm">
        <button
          className={`w-full text-left px-4 py-2 font-bold rounded-t-md`}
          style={{ backgroundColor: TASK_STATUS_VIEWABLE_TEXT[status].bg }}
          onClick={() => toggleSection((prev) => !prev)}
        >
          {TASK_STATUS_VIEWABLE_TEXT[status].text} ({tasks.length})
        </button>

        {isOpen && (
          <div className="bg-[#F1F1F1] ">
            {tasks?.map((task) => {
              return (
                <div
                  key={task._id}
                  className="flex justify-between items-center border-bottom border-[#D9D9D9] p-3"
                >
                  <div className="w-[90%] md:w-[40%] flex gap-2 items-center">
                    <input
                      onChange={() =>
                        dispatch(setTodosToDelete(task?._id || ""))
                      }
                      className=""
                      type="checkbox"
                    />
                    <p className="w-[90%] font-medium truncate">
                      {task?.title}
                    </p>
                  </div>
                  <p className="w-[30%] hidden md:block font-medium">
                    {task?.dueDate ? formatRelativeDate(task?.dueDate) : ""}
                  </p>
                  <p className="w-[20%] hidden md:block">
                    <button className="bg-[#DDDADD] rounded-sm py-1 px-2 text-xs font-medium">
                      {TASK_STATUS_VIEWABLE_TEXT[task.status].text}
                    </button>
                  </p>
                  <div className="relative">
                    <button onClick={() => handleClickMore(task?._id || "")}>
                      <MdMoreHoriz />
                    </button>
                    {showPopover.includes(task?._id || "") && (
                      <div
                        ref={popoverRef}
                        className="popover absolute right-0 mt-2 w-28 bg-white border border-gray-300 shadow-lg rounded z-10"
                      >
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            dispatch(toggleEditTodoModal(true));
                            dispatch(setSelectedTodoId(task?._id || ""));
                            setShowPopover((prev) => prev?.filter((id) => id !== activePopover));
                            setActivePopover("");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setShowDeleteDailog(true)
                            setTaskToDelete(task?._id || '')
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showDeleteDailoag && (
        <ConfirmAction
          title="Delete Task"
          message="Are you sure ?"
          isLoading={deleteLoading}
          closeMethod={() => setShowDeleteDailog(false)}
          confirmMethod={() =>{
            console.log(activePopover,"app")
            handleDeleteTask({
              ids: taskToDelete ? [taskToDelete] : [],
              dispatch,
              setIsLoading: setDeleteLoading,
              next:() => {
                setShowDeleteDailog(false);
                setTaskToDelete('')
              }
            })
          }}
        />
      )}
    </>
  );
};

export default Accordion;
