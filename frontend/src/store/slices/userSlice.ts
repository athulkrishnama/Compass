import type { ROLE } from "@/types/role";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface userData {
    id: string;
    full_name: string;
    email: string;
    role: ROLE | null;
    isLoggedin: boolean;
}

const initialState: userData = {
    email: "",
    full_name: "",
    id: "",
    isLoggedin: false,
    role: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<Omit<userData, "isLoggedin">>) {
            state.email = action.payload.email;
            state.full_name = action.payload.full_name;
            state.id = action.payload.id;
            state.role = action.payload.role;
            state.isLoggedin = true;
        },

        removeUser(state) {
            state.email = "";
            state.id = "";
            state.full_name = "";
            state.isLoggedin = false;
            state.role = null;
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
