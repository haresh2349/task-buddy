import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/app.hooks"
import { BoardItem } from "./BoardItem"
import { GroupedTodos, Todo } from "../../../../types/todos-types";
import { handlegetGroupedTodos, handleGetTodos } from "../../managers/todos-manager";
import {BounceLoader} from "react-spinners"

export const TodosBoard = () => {
    const dispatch = useAppDispatch()
    const {todos,fetchTodosLoading,paginationDetails} = useAppSelector(store => store.todos);
    const [groupedTodos,setGroupedTodos] = useState<GroupedTodos>({todo:[],inprogress:[],done:[]})

    useEffect(() => {
        setGroupedTodos(handlegetGroupedTodos(todos))
    },[todos])
    console.log(groupedTodos,todos,"groupedTodos")
    return <div className="flex flex-col md:flex-row gap-2 p-2 justify-between h-[80%]">
        {
            fetchTodosLoading ? <div className="w-[100%] h-[100%] flex justify-center items-center">
                <BounceLoader />
            </div> : <>
                <BoardItem status="todo" todos={groupedTodos.todo} statusFlagBg={"#FAC3FF"}/>
                <BoardItem status="inprogress" todos={groupedTodos.inprogress} statusFlagBg={"#85D9F1"}/>
                <BoardItem status="done" todos={groupedTodos.done} statusFlagBg={"#A2D6A0"}/>
            </>
        }
    </div>
}