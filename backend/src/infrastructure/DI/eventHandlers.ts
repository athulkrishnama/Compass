import { container } from "tsyringe";
import { LocationEventHandler } from "@presentation/webSocket/eventHandlers/locationEventHandler";

export function registerEventHandlers() {
  container.registerSingleton<LocationEventHandler>(
    "LocationEventHandler",
    LocationEventHandler,
  );
}
