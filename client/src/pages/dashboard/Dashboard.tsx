import { useState } from "react"
import { Navbar } from "../../components/navbar/Navbar"
import { CreateTodoModal } from "./CreateTodoModal"
import { Filters } from "./Filters"
import { TodosBoard } from "./TodosBoard"
import { useAppSelector } from "../../hooks/app.hooks"
import { EditTodoModal } from "./EditTodoModal"
import { useDispatch } from "react-redux"
import { toggleEditTodoModal } from "../../store/slices/todos-slice"

export const Dashboard = () => {
    const dispatch = useDispatch();
    const [showTodoModal,setShowTodoModal] = useState(false);
    const {showEditTodoModal} = useAppSelector(store => store.todos);
    const closeEditModal = () => {
        dispatch(toggleEditTodoModal(false))
    }
    return <>
        <div className="w-[100%] h-[100%] flex flex-col justify-between">
            <Navbar/>
            <Filters setShowTodoModal={setShowTodoModal} />
            <TodosBoard/>
        </div>
        {showTodoModal && <CreateTodoModal isOpen={showTodoModal} onClose={() => setShowTodoModal(false)} onSubmit={() => {}}/>}
        {showEditTodoModal && <EditTodoModal isOpen={showEditTodoModal} onClose={closeEditModal} />}
    </>
}