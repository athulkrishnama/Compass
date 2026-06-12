import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RideRequestPopupState {
    isOpen: boolean;
    rideId: string | null;
    attempt_id: string | null;
}

const initialState: RideRequestPopupState = {
    isOpen: false,
    rideId: null,
    attempt_id: null,
};

const rideRequestPopupSlice = createSlice({
    name: "rideRequestPopup",
    initialState,
    reducers: {
        openRideRequestPopup(
            state,
            action: PayloadAction<{ rideId: string; attempt_id: string }>
        ) {
            state.isOpen = true;
            state.rideId = action.payload.rideId;
            state.attempt_id = action.payload.attempt_id;
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
