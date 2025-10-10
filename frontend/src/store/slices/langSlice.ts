import { Languages, type Langtype } from "@/types/langType";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface langState {
    lang: Langtype;
}

const initialState: langState = {
    lang: Languages[0],
};

const langSlice = createSlice({
    name: "lang",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Langtype>) => {
            state.lang = action.payload;
        },
    },
});

export const { setLanguage } = langSlice.actions;

export default langSlice.reducer;
