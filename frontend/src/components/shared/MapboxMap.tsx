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
    const lastFittedSignatureRef = useRef<string>("");
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        mapboxgl.accessToken = env.VITE_MAPBOX_ACCESS_TOKEN;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: initialCenter,
            zoom: initialZoom,
        });

        map.once("idle", () => {
            setIsMapLoaded(true);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            setIsMapLoaded(false);
        };
    }, []);

    // Keep a live ref to markers so the route effect can read them without
    // listing `markers` as a dependency (which would cause double fitBounds).
    const markersDataRef = useRef<MapboxMarker[]>(markers);
    useEffect(() => {
        markersDataRef.current = markers;
    }, [markers]);

    // ── Effect 1: Markers only — never triggers fitBounds ────────────────────
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

            if (isActive) marker.togglePopup();
        });

        // flyTo only for single-marker case, and only if the signature changed
        const signature = markers.map((m) => m.id).join(",");
        if (
            markers.length === 1 &&
            lastFittedSignatureRef.current !== signature
        ) {
            map.flyTo({
                center: [markers[0].lng, markers[0].lat],
                zoom: 13,
                duration: 800,
            });
            lastFittedSignatureRef.current = signature;
        }
        // Multi-marker fitBounds is intentionally handled in the route effect
        // so it only fires once when the route is ready — not twice.
    }, [markers, activeMarkerId, onMarkerClick, isMapLoaded]);

    // ── Effect 2: Route drawing + fitBounds (fires only when route changes) ──
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        const applyRoute = () => {
            if (!mapRef.current) return;
            const m = mapRef.current;

            if (routeCoordinates && routeCoordinates.length > 0) {
                // Update or create the route source/layer
                if (m.getSource("route")) {
                    (m.getSource("route") as mapboxgl.GeoJSONSource).setData({
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: routeCoordinates,
                        },
                    });
                } else {
                    m.addSource("route", {
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
                    m.addLayer({
                        id: "route-layer",
                        type: "line",
                        source: "route",
                        layout: { "line-join": "round", "line-cap": "round" },
                        paint: {
                            "line-color": "#111111",
                            "line-width": 4,
                            "line-opacity": 0.85,
                        },
                    });
                }

                // Fit bounds to show all markers + the full route — only when marker IDs change
                const current = markersDataRef.current;
                const signature = current.map((m) => m.id).join(",");
                if (
                    current.length > 1 &&
                    lastFittedSignatureRef.current !== signature
                ) {
                    const bounds = current.reduce(
                        (b, m) => b.extend([m.lng, m.lat]),
                        new mapboxgl.LngLatBounds(
                            [current[0].lng, current[0].lat],
                            [current[0].lng, current[0].lat]
                        )
                    );
                    mapRef.current?.fitBounds(bounds, {
                        padding: { top: 80, bottom: 200, left: 60, right: 60 },
                        maxZoom: 14,
                        duration: 900,
                    });
                    lastFittedSignatureRef.current = signature;
                }
            } else {
                // Clear the route if coordinates were removed
                if (m.getLayer("route-layer")) m.removeLayer("route-layer");
                if (m.getSource("route")) m.removeSource("route");
            }
        };

        if (map.isStyleLoaded()) {
            applyRoute();
        } else {
            map.once("style.load", applyRoute);
        }
    }, [routeCoordinates, isMapLoaded]);

    return (
        <div
            ref={mapContainer}
            className={`w-full rounded-2xl overflow-hidden ${className}`}
            style={{ minHeight: "240px" }}
        />
    );
};

export default MapboxMap;
