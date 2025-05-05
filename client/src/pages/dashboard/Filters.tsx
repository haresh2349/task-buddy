import { MdTableRows } from "react-icons/md";
import { HiViewBoards } from "react-icons/hi";
interface FiltersProps {
    setShowTodoModal:React.Dispatch<React.SetStateAction<boolean>>
}
export const Filters = ({setShowTodoModal}:FiltersProps) => {
    return <div className="w-full px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer">
                <MdTableRows size={"1.2rem"}/>
                <p className="text-md text-[#2F2F2F] font-bold">List </p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
                <HiViewBoards size={"1.2rem"}/>
                <p className="text-md text-[#2F2F2F] font-bold">Board</p>
            </div>
        </div>
        <div>
            <button onClick={() => setShowTodoModal(true)} className="bg-[#7B1984] px-2 py-1 rounded text-white">Add Task</button>
        </div>
    </div>
}