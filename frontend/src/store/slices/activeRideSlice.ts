import type { IRideDetailsResponseDTO } from "@/types/api/responses/rideResponses";
import type { RideStatus } from "@/types/rideStatus";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ActiveRideState = IRideDetailsResponseDTO | null;

const initialState: ActiveRideState = null;

const activeRideSlice = createSlice({
    name: "activeRide",
    initialState: initialState as ActiveRideState,
    reducers: {
        setActiveRide(
            _state,
            action: PayloadAction<IRideDetailsResponseDTO | null>
        ) {
            return action.payload;
        },
        updateRideStatus(state, action: PayloadAction<RideStatus>) {
            if (state) {
                state.status = action.payload;
            }
        },
        clearActiveRide() {
            return initialState;
        },
    },
});

export const { setActiveRide, updateRideStatus, clearActiveRide } =
    activeRideSlice.actions;
export default activeRideSlice.reducer;
