import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface tokenType {
    accessToken: string;
}

const initialState: tokenType = {
    accessToken: "",
};

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },

        removeToken(state) {
            state.accessToken = "";
        },
    },
});

export const { removeToken, setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
