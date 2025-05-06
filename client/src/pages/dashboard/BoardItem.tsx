import { Todo } from "../../types/todos-types";
import { BoardTaskCard } from "./BoardTaskCard"

interface BoardItemProps {
  statusFlagBg :string;
  todos:Todo[];
  status:string;
}

export const BoardItem = ({statusFlagBg,todos,status}:BoardItemProps) => {

     return <div className="h-[100%] w-full md:w-[48%] lg:w-[33%] bg-[#F1F1F1] px-4 py-2 rounded overflow-y-scroll">
        <span className={`inline-block px-4 py-1 mb-4 rounded text-black font-medium`} style={{ backgroundColor: statusFlagBg }}>{status}</span>
        {
            todos?.length > 0 ? 
            <div className="flex flex-col gap-4">
                {
                    todos?.map((todo,index) => {
                        return <BoardTaskCard key={todo?._id} index={index} todo={todo}/>
                    })
                }
            </div> : <div className="h-[100%] flex justify-center items-center">
                <p>No Tasks in {status}</p>
            </div>
        }
     </div>
}