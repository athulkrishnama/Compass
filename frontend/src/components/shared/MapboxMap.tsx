import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/config/env";

export interface MapboxMarker {
    id: string;
    lat: number;
    lng: number;
    label?: string;
    color?: string;
}

interface MapboxMapProps {
    markers?: MapboxMarker[];
    initialCenter?: [number, number];
    initialZoom?: number;
    className?: string;
    onMarkerClick?: (marker: MapboxMarker) => void;
    routeCoordinates?: [number, number][];
}

const DEFAULT_CENTER: [number, number] = [77.5946, 12.9716];
const DEFAULT_ZOOM = 11;

const MapboxMap: React.FC<MapboxMapProps> = ({
    markers = [],
    initialCenter = DEFAULT_CENTER,
    initialZoom = DEFAULT_ZOOM,
    className = "",
    onMarkerClick,
    routeCoordinates,
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
    const popupsRef = useRef<Map<string, mapboxgl.Popup>>(new Map());
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        mapboxgl.accessToken = env.VITE_MAPBOX_ACCESS_TOKEN;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: initialCenter,
            zoom: initialZoom,
        });

        map.on("load", () => {
            setIsMapLoaded(true);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            setIsMapLoaded(false);
        };
    }, [initialCenter, initialZoom]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        markersRef.current.forEach((marker) => marker.remove());
        popupsRef.current.forEach((popup) => popup.remove());
        markersRef.current.clear();
        popupsRef.current.clear();

        markers.forEach((markerData) => {
            const isActive = markerData.id === activeMarkerId;

            const el = document.createElement("div");
            el.className = "mapbox-custom-marker";
            el.style.cssText = `
                width: ${isActive ? "18px" : "14px"};
                height: ${isActive ? "18px" : "14px"};
                border-radius: 50%;
                background: ${markerData.color ?? "#000000"};
                border: ${isActive ? "3px solid #ffffff" : "2px solid #ffffff"};
                box-shadow: ${isActive ? "0 0 0 2px #000, 0 4px 12px rgba(0,0,0,0.35)" : "0 2px 6px rgba(0,0,0,0.25)"};
                cursor: pointer;
                transition: all 0.2s ease;
                transform: ${isActive ? "scale(1.2)" : "scale(1)"};
            `;

            const popup = new mapboxgl.Popup({
                offset: 20,
                closeButton: false,
                className: "mapbox-minimal-popup",
            }).setHTML(
                `<div style="font-size:12px;font-weight:600;color:#111;padding:4px 8px;white-space:nowrap;">${markerData.label ?? ""}</div>`
            );

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([markerData.lng, markerData.lat])
                .setPopup(popup)
                .addTo(map);

            el.addEventListener("click", () => {
                setActiveMarkerId(markerData.id);
                marker.togglePopup();
                onMarkerClick?.(markerData);
            });

            markersRef.current.set(markerData.id, marker);
            popupsRef.current.set(markerData.id, popup);

            if (isActive) {
                marker.togglePopup();
            }
        });

        if (markers.length > 0) {
            if (markers.length === 1) {
                map.flyTo({
                    center: [markers[0].lng, markers[0].lat],
                    zoom: 13,
                    duration: 800,
                });
            } else {
                const bounds = markers.reduce(
                    (b, m) => b.extend([m.lng, m.lat]),
                    new mapboxgl.LngLatBounds(
                        [markers[0].lng, markers[0].lat],
                        [markers[0].lng, markers[0].lat]
                    )
                );

                // If routeCoordinates is provided, pad the bounds more to account for the drawn line
                const padding =
                    routeCoordinates && routeCoordinates.length > 0
                        ? { top: 80, bottom: 80, left: 80, right: 80 }
                        : 60;
                map.fitBounds(bounds, {
                    padding,
                    maxZoom: 14,
                    duration: 800,
                });

                if (routeCoordinates && routeCoordinates.length > 0) {
                    if (map.getSource("route")) {
                        (
                            map.getSource("route") as mapboxgl.GeoJSONSource
                        ).setData({
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "LineString",
                                coordinates: routeCoordinates,
                            },
                        });
                    } else {
                        map.addSource("route", {
                            type: "geojson",
                            data: {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "LineString",
                                    coordinates: routeCoordinates,
                                },
                            },
                        });

                        map.addLayer({
                            id: "route-layer",
                            type: "line",
                            source: "route",
                            layout: {
                                "line-join": "round",
                                "line-cap": "round",
                            },
                            paint: {
                                "line-color": "#111111",
                                "line-width": 4,
                                "line-opacity": 0.8,
                            },
                        });
                    }
                } else if (map.getLayer("route-layer")) {
                    map.removeLayer("route-layer");
                    map.removeSource("route");
                }
            }
        }
    }, [markers, activeMarkerId, onMarkerClick, routeCoordinates, isMapLoaded]);

    return (
        <div
            ref={mapContainer}
            className={`w-full rounded-2xl overflow-hidden ${className}`}
            style={{ minHeight: "240px" }}
        />
    );
};

export default MapboxMap;
