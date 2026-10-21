"use client";

// Mapa real (OpenStreetMap + Leaflet) de Nuevo Amanecer y sus puntos de
// interés. Coordenadas verificadas en Google Maps / OpenStreetMap.

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const brand = {
  forest: "#193e2e",
  moss: "#6e874c",
  lime: "#d2e7a6",
  cream: "#f7f8f0",
};

type Poi = {
  name: string;
  detail: string;
  lat: number;
  lng: number;
  main?: boolean;
};

const pois: Poi[] = [
  {
    name: "Nuevo Amanecer",
    detail: "80 lotes · 5 manzanas",
    lat: -34.956653,
    lng: -58.397438,
    main: true,
  },
  {
    name: "Finca San Antonio",
    detail: "Al lado del loteo",
    lat: -34.955049,
    lng: -58.396975,
  },
  {
    name: "Estación Guernica",
    detail: "Tren Roca",
    lat: -34.91796,
    lng: -58.38068,
  },
  {
    name: "Estación Alejandro Korn",
    detail: "Tren Roca",
    lat: -34.98056,
    lng: -58.37391,
  },
];

function markerHtml(poi: Poi) {
  const size = poi.main ? 22 : 14;
  const fill = poi.main ? brand.forest : brand.cream;
  const stroke = poi.main ? brand.lime : brand.forest;
  return `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${fill};border:3px solid ${stroke};box-shadow:0 2px 6px rgba(25,62,46,.4)"></span>`;
}

export function NuevoAmanecerPoiMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    // Leaflet usa window al importarse: se carga solo en el cliente.
    import("leaflet").then(({ default: L }) => {
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      for (const poi of pois) {
        const size = poi.main ? 22 : 14;
        L.marker([poi.lat, poi.lng], {
          icon: L.divIcon({
            html: markerHtml(poi),
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          }),
          zIndexOffset: poi.main ? 1000 : 0,
          title: poi.name,
        })
          .bindTooltip(
            `<strong>${poi.name}</strong><br/><span style="color:${brand.moss}">${poi.detail}</span>`,
            {
              permanent: true,
              // La finca está pegada al loteo: su etiqueta va del otro lado.
              direction: poi.name === "Finca San Antonio" ? "left" : "right",
              offset: [poi.name === "Finca San Antonio" ? -10 : 10, 0],
            }
          )
          .addTo(map);
      }

      map.fitBounds(
        L.latLngBounds(pois.map((poi) => [poi.lat, poi.lng])),
        { padding: [40, 40] }
      );
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="isolate h-[420px] w-full md:h-[520px]"
      role="region"
      aria-label="Mapa de ubicación de Nuevo Amanecer junto a la Finca San Antonio, entre las estaciones Guernica y Alejandro Korn"
    />
  );
}
