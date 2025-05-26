import { MdAdd, MdTableRows } from "react-icons/md";
import { HiViewBoards } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";
import { ConfirmAction } from "../../components/confirm-action/ConfirmAction";
import { useEffect, useRef, useState } from "react";
import { handleDeleteTask, handleGetTodos } from "./managers/todos-manager";
import { clearTodosToDelete } from "../../store/slices/todos-slice";
import { CiSearch } from "react-icons/ci";
import { useDebounce } from "../../hooks/useDebounce";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";
import { Pagination } from "../../components/pagination/Pagination";
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
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { todosToDelete } = useAppSelector((store) => store.todos);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDailog, setShowDeleteDailog] = useState(false);
  const { paginationDetails } = useAppSelector((store) => store.todos);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [sortOption, setSortOption] = useState<"newest" | "oldest">("newest");

  const handleSort = () => {
    let sort: "desc" | "asc" = sortOption === "oldest" ? "desc" : "asc";
    handleGetTodos({
      dispatch,
      sortOrder: sort,
      sortBy: "createdAt",
      pagination: {
        page: paginationDetails?.page,
        limit: paginationDetails?.limit,
      },
    });
    setSortOption((prev) => (prev === "oldest" ? "newest" : "oldest"));
  };

  useEffect(() => {
    handleGetTodos({ dispatch, searchQuery: debouncedSearchQuery });
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef?.current &&
        !filterRef?.current?.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        data-testid="filters"
        className="w-full px-4 py-2 flex justify-between items-center"
      >
        <div className="hidden  md:flex items-center gap-4">
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
        </div>
        <div className="w-full md:w-auto justify-between items-center flex gap-4">
          <div className="relative">
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowFilter(true);
              }}
            >
              <CiFilter size={"30px"} />
            </span>
            {showFilter && (
              <div
                ref={filterRef}
                className="min-w-[150px] rounded-lg left-0 z-1 bg-white flex flex-col absolute border border-gray-300 shadow-lg"
              >
                <Pagination />
                <div
                  onClick={handleSort}
                  className="p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100"
                >
                  <BiSort />
                  <span>{sortOption === "newest" ? "Oldest" : "Newest"}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center border rounded-lg px-2 py-1">
            <CiSearch size={"1rem"} />
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
              <MdDelete />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
          <button
            onClick={() => setShowTodoModal(true)}
            className={`${
              todosToDelete?.length > 0 ? "hidden" : ""
            } bg-[#7B1984] font-medium px-4 py-2 sm:py-1 rounded text-white flex gap-2 items-center`}
          >
            <MdAdd /> {/* Replace with any "Add" icon you use */}
            <span className="hidden sm:inline">Add Task</span>
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
