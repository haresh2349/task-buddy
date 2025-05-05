import { Dispatch } from "@reduxjs/toolkit";

export type Status = 'todo' | 'inprogress' | 'done';

export interface Todo {
  _id?: string;
  title: string;
  description?:string;
  dueDate: string;
  status: string;
  createdAt?:string;
  updatedAt?:string;
}

export interface EditTodo {
    title?:string;
    description?:string;
    dueDate?:string;
    status?:string
}

export interface TodosData {
    todos:Todo[];
    pagination:PaginationDetails
}

export interface CreateTodoErrors {
    title:string;
    dueDate:string;
}

export interface PaginationDetails {
    total:number;
    page:number;
    limit:number;
    totalPages:number;
    hasNextPage:boolean
}


export interface GroupedTodos {
    todo:Todo[];
    inprogress:Todo[];
    done:Todo[];
}

export interface GetTodosResponse {
    message:string;
    result:TodosData
}


export interface HandleGetSingleTodosProps {
    id:string;
    dispatch :Dispatch;
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
    setTaskDetails:React.Dispatch<React.SetStateAction<Todo>>
}

export interface SingleTodoAPIReponse {
    message:string;
    result:Todo
}