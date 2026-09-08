"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { Box } from "@mui/material";
import type { Property } from "@/types/property";

function refreshMarkers(
  leaflet: typeof import("leaflet"),
  map: LeafletMap,
  markers: LayerGroup,
  properties: Property[],
) {
  markers.clearLayers();
  const points = properties.flatMap((property) => {
    const latitude = property.latitude ?? property.lat;
    const longitude = property.longitude ?? property.lng;
    return latitude !== undefined && longitude !== undefined
      ? [{ property, latitude, longitude }]
      : [];
  });

  points.forEach(({ property, latitude, longitude }) =>
    leaflet
      .marker([latitude, longitude])
      .bindPopup(`<strong>${property.title}</strong><br />₹${property.price.toLocaleString("en-IN")}`)
      .addTo(markers),
  );

  if (points.length === 1) map.setView([points[0].latitude, points[0].longitude], 13);
  if (points.length > 1)
    map.fitBounds(points.map((point) => [point.latitude, point.longitude] as [number, number]), {
      padding: [24, 24],
    });
}

export default function PropertyMap({ properties }: { properties: Property[] }) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);
  const propertiesRef = useRef(properties);

  useEffect(() => {
    propertiesRef.current = properties;
  }, [properties]);

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      const leaflet = await import("leaflet");
      if (cancelled || !mapElement.current || map.current) return;
      map.current = leaflet.map(mapElement.current).setView([20.5937, 78.9629], 5);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(map.current);
      markers.current = leaflet.layerGroup().addTo(map.current);
      refreshMarkers(leaflet, map.current, markers.current, propertiesRef.current);
    }

    setupMap();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = null;
    };
  }, []);

  useEffect(() => {
    async function updateMap() {
      if (!map.current || !markers.current) return;
      refreshMarkers(await import("leaflet"), map.current, markers.current, properties);
    }
    updateMap();
  }, [properties]);

  return (
    <Box
      ref={mapElement}
      sx={{
        position: "relative",
        isolation: "isolate",
        zIndex: 0,
        height: "100%",
        width: "100%",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "#e8eef0",
      }}
    />
  );
}