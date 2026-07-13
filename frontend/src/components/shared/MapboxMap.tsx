import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/config/env";
import suvImg from "@/assets/images/vehicles/suv.png";
import sedanImg from "@/assets/images/vehicles/sedan.png";
import rickshawImg from "@/assets/images/vehicles/rikshaw.png";

export interface MapboxMarker {
    id: string;
    lat: number;
    lng: number;
    label?: string;
    color?: string;
    rotation?: number;
    vehicleType?: string;
    skipBounds?: boolean;
    popupHTML?: string;
    alwaysShowLabel?: boolean;
    sizeScale?: number;

    customElementHTML?: string;
}

interface MapboxMapProps {
    markers?: MapboxMarker[];
    initialCenter?: [number, number];
    initialZoom?: number;
    className?: string;
    onMarkerClick?: (marker: MapboxMarker) => void;
    routeCoordinates?: [number, number][];
    fitBoundsPadding?:
        | { top: number; bottom: number; left: number; right: number }
        | number;
}

const DEFAULT_CENTER: [number, number] = [77.5946, 12.9716];
const DEFAULT_ZOOM = 11;

function createCabMarkerElement(
    vehicleType: string,
    rotation: number = 0
): HTMLElement {
    let imgSrc = sedanImg;
    let width = 26;
    let height = 48;

    if (vehicleType === "SUV") {
        imgSrc = suvImg;
        width = 30;
        height = 54;
    } else if (vehicleType === "RICKSHAW") {
        imgSrc = rickshawImg;
        width = 24;
        height = 42;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "cab-marker-wrapper";
    wrapper.style.cssText = `width:${width}px;height:${height}px;cursor:pointer;`;

    const rotator = document.createElement("div");
    rotator.className = "cab-icon-rotate";
    rotator.style.cssText = `
        width:100%;
        height:100%;
        transform:rotate(${rotation}deg);
        transition:transform 0.5s ease-out;
        filter:drop-shadow(0 2px 5px rgba(0,0,0,0.45));
    `;

    rotator.innerHTML = `
        <img src="${imgSrc}" style="width:100%; height:100%; object-fit:contain;" alt="${vehicleType}" />
    `;

    wrapper.appendChild(rotator);
    return wrapper;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
    markers = [],
    initialCenter = DEFAULT_CENTER,
    initialZoom = DEFAULT_ZOOM,
    className = "",
    onMarkerClick,
    routeCoordinates,
    fitBoundsPadding = { top: 80, bottom: 200, left: 60, right: 60 },
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
    const popupsRef = useRef<Map<string, mapboxgl.Popup>>(new Map());
    const lastFittedSignatureRef = useRef<string>("");
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Capture initialCenter/Zoom once on mount — stored in a ref so changes
    // to the prop (e.g. a new array reference from driverCoordinate) never
    // trigger a map teardown/rebuild.
    const initialCenterRef = useRef<[number, number]>(initialCenter);
    const initialZoomRef = useRef<number>(initialZoom);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        mapboxgl.accessToken = env.VITE_MAPBOX_ACCESS_TOKEN;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: initialCenterRef.current,
            zoom: initialZoomRef.current,
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
    }, []); // ← intentionally empty: map is created once, never re-created

    const markersDataRef = useRef<MapboxMarker[]>(markers);
    useEffect(() => {
        markersDataRef.current = markers;
    }, [markers]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        const currentMarkerIds = new Set(markers.map((m) => m.id));

        // Remove markers that are no longer in the list
        for (const [id, marker] of markersRef.current.entries()) {
            if (!currentMarkerIds.has(id)) {
                marker.remove();
                markersRef.current.delete(id);
                popupsRef.current.get(id)?.remove();
                popupsRef.current.delete(id);
            }
        }

        // Add or update markers
        markers.forEach((markerData) => {
            const isActive = markerData.id === activeMarkerId;
            const existingMarker = markersRef.current.get(markerData.id);

            if (existingMarker) {
                // Always update position
                existingMarker.setLngLat([markerData.lng, markerData.lat]);

                if (markerData.vehicleType) {
                    // Update rotation only — no size/colour changes needed for cab icons
                    const rotator = existingMarker
                        .getElement()
                        .querySelector(
                            ".cab-icon-rotate"
                        ) as HTMLElement | null;
                    if (rotator && markerData.rotation !== undefined) {
                        rotator.style.transform = `rotate(${markerData.rotation}deg)`;
                    }
                } else if (markerData.customElementHTML) {
                    // Custom HTML element markers are static — position-only update
                    // (no style mutations needed since the HTML is baked in)
                } else {
                    // Update regular dot marker styling
                    // The wrapper is the Mapbox element; the dot is the inner child
                    const wrapper = existingMarker.getElement();
                    const dot = wrapper.querySelector(
                        ".mapbox-custom-marker"
                    ) as HTMLElement | null;
                    if (dot) {
                        const scale = markerData.sizeScale ?? 1;
                        const size = Math.round((isActive ? 18 : 14) * scale);
                        dot.style.width = `${size}px`;
                        dot.style.height = `${size}px`;
                        dot.style.border = isActive
                            ? "3px solid #ffffff"
                            : "2px solid #ffffff";
                        dot.style.boxShadow = isActive
                            ? "0 0 0 2px #000, 0 4px 12px rgba(0,0,0,0.35)"
                            : "0 2px 6px rgba(0,0,0,0.25)";
                    }

                    const popup = popupsRef.current.get(markerData.id);
                    if (popup) {
                        if (markerData.popupHTML) {
                            popup.setHTML(markerData.popupHTML);
                        } else if (
                            markerData.label &&
                            !markerData.alwaysShowLabel
                        ) {
                            popup.setHTML(
                                `<div style="font-size:12px;font-weight:600;color:#111;padding:4px 8px;white-space:nowrap;">${markerData.label}</div>`
                            );
                        }
                    }
                }
            } else {
                // --- Create new marker ---
                if (markerData.vehicleType) {
                    // Cab icon marker
                    const el = createCabMarkerElement(
                        markerData.vehicleType,
                        markerData.rotation ?? 0
                    );

                    const popup = new mapboxgl.Popup({
                        offset: 28,
                        closeButton: false,
                        className: "mapbox-minimal-popup",
                    }).setHTML(
                        `<div style="font-size:12px;font-weight:600;color:#111;padding:4px 8px;white-space:nowrap;">${markerData.vehicleType}</div>`
                    );

                    const marker = new mapboxgl.Marker({
                        element: el,
                        anchor: "center",
                    })
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
                } else if (markerData.customElementHTML) {
                    // ── Custom HTML element marker (Google Maps style, etc.) ──────
                    // Create a temp container, grab the first child as the element
                    const tmp = document.createElement("div");
                    tmp.innerHTML = markerData.customElementHTML.trim();
                    const el = (tmp.firstElementChild as HTMLElement) ?? tmp;

                    const markerInst = new mapboxgl.Marker({
                        element: el,
                        anchor: "bottom",
                    }).setLngLat([markerData.lng, markerData.lat]);

                    // Only attach a popup when rich popup HTML is provided
                    if (markerData.popupHTML) {
                        const popup = new mapboxgl.Popup({
                            offset: [0, -8],
                            closeButton: true,
                            closeOnClick: true,
                            className: "mapbox-rich-popup",
                            maxWidth: "240px",
                        }).setHTML(markerData.popupHTML);

                        markerInst.setPopup(popup);
                        popupsRef.current.set(markerData.id, popup);

                        el.addEventListener("click", () => {
                            setActiveMarkerId(markerData.id);
                            markerInst.togglePopup();
                            onMarkerClick?.(markerData);
                        });
                    } else {
                        el.addEventListener("click", () => {
                            setActiveMarkerId(markerData.id);
                            onMarkerClick?.(markerData);
                        });
                    }

                    markerInst.addTo(map);
                    markersRef.current.set(markerData.id, markerInst);
                } else {
                    // ── Regular dot marker ───────────────────────────────────────
                    const scale = markerData.sizeScale ?? 1;
                    const baseSize = isActive ? 18 : 14;
                    const size = Math.round(baseSize * scale);

                    // Wrapper holds both the always-visible label and the dot
                    const wrapper = document.createElement("div");
                    wrapper.className = "mapbox-custom-marker-wrapper";
                    wrapper.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        cursor: pointer;
                        position: relative;
                    `;

                    // Always-visible label pill
                    if (markerData.alwaysShowLabel && markerData.label) {
                        const labelEl = document.createElement("div");
                        labelEl.className = "mapbox-marker-label-pill";
                        labelEl.style.cssText = `
                            background: rgba(255,255,255,0.95);
                            backdrop-filter: blur(6px);
                            border-radius: 20px;
                            padding: 2px 8px;
                            font-size: 11px;
                            font-weight: 600;
                            color: #111;
                            white-space: nowrap;
                            box-shadow: 0 1px 6px rgba(0,0,0,0.18);
                            margin-bottom: 4px;
                            max-width: 120px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            pointer-events: none;
                        `;
                        labelEl.textContent = markerData.label;
                        wrapper.appendChild(labelEl);
                    }

                    const el = document.createElement("div");
                    el.className = "mapbox-custom-marker";
                    el.style.cssText = `
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50%;
                        background: ${markerData.color ?? "#000000"};
                        border: ${isActive ? "3px solid #ffffff" : "2px solid #ffffff"};
                        box-shadow: ${isActive ? "0 0 0 2px #000, 0 4px 12px rgba(0,0,0,0.35)" : "0 2px 6px rgba(0,0,0,0.25)"};
                        transition: all 0.3s ease-out;
                        flex-shrink: 0;
                    `;
                    wrapper.appendChild(el);

                    const needsPopup =
                        !!markerData.popupHTML ||
                        (!markerData.alwaysShowLabel && !!markerData.label);

                    const marker = new mapboxgl.Marker({
                        element: wrapper,
                        anchor: "bottom",
                    }).setLngLat([markerData.lng, markerData.lat]);

                    if (needsPopup) {
                        const popupContent = markerData.popupHTML
                            ? markerData.popupHTML
                            : `<div style="font-size:12px;font-weight:600;color:#111;padding:4px 8px;white-space:nowrap;">${markerData.label ?? ""}</div>`;

                        const popup = new mapboxgl.Popup({
                            offset: 20,
                            closeButton: false,
                            className: markerData.popupHTML
                                ? "mapbox-rich-popup"
                                : "mapbox-minimal-popup",
                            maxWidth: markerData.popupHTML ? "240px" : "none",
                        }).setHTML(popupContent);

                        marker.setPopup(popup);
                        popupsRef.current.set(markerData.id, popup);
                    }

                    marker.addTo(map);

                    wrapper.addEventListener("click", () => {
                        setActiveMarkerId(markerData.id);
                        if (needsPopup) marker.togglePopup();
                        onMarkerClick?.(markerData);
                    });

                    markersRef.current.set(markerData.id, marker);

                    if (isActive && needsPopup) marker.togglePopup();
                }
            }
        });

        // Camera adjustments only for non-skipBounds markers
        const boundaryMarkers = markers.filter((m) => !m.skipBounds);
        const signature = boundaryMarkers.map((m) => m.id).join(",");

        if (
            boundaryMarkers.length === 1 &&
            lastFittedSignatureRef.current !== signature
        ) {
            map.flyTo({
                center: [boundaryMarkers[0].lng, boundaryMarkers[0].lat],
                zoom: 13,
                duration: 800,
            });
            lastFittedSignatureRef.current = signature;
        }
    }, [markers, activeMarkerId, onMarkerClick, isMapLoaded]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        const applyRoute = () => {
            if (!mapRef.current) return;
            const m = mapRef.current;

            if (routeCoordinates && routeCoordinates.length > 0) {
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

                // Only fitBounds to non-skipBounds markers
                const current = markersDataRef.current.filter(
                    (m) => !m.skipBounds
                );
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
                        padding: fitBoundsPadding,
                        maxZoom: 14,
                        duration: 900,
                    });
                    lastFittedSignatureRef.current = signature;
                }
            } else {
                if (m.getLayer("route-layer")) m.removeLayer("route-layer");
                if (m.getSource("route")) m.removeSource("route");
            }
        };

        if (map.isStyleLoaded()) {
            applyRoute();
        } else {
            map.once("style.load", applyRoute);
        }
    }, [routeCoordinates, isMapLoaded, fitBoundsPadding]);

    return (
        <div
            ref={mapContainer}
            className={`w-full rounded-2xl overflow-hidden ${className}`}
            style={{ minHeight: "240px" }}
        />
    );
};

export default MapboxMap;
