import { MdTableRows } from "react-icons/md";
import { HiViewBoards } from "react-icons/hi";
interface FiltersProps {
    setShowTodoModal:React.Dispatch<React.SetStateAction<boolean>>;
    activeTab:"board" | "list";
    setActiveTab:React.Dispatch<React.SetStateAction<'board' | 'list'>>
}
export const Filters = ({setShowTodoModal,activeTab,setActiveTab}:FiltersProps) => {
    return <div className="w-full px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div onClick={() => setActiveTab('list')} className={`${activeTab === 'list' ? activeTab :''} flex items-center gap-2 cursor-pointer relative`}>
                <MdTableRows color={`${activeTab === 'list' ? 'black' : 'gray'}`} size={"1.2rem"}/>
                <p className={`text-md text-${activeTab === 'list' ? 'black-500' : 'gray-500' } font-bold`}>List </p>
            </div>
            <div onClick={() => setActiveTab('board')} className={`${activeTab === 'board' ? activeTab :''} inline-flex items-center gap-2 cursor-pointer relative`}>
                <HiViewBoards color={`${activeTab === 'board' ? 'black' : 'gray'}`} size={"1.2rem"}/>
                <p className={`text-md text-${activeTab === 'board' ? 'black-500' : 'gray-500' } font-bold`}>Board</p>
            </div>
        </div>
        <div>
            <button onClick={() => setShowTodoModal(true)} className="bg-[#7B1984] px-4 py-1 rounded text-white">Add Task</button>
        </div>
    </div>
}