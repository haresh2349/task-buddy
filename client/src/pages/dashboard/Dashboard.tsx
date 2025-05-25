import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar/Navbar";
import { CreateTodoModal } from "./CreateTodoModal";
import { Filters } from "./Filters";
import { TodosBoard } from "./components/board/TodosBoard";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";
import { EditTodoModal } from "./EditTodoModal";
import { toggleEditTodoModal } from "../../store/slices/todos-slice";
import { TodosList } from "./components/list/TodosList";
import { handleGetTodos } from "./managers/todos-manager";

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [showTodoModal, setShowTodoModal] = useState(false);
  const { showEditTodoModal } = useAppSelector((store) => store.todos);
  const [activeTab, setActiveTab] = useState<"list" | "board">("board");
  // const {todos,paginationDetails} = useAppSelector(store => store.todos);

  const closeEditModal = () => {
    dispatch(toggleEditTodoModal(false));
  };

  useEffect(() => {
    handleGetTodos({ dispatch });
  }, []);

  return (
    <>
      <div className="w-[100%] h-[100%] flex flex-col justify-between">
        <Navbar />
        <Filters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowTodoModal={setShowTodoModal}
        />
        {activeTab === "list" && <TodosList />}
        {activeTab === "board" && <TodosBoard />}
      </div>
      {showTodoModal && (
        <CreateTodoModal
          isOpen={showTodoModal}
          onClose={() => setShowTodoModal(false)}
        />
      )}
      {showEditTodoModal && (
        <EditTodoModal isOpen={showEditTodoModal} onClose={closeEditModal} />
      )}
    </>
  );
};
