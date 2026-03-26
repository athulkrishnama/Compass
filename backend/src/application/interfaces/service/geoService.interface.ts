export interface IGeoService {
  addDriver(driverId: string, lat: number, lng: number): Promise<void>;
  removeDriver(driverId: string): Promise<void>;
  findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    cabType: string,
  ): Promise<string[]>;
}
