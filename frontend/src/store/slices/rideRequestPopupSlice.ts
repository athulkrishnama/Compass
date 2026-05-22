import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RideRequestPopupState {
    isOpen: boolean;
    rideId: string | null;
}

const initialState: RideRequestPopupState = {
    isOpen: false,
    rideId: null,
};

const rideRequestPopupSlice = createSlice({
    name: "rideRequestPopup",
    initialState,
    reducers: {
        openRideRequestPopup(state, action: PayloadAction<string>) {
            state.isOpen = true;
            state.rideId = action.payload;
        },
        closeRideRequestPopup(state) {
            state.isOpen = false;
            state.rideId = null;
        },
    },
});

export const { openRideRequestPopup, closeRideRequestPopup } =
    rideRequestPopupSlice.actions;
export default rideRequestPopupSlice.reducer;
