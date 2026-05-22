import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import tokenSlice from "./slices/tokenSlice";
import langSlice from "./slices/langSlice";
import notificationSlice from "./slices/notificationSlice";
import activeRideSlice from "./slices/activeRideSlice";
import rideRequestPopupSlice from "./slices/rideRequestPopupSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "lang"],
};

const rootReducer = combineReducers({
    user: userSlice,
    token: tokenSlice,
    lang: langSlice,
    notification: notificationSlice,
    activeRide: activeRideSlice,
    rideRequestPopup: rideRequestPopupSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
