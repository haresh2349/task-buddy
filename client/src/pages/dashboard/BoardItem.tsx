import { useDrop } from "react-dnd";
import { Todo } from "../../types/todos-types";
import { BoardTaskCard } from "./BoardTaskCard"
import { useCallback, useRef } from "react";
import { handleSubmitEditTask } from "./managers/todos-manager";
import { useAppDispatch } from "../../hooks/app.hooks";
import { TASK_STATUS_VIEWABLE_TEXT } from "../../constants/app.constant";

interface BoardItemProps {
  statusFlagBg :string;
  todos:Todo[];
  status:string;
}

interface DraggedItem {
    id:string;
    index:number;
    status:'todo' | 'inprogress' | 'done'
}

export const BoardItem = ({statusFlagBg,todos,status}:BoardItemProps) => {
    const dispatch = useAppDispatch();
    const statusLabel = TASK_STATUS_VIEWABLE_TEXT[status]?.text
    const [{ isOver }, drop] = useDrop({
        accept: "TASK",
        drop: (item:DraggedItem) => item?.status != status && handleSubmitEditTask({taskId:item?.id,taskDetails:{status:status},dispatch}),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      });
    const dropRef = useRef<HTMLDivElement>(null) 
    const setRefs = useCallback(
        (node: HTMLDivElement) => {
          // Update the DOM ref
          dropRef.current = node;
          
          // Call the drag ref function if it exists
          if (drop) {
            (drop as any)(node);
          }
        },
        [drop]
      );  

     return <div ref={setRefs}  className={`column ${isOver ? "bg-blue-100" : ""} h-[100%] w-full md:w-[48%] lg:w-[33%] bg-[#F1F1F1] px-4 py-2 rounded overflow-y-scroll`}>
        <span className={`inline-block px-4 py-1 mb-4 rounded text-black font-medium`} style={{ backgroundColor: statusFlagBg }}>{statusLabel}</span>
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