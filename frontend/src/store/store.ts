import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import tokenSlice from "./slices/tokenSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
};

const rootReducer = combineReducers({
    user: userSlice,
    token: tokenSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
