<?php

namespace App\Console\Commands;

use App\Services\FacturacionMensualService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class GenerarFacturasMensuales extends Command
{
    protected $signature = 'facturas:mensuales {--mes=}';
    protected $description = 'Genera facturas agrupadas mensuales por cliente desde órdenes completadas';

    public function handle(FacturacionMensualService $facturacion)
    {
        // Si se pasa --mes=2025-06 usamos ese, si no, el mes anterior
        $mes = $this->option('mes')
            ? Carbon::parse($this->option('mes'))->startOfMonth()
            : now()->subMonthNoOverflow()->startOfMonth();

        $hasta = $mes->copy()->endOfMonth();

        $this->info("Generando facturas del {$mes->format('Y-m')}...");

        $facturas = $facturacion->generarDesdeOrdenes($mes, $hasta);

        if (empty($facturas)) {
            $this->warn("No se generó ninguna factura. No hay órdenes completadas sin facturar en ese periodo.");
        } else {
            foreach ($facturas as $factura) {
                $this->line("✔ Cliente #{$factura->id_cliente} → Factura {$factura->numero_factura}");
            }
        }

        return Command::SUCCESS;
    }
}
