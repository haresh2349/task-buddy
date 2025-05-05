import { Dispatch } from "@reduxjs/toolkit";

export interface HandleApiFailureProps  {
    error:unknown;
    defaultMessage:string;
    dispatch:Dispatch
}