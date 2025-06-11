<?php

namespace App\Services;

use App\Models\Factura;
use App\Models\OrdenTrabajo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Services\FacturacionService;

class FacturacionMensualService
{
    protected FacturacionService $facturacionService;

    public function __construct(FacturacionService $facturacionService)
    {
        $this->facturacionService = $facturacionService;
    }

    /**
     * Genera facturas mensuales agrupadas por cliente a partir de órdenes completadas.
     *
     * @param Carbon $desde Fecha de inicio del período
     * @param Carbon $hasta Fecha de fin del período
     * @return array<Factura> Lista de facturas generadas
     */
    public function generarDesdeOrdenes(Carbon $desde, Carbon $hasta): array
    {
        $ordenes = OrdenTrabajo::with(['cliente', 'detalles.servicio'])
            ->where('estado', 'Completado')
            ->whereNull('id_factura')
            ->whereBetween('fecha_programada', [$desde->toDateString(), $hasta->toDateString()])
            ->get()
            ->groupBy('id_cliente');

        $facturas = [];

        foreach ($ordenes as $idCliente => $grupoOrdenes) {
            DB::transaction(function () use ($grupoOrdenes, $idCliente, &$facturas) {
                $items = $grupoOrdenes->map(function ($orden) {
                    $totalOrden = $orden->detalles->sum('precio_total');
                    return [
                        'descripcion_concepto' => "Servicios realizados en Orden #{$orden->id_orden} ({$orden->fecha_programada})",
                        'cantidad' => 1,
                        'precio_unitario' => $totalOrden,
                    ];
                })->all();

                $factura = $this->facturacionService->generarFactura(
                    idCliente: $idCliente,
                    items: $items,
                    ivaPorcentaje: 21.00,
                    fechaEmision: now()
                );

                // Marcar las órdenes con la factura generada
                foreach ($grupoOrdenes as $orden) {
                    $orden->update(['id_factura' => $factura->id_factura]);
                }

                $facturas[] = $factura;
            });
        }

        return $facturas;
    }
}
