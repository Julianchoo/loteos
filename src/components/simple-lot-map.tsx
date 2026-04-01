"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Info, Calculator, Phone, ZoomIn, ZoomOut, Maximize2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientNumber } from "@/components/ui/client-number";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Lot {
    id: string;
    number: string;
    size: string;
    price: string;
    status: string;
}

interface SimpleLotMapProps {
    lots: Lot[];
}

export function SimpleLotMap({ lots }: SimpleLotMapProps) {
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [zoom, setZoom] = useState(1);

    const cashPrice = Number(process.env.NEXT_PUBLIC_CASH_DISCOUNT_PRICE || 15000);
    const basePrice = Number(process.env.NEXT_PUBLIC_LOT_BASE_PRICE || 19500);
    const defaultDownPayment = Number(process.env.NEXT_PUBLIC_DEFAULT_DOWN_PAYMENT || 3000);

    // Función para generar lotes si no hay datos
    const generateLot = (number: number): Lot => {
        const existing = lots.find(l => l.number === number.toString());
        if (existing) return existing;

        const basePrice = process.env.NEXT_PUBLIC_LOT_BASE_PRICE || '19500';

        return {
            id: number.toString(),
            number: number.toString(),
            size: '300m²',
            price: basePrice,
            status: 'available'
        };
    };

    const resetView = () => {
        setZoom(1);
    };

    return (
        <>
            <div className="w-full relative bg-card rounded-3xl p-4 md:p-8 border-4 border-dashed border-primary/20 shadow-2xl">
                {/* Legend */}
                <div className="absolute top-4 right-4 z-10 hidden md:block">
                    <div className="flex flex-col gap-2 bg-background/90 backdrop-blur p-3 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                            <span>Disponible</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                            <span>Reservado</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 bg-muted-foreground/30 rounded-sm" />
                            <span>Vendido</span>
                        </div>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-xl shadow-lg"
                        onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                    >
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-xl shadow-lg"
                        onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                    >
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-xl shadow-lg"
                        onClick={resetView}
                    >
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Map Container */}
                <div className="relative bg-white dark:bg-muted rounded-2xl border-2 border-border overflow-hidden">
                    <div className="relative w-full" style={{ height: '600px' }}>
                        {/* Background SVG */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src="/maps/jardines-de-arroyo-plan.svg"
                                alt="Plano Jardines de Arroyo"
                                fill
                                className="object-contain"
                                style={{
                                    transform: `scale(${zoom})`,
                                    transition: 'transform 0.2s'
                                }}
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Lot Grid Below Map */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4 text-center">Seleccioná un Lote</h3>
                    <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-19 gap-2 max-h-60 overflow-y-auto">
                        {Array.from({ length: 171 }, (_, i) => {
                            const lotNumber = i + 1;
                            const lot = generateLot(lotNumber);
                            const bgColor = lot.status === 'sold' ? 'bg-muted-foreground/30' :
                                          lot.status === 'reserved' ? 'bg-orange-500' :
                                          'bg-green-500';

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedLot(lot)}
                                    disabled={lot.status === 'sold'}
                                    className={`${bgColor} hover:opacity-80 text-white font-bold text-xs rounded px-2 py-3 transition-all disabled:cursor-not-allowed disabled:hover:opacity-100`}
                                >
                                    {lotNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Seleccioná un número de lote para ver detalles y precio
                    </p>
                </div>
            </div>

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
                                        {selectedLot.status === 'available' ? 'Disponible' : selectedLot.status === 'reserved' ? 'Reservado' : 'Vendido'}
                                    </Badge>
                                    <span className="text-2xl font-black text-primary">
                                        USD <ClientNumber value={Number(selectedLot.price)} />
                                    </span>
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Precio Financiado</span>
                                </div>
                                <div className="p-4 bg-muted rounded-2xl border flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <span className="text-2xl font-black">{selectedLot.size}</span>
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Superficie Total</span>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 dark:border-green-900 space-y-2">
                                <h4 className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Pago de Contado
                                </h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Precio especial</span>
                                    <span className="text-2xl font-black text-green-600 dark:text-green-400">
                                        USD <ClientNumber value={Math.round(Number(selectedLot.price) * (cashPrice / basePrice))} />
                                    </span>
                                </div>
                                <p className="text-xs text-green-700 dark:text-green-400">
                                    Ahorrás USD <ClientNumber value={Number(selectedLot.price) - Math.round(Number(selectedLot.price) * (cashPrice / basePrice))} />
                                </p>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Calculator className="w-4 h-4" /> Plan de Financiación
                                </h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Anticipo</span>
                                    <span className="font-bold">
                                        USD <ClientNumber value={defaultDownPayment} />
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cuotas (48)</span>
                                    <span className="font-bold text-primary">
                                        USD <ClientNumber value={Math.round((Number(selectedLot.price) - defaultDownPayment) / 48)} /> / mes
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20" disabled={selectedLot.status !== 'available'}>
                                    {selectedLot.status === 'available' ? 'Reservar Ahora' : 'No Disponible'}
                                </Button>
                                <Button variant="outline" className="rounded-xl h-12">
                                    <Phone className="w-4 h-4 mr-2" /> Consultar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
