import { Dispatch } from "@reduxjs/toolkit"
import { API_END_POINTS } from "../../../api/api-end-points"
import api from "../../../api/api-manager"
import { handleApiFailure } from "../../../common-managers/common-manager";
import { CreateTodoErrors, EditTodo, GetTodosResponse, HandleGetSingleTodosProps, SingleTodoAPIReponse, Todo } from "../../../types/todos-types"
import { FormEvent } from "react";
import { getTodosDetails, startTodosLoading, stopTodosLoading, todoSlice } from "../../../store/slices/todos-slice";
import { activateSnackbar } from "../../../store/slices/common-slice";


interface HandleGetTodosProps {
    dispatch :Dispatch;
    searchQuery?:string;
}


interface CreateTodoProps {
    formData:Todo;
    dispatch :Dispatch;
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>
}


interface CreateTodoAPIResponse {
    message:string;
    result:{id:string}
}

interface HandleSubmitCreateTaskProps {
    e:FormEvent;
    onClose:() => void;
    setErrors:React.Dispatch<React.SetStateAction<CreateTodoErrors>>;
    formData:Todo;
    dispatch:Dispatch;
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>
}

export const handleGetTodos = async ({dispatch,searchQuery}:HandleGetTodosProps) => {
    try {
        dispatch(startTodosLoading())
        const response = await api.get<GetTodosResponse>(API_END_POINTS.getTodos,{search:searchQuery});
        const data = response?.data?.result;
        dispatch(getTodosDetails(data))
    } catch (error) {
        handleApiFailure({error,defaultMessage:"Failed to fetch Data!",dispatch})
    } finally {
        dispatch(stopTodosLoading())
    }
}


export const handleGetSingleTodo = async ({id,setIsLoading,dispatch,setTaskDetails}:HandleGetSingleTodosProps) => {
    try {
        setIsLoading && setIsLoading(true);
        const response = await api.get<SingleTodoAPIReponse>(`${API_END_POINTS.getTodos}/${id}`);
        const data = response?.data?.result;
        setTaskDetails(data)
    } catch (error) {
        handleApiFailure({error,defaultMessage:"Failed to fetch Data!",dispatch})
    } finally {
        setIsLoading && setIsLoading(false);
    }
}




export const handleSubmitCreateTask = async ({e,setErrors,formData,dispatch,setIsLoading,onClose}:HandleSubmitCreateTaskProps) => {
    e.preventDefault()
    const {title,dueDate} = formData;
    let isError =  false;
    if(!title){
        setErrors(prev => ({...prev,title:'Title is required!'}));
        isError = true;
    }
    if(!dueDate){
        setErrors(prev => ({...prev,dueDate:'Due Date is required!'}))
        isError = true;
    }
    if(isError) return
    const createdTodo = await createTodo({formData,dispatch,setIsLoading})
    if(createdTodo?.result?.id){
        dispatch(activateSnackbar({message:"Task created successfully.",type:"success"}));
        onClose();
        handleGetTodos({dispatch})
    }
}

export const createTodo = async ({formData,dispatch,setIsLoading}:CreateTodoProps):Promise<CreateTodoAPIResponse | void> => {
    try {
        const payload = {} as Todo;
        payload.title = formData?.title;
        payload.description = formData?.description;
        payload.dueDate = formData?.dueDate;
        payload.status = 'todo'
        const response = await api.post<CreateTodoAPIResponse>(API_END_POINTS.createTodo,payload);
        const data = response.data;
        return data
    } catch (error) {
        handleApiFailure({error,defaultMessage:"Failed to create a task!",dispatch})
    } finally {
        setIsLoading(false)
    }
}


export const handlegetGroupedTodos = (todos:Todo[]):{todo:Todo[],inprogress:Todo[],done:Todo[]} => {
        let todo = [] as Todo[];
        let inprogress = [] as Todo[];
        let done = [] as Todo[];
        todos?.map(task => {
            if(task?.status === 'todo') todo.push(task)
            if(task?.status === 'inprogress') inprogress.push(task)
            if(task?.status === 'done') done.push(task)
        })
        return {todo,inprogress,done}
}


interface HandleSubmitEditTaskProps {
    e?:FormEvent;
    dispatch:Dispatch;
    onClose?:() => void;
    taskDetails:EditTodo;
    taskId:string;
    setIsLoading?:React.Dispatch<React.SetStateAction<boolean>>
}



export const handleSubmitEditTask = async ({e,taskId,taskDetails,dispatch,setIsLoading,onClose}:HandleSubmitEditTaskProps) => {
    e && e.preventDefault();
    const data = await handleUpdateTask({id:taskId,payload:taskDetails,dispatch,setIsLoading})
    if(data?.result?.id){
        dispatch(activateSnackbar({message:data?.message,type:"success"}));
        onClose && onClose();
        handleGetTodos({dispatch})
    }
}   

interface HandleUpdateTaskProps {
    id:string;
    payload:EditTodo;
    dispatch:Dispatch;
    setIsLoading?:React.Dispatch<React.SetStateAction<boolean>>
}

interface HandleUpdateTaskAPIResponse {
    message:string;
    result:{
        id:string;
    }
} 
export const handleUpdateTask = async ({id,payload,dispatch,setIsLoading}:HandleUpdateTaskProps):Promise<HandleUpdateTaskAPIResponse | void> => {
    try {
        setIsLoading && setIsLoading(true);
        const response = await api.patch<HandleUpdateTaskAPIResponse>(`${API_END_POINTS.updateTodos}/${id}`,payload);
        const data = response?.data;
        return data;
    } catch (error) {
        handleApiFailure({error,defaultMessage:"Failed to create a task!",dispatch})
    } finally {
        setIsLoading && setIsLoading(false);
    }
}

interface HandleDeleteTaskProps {
    ids:string[];
    dispatch:Dispatch;
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
    next?:() => void;
}
export const handleDeleteTask = async ({ids,setIsLoading,dispatch,next}:HandleDeleteTaskProps) => {
    try {
        setIsLoading(true);
        const response = await api.post(API_END_POINTS.deleteTodos,{todoIds:ids});
        if(response?.status === 200){
            dispatch(activateSnackbar({message:"Task delete successfully.",type:'success'}));
            next && next()
            handleGetTodos({dispatch});
        }
    } catch (error) {
        handleApiFailure({error,defaultMessage:"Failed to create a task!",dispatch})
    } finally {
        setIsLoading(false);
    }
}