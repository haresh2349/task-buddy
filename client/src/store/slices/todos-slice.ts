import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationDetails, Todo } from "../../types/todos-types";

interface TodosState {
    todos:Todo[];
    fetchTodosLoading:boolean;
    paginationDetails:PaginationDetails;
    showEditTodoModal:boolean;
    selectedTodoId:string;
    todosToDelete:string[];
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
    todosToDelete:[]
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
        },
        setTodosToDelete(state,action:PayloadAction<string>){
            if(action?.payload){
                const prevIds = state.todosToDelete;
                const updatedIds = prevIds?.includes(action.payload) ? prevIds?.filter(id => id != action?.payload) : [...prevIds,action.payload];
                state.todosToDelete = updatedIds
            }
        },
        clearTodosToDelete(state){
            state.todosToDelete = []
        }
    }
})

export const  {startTodosLoading,stopTodosLoading,getTodosDetails,setSelectedTodoId,toggleEditTodoModal,setTodosToDelete,clearTodosToDelete} = todoSlice.actions;
export default todoSlice.reducer;