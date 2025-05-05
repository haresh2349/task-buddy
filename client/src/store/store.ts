import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice"
import commonReducer from "./slices/common-slice"
import todosReducer from "./slices/todos-slice"
export const store = configureStore({
    reducer:{
        auth:authReducer,
        common:commonReducer,
        todos:todosReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch