import { useEffect, useState } from "react";
import { MdClose, MdCalendarToday } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";
import { ConfirmAction } from "../../components/confirm-action/ConfirmAction";
import { handleGetSingleTodo, handleSubmitEditTask } from "./managers/todos-manager";
import { EditTodo, Todo } from "../../types/todos-types";
import { STATUS_OPTIONS } from "../../constants/app.constant";
import { getFormattedDateForInputTag } from "../../common-managers/common-manager";
import { toggleEditTodoModal } from "../../store/slices/todos-slice";

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditTodoModal = ({
  isOpen,
  onClose,
}: CreateTodoModalProps) => {
  const dispatch = useAppDispatch();
  const [fetchLoading,setFetchLoading] = useState(false);
  const [taskDetails, setTaskDetails] = useState<Todo>({} as Todo);
  const [changedDetails,setChangedDetails] = useState<EditTodo>({});
  const [errors, setErrors] = useState({ title: "", dueDate: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationDailoag,setShowConfirmationDailog] = useState(false);
  const {selectedTodoId} = useAppSelector(store => store.todos);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setChangedDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if(selectedTodoId){
        handleGetSingleTodo({id:selectedTodoId,setIsLoading:setFetchLoading,dispatch,setTaskDetails})
    }
    return () => {
        setChangedDetails({})
    }
  }, [selectedTodoId]);

  if (!isOpen) return null;
  console.log(changedDetails,"changedDetails")
  return (
    <>
      <div className="absolute inset-0 bg-gray-500/50 flex justify-center items-center">
        <div className="rounded bg-[#FFF] z-1 w-[40%] rounded-xl shadow-[rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset]">
          <div className="flex justify-between items-center p-4 border-b border-[#cecece]">
            <h3 className="text-lg font-semibold">Edit Task</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-4">
            {/* Title Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <div className="relative">
                <input
                  name="title"
                  type="text"
                  onChange={handleChange}
                  defaultValue={taskDetails?.title}
                  className={`w-full p-2 border rounded-md focus:outline-none ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Task title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
            </div>
            {/* Description field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={taskDetails.description}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none border-gray-300`}
                  placeholder="Describe the task (optional)"
                />
                {/* {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )} */}
              </div>
            </div>

            {/* Status Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                onChange={handleChange}
                value={changedDetails?.status ? changedDetails?.status : taskDetails?.status || 'todo'}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <div className="relative">
                <MdCalendarToday className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="dueDate"
                  type="date"
                  value={changedDetails?.dueDate ? getFormattedDateForInputTag(changedDetails?.dueDate) : taskDetails?.dueDate ? getFormattedDateForInputTag(taskDetails?.dueDate) : ""}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full p-2 pl-10 border rounded-md focus:outline-none ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                onClick={() => Object.keys(changedDetails)?.length > 0 ? setShowConfirmationDailog(true) : onClose()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                // disabled={true}
                onClick={(e) => handleSubmitEditTask({e,taskId:taskDetails?._id || '',taskDetails:changedDetails,dispatch,setIsLoading,onClose})}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>
      {showConfirmationDailoag && 
        <ConfirmAction 
            title="Cancel"
            message="Are you sure ?"
            closeMethod={() => setShowConfirmationDailog(false)} 
            confirmMethod={() => {
                dispatch(toggleEditTodoModal(false));
            }}
        />}
    </>
  );
};
