<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Factura;
use App\Services\FacturacionVeriFactuService;
use Illuminate\Support\Carbon;

class ExportarFacturasVeriFactu extends Command
{
    /**
     * El nombre y la firma del comando de consola.
     */
    protected $signature = 'verifactu:exportar {--desde=} {--hasta=}';

    /**
     * La descripción del comando de consola.
     */
    protected $description = 'Exporta facturas en formato VeriFactu JSON entre fechas dadas';

    /**
     * Ejecuta el comando.
     */
    public function handle(): int
    {
        $desde = $this->option('desde') ? Carbon::parse($this->option('desde'))->startOfDay() : now()->startOfMonth();
        $hasta = $this->option('hasta') ? Carbon::parse($this->option('hasta'))->endOfDay() : now();

        $facturas = Factura::whereBetween('fecha_emision', [$desde, $hasta])->with(['cliente', 'detalles'])->get();

        if ($facturas->isEmpty()) {
            $this->warn("No se encontraron facturas entre {$desde->toDateString()} y {$hasta->toDateString()}.");
            return self::SUCCESS;
        }

        $verifactu = app(FacturacionVeriFactuService::class);

        foreach ($facturas as $factura) {
            $ruta = $verifactu->exportarFacturaJson($factura);
            $this->line("✔ Factura {$factura->numero_factura} exportada en: $ruta");
        }

        $this->info("Exportación completada. Total: {$facturas->count()} facturas.");
        return self::SUCCESS;
    }
}
