<?php

namespace App\Services;

use App\Models\Factura;
use App\Models\OrdenTrabajo;
use App\Services\FacturacionService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class FacturacionMensualService
{
    protected FacturacionService $facturacionService;

    public function __construct(FacturacionService $facturacionService)
    {
        $this->facturacionService = $facturacionService;
    }

    /**
     * Genera facturas mensuales agrupadas por cliente
     *
     * @param Carbon $desde
     * @param Carbon $hasta
     * @return array<Factura>
     */
    public function generarDesdeOrdenes(Carbon $desde, Carbon $hasta): array
    {
        // Buscar órdenes completadas sin factura dentro del rango de fechas
        $ordenes = OrdenTrabajo::with(['cliente', 'detalles.servicio'])
            ->where('estado', 'Completado')
            ->whereNull('id_factura')
            ->whereBetween('fecha_programada', [$desde->toDateString(), $hasta->toDateString()])
            ->get()
            ->groupBy('id_cliente');

        $facturas = [];

        foreach ($ordenes as $idCliente => $grupoOrdenes) {
            DB::transaction(function () use ($grupoOrdenes, $idCliente, &$facturas) {
                $items = [];

                foreach ($grupoOrdenes as $orden) {
                    $totalOrden = $orden->detalles->sum('precio_total');
                    $items[] = [
                        'descripcion_concepto' => "Servicios realizados en Orden #{$orden->id_orden} ({$orden->fecha_programada})",
                        'cantidad' => 1,
                        'precio_unitario' => $totalOrden,
                    ];
                }

                $factura = $this->facturacionService->generarFactura(
                    $idCliente,
                    $items,
                    ivaPorcentaje: 21.00
                );

                foreach ($grupoOrdenes as $orden) {
                    $orden->update(['id_factura' => $factura->id_factura]);
                }

                $facturas[] = $factura;
            });
        }

        return $facturas;
    }
}
