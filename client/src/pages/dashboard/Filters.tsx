import { MdTableRows } from "react-icons/md";
import { HiViewBoards } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";
import { ConfirmAction } from "../../components/confirm-action/ConfirmAction";
import { useEffect, useState } from "react";
import { handleDeleteTask, handleGetTodos } from "./managers/todos-manager";
import { clearTodosToDelete } from "../../store/slices/todos-slice";
import { CiSearch } from "react-icons/ci";
import { useDebounce } from "../../hooks/useDebounce";
interface FiltersProps {
  setShowTodoModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: "board" | "list";
  setActiveTab: React.Dispatch<React.SetStateAction<"board" | "list">>;
}
export const Filters = ({
  setShowTodoModal,
  activeTab,
  setActiveTab,
}: FiltersProps) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { todosToDelete } = useAppSelector((store) => store.todos);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDailog, setShowDeleteDailog] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    handleGetTodos({ dispatch, searchQuery: debouncedSearchQuery });
  }, [debouncedSearchQuery]);

  return (
    <>
      <div
        data-testid="filters"
        className="w-full px-4 py-2 flex justify-between items-center"
      >
        <div className="hidden  md:flex items-center gap-4">
          <div
            data-testid="tab-board"
            onClick={() => setActiveTab("board")}
            className={`${
              activeTab === "board" ? activeTab : ""
            } inline-flex items-center gap-2 cursor-pointer relative`}
          >
            <HiViewBoards
              color={`${activeTab === "board" ? "black" : "gray"}`}
              size={"1.2rem"}
            />
            <p
              className={`text-md text-${
                activeTab === "board" ? "black-500" : "gray-500"
              } font-bold`}
            >
              Board
            </p>
          </div>
          <div
            onClick={() => setActiveTab("list")}
            className={`${
              activeTab === "list" ? activeTab : ""
            } flex items-center gap-2 cursor-pointer relative`}
          >
            <MdTableRows
              color={`${activeTab === "list" ? "black" : "gray"}`}
              size={"1.2rem"}
            />
            <p
              className={`text-md text-${
                activeTab === "list" ? "black-500" : "gray-500"
              } font-bold`}
            >
              List{" "}
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto justify-between flex gap-4">
          <div className="flex gap-2 items-center border rounded-lg p-2">
            <CiSearch size={"1.5rem"} />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="border-bottom"
            />
          </div>
          {todosToDelete?.length > 0 && (
            <button
              onClick={() => setShowDeleteDailog(true)}
              className="flex items-center gap-2 font-medium bg-red-500 px-4 py-1 rounded text-white"
            >
              <MdDelete /> Delete
            </button>
          )}
          <button
            onClick={() => setShowTodoModal(true)}
            className={`${
              todosToDelete?.length > 0 ? "hidden" : ""
            } bg-[#7B1984] font-medium px-4 py-1 rounded text-white`}
          >
            Add Task
          </button>
        </div>
      </div>
      {showDeleteDailog && (
        <ConfirmAction
          title="Delete Task"
          message="Are you sure ?"
          isLoading={deleteLoading}
          closeMethod={() => setShowDeleteDailog(false)}
          confirmMethod={() =>
            handleDeleteTask({
              ids: todosToDelete,
              dispatch,
              setIsLoading: setDeleteLoading,
              next: () => {
                setShowDeleteDailog(false);
                dispatch(clearTodosToDelete());
              },
            })
          }
        />
      )}
    </>
  );
};
