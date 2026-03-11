"use client";

import { SimpleLotMap } from "./simple-lot-map";

interface Lot {
    id: string;
    number: string;
    size: string;
    price: string;
    status: string;
}

interface InteractiveLotMapProps {
    lots: Lot[];
}

export function InteractiveLotMap({ lots }: InteractiveLotMapProps) {
    // Use the simple map component with SVG background and lot grid
    return <SimpleLotMap lots={lots} />;
}
