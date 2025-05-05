import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationDetails, Todo } from "../../types/todos-types";

interface TodosState {
    todos:Todo[];
    fetchTodosLoading:boolean;
    paginationDetails:PaginationDetails;
    showEditTodoModal:boolean;
    selectedTodoId:string;
}
const  initialState : TodosState= {
    fetchTodosLoading:false,
    todos:[],
    paginationDetails:{
        page:1,
        total:0,
        totalPages:1,
        limit:15,
        hasNextPage:false
    },
    showEditTodoModal:false,
    selectedTodoId:'',
}
export const todoSlice = createSlice({
    initialState,
    name:"todos",
    reducers:{
        startTodosLoading(state){
            state.fetchTodosLoading = true;
        },
        stopTodosLoading(state){
            state.fetchTodosLoading = false;
        },
        getTodosDetails(state,action){
            state.todos = action.payload.todos;
            state.paginationDetails = action.payload.pagination
        },
        toggleEditTodoModal(state,action:PayloadAction<boolean>){
            state.showEditTodoModal = action.payload;
        },
        setSelectedTodoId(state,action:PayloadAction<string>){
            state.selectedTodoId = action.payload;
        }
    }
})

export const  {startTodosLoading,stopTodosLoading,getTodosDetails,setSelectedTodoId,toggleEditTodoModal} = todoSlice.actions;
export default todoSlice.reducer;