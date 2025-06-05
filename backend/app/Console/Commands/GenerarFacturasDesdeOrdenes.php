<?php

namespace App\Console\Commands;

use App\Models\OrdenTrabajo;
use App\Services\FacturacionService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerarFacturasDesdeOrdenes extends Command
{
    protected $signature = 'facturas:generar-desde-ordenes';
    protected $description = 'Genera facturas automáticas a partir de órdenes completadas agrupadas por cliente';

    public function handle(FacturacionService $facturacionService): int
    {
        $this->info("Iniciando generación de facturas desde órdenes...");

        // Obtener órdenes completadas no facturadas (puedes marcar luego como facturadas con un campo)
        $ordenes = OrdenTrabajo::with(['cliente', 'detalles.servicio'])
            ->where('estado', 'Completado')
            ->whereNull('id_factura') // ← opcional si agregas campo a orden
            ->get()
            ->groupBy('id_cliente');

        if ($ordenes->isEmpty()) {
            $this->warn("No hay órdenes completadas pendientes de facturar.");
            return Command::SUCCESS;
        }

        foreach ($ordenes as $idCliente => $ordenesCliente) {
            try {
                DB::transaction(function () use ($ordenesCliente, $idCliente, $facturacionService) {
                    // Preparar ítems para la factura
                    $items = [];

                    foreach ($ordenesCliente as $orden) {
                        foreach ($orden->detalles as $detalle) {
                            $items[] = [
                                'descripcion_concepto' => "Servicio: {$detalle->servicio->nombre} (Orden #{$orden->id_orden})",
                                'cantidad' => 1,
                                'precio_unitario' => $detalle->precio_total,
                            ];
                        }
                    }

                    // Crear factura
                    $factura = $facturacionService->generarFactura(
                        $idCliente,
                        $items,
                        ivaPorcentaje: 21.00
                    );

                    // Relacionar órdenes con la factura creada
                    foreach ($ordenesCliente as $orden) {
                        $orden->update(['id_factura' => $factura->id_factura]);
                    }

                    $this->info("Factura #{$factura->numero_factura} generada para cliente ID {$idCliente}");
                });
            } catch (\Throwable $e) {
                $this->error("Error al generar factura para cliente {$idCliente}: {$e->getMessage()}");
            }
        }

        $this->info("Proceso completado.");
        return Command::SUCCESS;
    }
}
