"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info, Calculator, Phone, Map as MapIcon, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lot {
    id: string;
    number: string;
    size: string;
    price: string;
    status: string;
}

interface PlaceholderLotMapProps {
    lots: Lot[];
}

export function LotMapPlaceholder({ lots }: PlaceholderLotMapProps) {
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

    return (
        <Tabs defaultValue="masterplan" className="w-full">
            <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-14 rounded-2xl p-1 bg-muted/50 border shadow-inner">
                    <TabsTrigger value="masterplan" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                        <Layers className="w-4 h-4" /> Masterplan
                    </TabsTrigger>
                    <TabsTrigger value="ubicacion" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                        <MapIcon className="w-4 h-4" /> Ubicación Real
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="masterplan" className="mt-0 focus-visible:outline-none">
                <div className="w-full relative bg-card rounded-3xl p-4 md:p-8 border-4 border-dashed border-primary/20 shadow-2xl">
                    <div className="absolute top-4 right-4 z-10 hidden md:block">
                        <div className="flex flex-col gap-2 bg-background/80 backdrop-blur p-3 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-primary rounded-sm" /> <span>Disponible</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-muted-foreground/30 rounded-sm" /> <span>Vendido</span>
                            </div>
                        </div>
                    </div>

                    {/* IRREGULAR SVG MAP PLACEHOLDER */}
                    {/* INSTRUCTIONS: Replace the SVG content below with your AutoCAD SVG export */}
                    <svg
                        viewBox="0 0 800 500"
                        className="w-full h-auto max-h-[600px] drop-shadow-2xl"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.05))' }}
                    >
                        <g className="lot-group" style={{ cursor: 'pointer' }}>
                            {/* Irregular Shape 1 */}
                            <path
                                d="M100 100 L300 80 L350 250 L120 280 Z"
                                fill="currentColor"
                                className="text-primary/60 hover:text-primary transition-colors stroke-2 stroke-background"
                                onClick={() => setSelectedLot(lots[0] ?? null)}
                            />
                            <text x="210" y="190" fill="white" className="font-bold pointer-events-none select-none">Lote 1</text>

                            {/* Irregular Shape 2 */}
                            <path
                                d="M300 80 L550 60 L600 220 L350 250 Z"
                                fill="currentColor"
                                className="text-primary/40 hover:text-primary transition-colors stroke-2 stroke-background"
                                onClick={() => setSelectedLot(lots[1] ?? null)}
                            />
                            <text x="450" y="160" fill="white" className="font-bold pointer-events-none select-none">Lote 2</text>

                            {/* Irregular Shape 3 */}
                            <path
                                d="M550 60 L750 90 L700 300 L600 220 Z"
                                fill="currentColor"
                                className="text-primary/20 hover:text-primary transition-colors stroke-2 stroke-background"
                                onClick={() => setSelectedLot(lots[2] ?? null)}
                            />
                            <text x="640" y="180" fill="white" className="font-bold pointer-events-none select-none">Lote 3</text>

                            {/* Irregular Shape 4 (Large) */}
                            <path
                                d="M120 280 L350 250 L400 450 L150 480 Z"
                                fill="currentColor"
                                className="text-primary/70 hover:text-primary transition-colors stroke-2 stroke-background"
                                onClick={() => setSelectedLot(lots[3] ?? null)}
                            />
                            <text x="250" y="380" fill="white" className="font-bold pointer-events-none select-none">Lote 4</text>

                            {/* Irregular Shape 5 */}
                            <path
                                d="M350 250 L600 220 L650 430 L400 450 Z"
                                fill="currentColor"
                                className="text-muted-foreground/30 hover:text-primary/40 transition-colors stroke-2 stroke-background"
                                onClick={() => setSelectedLot(lots[4] ?? null)}
                            />
                            <text x="500" y="350" fill="white" className="font-bold pointer-events-none select-none italic">Lote 5 (Vendido)</text>
                        </g>
                    </svg>

                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
                        {lots.slice(5, 23).map((lot) => (
                            <Button
                                key={lot.id}
                                variant="outline"
                                size="sm"
                                className="h-10 text-xs font-bold hover:bg-primary hover:text-white transition-all rounded-lg"
                                onClick={() => setSelectedLot(lot)}
                            >
                                Lote {lot.number}
                            </Button>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Hacé click en un lote para ver detalles y precio
                        </p>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="ubicacion" className="mt-0 focus-visible:outline-none">
                <div className="w-full relative bg-card rounded-3xl overflow-hidden border-4 border-dashed border-primary/20 aspect-[16/9] shadow-2xl group">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3435.105267104926!2d-59.115629124449!3d-34.33180257367018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDE5JzU0LjUiUyA1OcKwMDYnNDguNCJX!5e1!3m2!1ses-419!2sar!4v1715600000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur p-6 rounded-2xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl uppercase tracking-tighter">Arroyo de la Cruz</h4>
                                <p className="text-sm text-muted-foreground font-medium">Exaltación de la Cruz, Provincia de Buenos Aires</p>
                            </div>
                        </div>
                        <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                            <a href="https://maps.app.goo.gl/JRBwNJgCzNKRmy1d9" target="_blank" rel="noopener noreferrer">
                                Abrir en Google Maps
                            </a>
                        </Button>
                    </div>
                </div>
            </TabsContent>

            {/* LOT DETAIL MODAL */}
            <Dialog open={!!selectedLot} onOpenChange={() => setSelectedLot(null)}>
                {selectedLot && (
                    <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-2 border-primary/20">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary font-bold text-2xl">
                                    #{selectedLot.number}
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black">Lote {selectedLot.number}</DialogTitle>
                                    <DialogDescription className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> San Matías Arroyo de La Cruz
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted rounded-2xl border flex flex-col items-center justify-center text-center">
                                    <Badge variant={selectedLot.status === 'available' ? 'default' : 'secondary'} className="mb-2">
                                        {selectedLot.status === 'available' ? 'Disponible' : 'Vendido'}
                                    </Badge>
                                    <span className="text-2xl font-black text-primary">USD {Number(selectedLot.price).toLocaleString()}</span>
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Precio de Contado</span>
                                </div>
                                <div className="p-4 bg-muted rounded-2xl border flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <span className="text-2xl font-black">{selectedLot.size}</span>
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Superficie Total</span>
                                </div>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Calculator className="w-4 h-4" /> Plan Sugerido
                                </h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Anticipo</span>
                                    <span className="font-bold">USD 5.000</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cuotas (48)</span>
                                    <span className="font-bold text-primary">USD 349 / mes</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20">
                                    Reservar Ahora
                                </Button>
                                <Button variant="outline" className="rounded-xl h-12">
                                    <Phone className="w-4 h-4 mr-2" /> Consultar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </Tabs>
    );
}
