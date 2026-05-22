import { container } from "tsyringe";
import { LocationEventHandler } from "@presentation/webSocket/eventHandlers/locationEventHandler";
import { RideEventHandler } from "@presentation/webSocket/eventHandlers/rideEventHandler";

export function registerEventHandlers() {
  container.registerSingleton<LocationEventHandler>(
    "LocationEventHandler",
    LocationEventHandler,
  );
  container.registerSingleton<RideEventHandler>(
    "RideEventHandler",
    RideEventHandler,
  );
}
