import type { Coordinate } from "@/types/coordinate";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ActiveRideState {
    rideId: string | null;
    status: string | null;
    pickup: Coordinate | null;
    dropoff: Coordinate | null;
    fare: number | null;
}

const initialState: ActiveRideState = {
    rideId: null,
    status: null,
    pickup: null,
    dropoff: null,
    fare: null,
};

const activeRideSlice = createSlice({
    name: "activeRide",
    initialState,
    reducers: {
        setActiveRide(state, action: PayloadAction<Partial<ActiveRideState>>) {
            return { ...state, ...action.payload };
        },
        updateRideStatus(state, action: PayloadAction<string>) {
            state.status = action.payload;
        },
        clearActiveRide() {
            return initialState;
        },
    },
});

export const { setActiveRide, updateRideStatus, clearActiveRide } =
    activeRideSlice.actions;
export default activeRideSlice.reducer;
