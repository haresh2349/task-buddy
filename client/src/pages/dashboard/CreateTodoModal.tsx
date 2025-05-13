import { useState } from "react";
import { MdClose, MdCalendarToday } from "react-icons/md";
import { handleSubmitCreateTask } from "./managers/todos-manager";
import { useAppDispatch } from "../../hooks/app.hooks";
import { ConfirmAction } from "../../components/confirm-action/ConfirmAction";
import { BeatLoader } from "react-spinners";

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTodoModal = ({ isOpen, onClose }: CreateTodoModalProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    status: "todo",
    description: "",
  });
  const [errors, setErrors] = useState({ title: "", dueDate: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationDailoag, setShowConfirmationDailog] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;
  return (
    <>
      <div
        data-testid="create-todo-modal"
        className="absolute inset-0 bg-gray-500/50 flex justify-center items-center"
      >
        <div className="rounded bg-[#FFF] z-1 w-[40%] rounded-xl shadow-[rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset]">
          <div className="flex justify-between items-center p-4 border-b border-[#cecece]">
            <h3 className="text-lg font-semibold">Create New Task</h3>
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
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none border-gray-300`}
                  placeholder="Describe the task (optional)"
                />
                {/* {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )} */}
              </div>
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
                onClick={() =>
                  formData?.title || formData?.dueDate || formData?.description
                    ? setShowConfirmationDailog(true)
                    : onClose()
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={(e) =>
                  handleSubmitCreateTask({
                    e,
                    setErrors,
                    formData,
                    dispatch,
                    setIsLoading,
                    onClose,
                  })
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? <BeatLoader color="#FFF" /> : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showConfirmationDailoag && (
        <ConfirmAction
          isLoading={isLoading}
          title="Cance"
          message="Are you sure ?"
          closeMethod={() => setShowConfirmationDailog(false)}
          confirmMethod={() => {}}
        />
      )}
    </>
  );
};
