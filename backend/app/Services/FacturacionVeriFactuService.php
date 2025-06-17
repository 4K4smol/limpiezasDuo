<?php

namespace App\Services;

use App\Models\Factura;
use Illuminate\Support\Facades\Storage;
use App\Enums\AccionFactura;
use App\Services\FacturaLogService;

class FacturacionVeriFactuService
{
    protected FacturaLogService $log;

    public function __construct(FacturaLogService $log)
    {
        $this->log = $log;
    }

    public function exportarFacturaJson(Factura $factura): string
    {
        $datos = [
            'numero_factura' => $factura->numero_factura,
            'fecha_emision' => $factura->fecha_emision->toDateString(),
            'cliente' => [
                'nombre' => $factura->cliente->razon_social,
                'cif'    => $factura->cliente->cif,
                'email'  => $factura->cliente->email,
            ],
            'lineas' => $factura->detalles->map(function ($d) {
                return [
                    'descripcion'     => $d->descripcion_concepto,
                    'cantidad'        => $d->cantidad,
                    'precio_unitario' => $d->precio_unitario,
                    'subtotal'        => $d->subtotal,
                    'iva'             => $d->iva_importe,
                    'total'           => $d->total_linea,
                ];
            }),
            'totales' => [
                'base_imponible'     => $factura->base_imponible,
                'iva_importe'        => $factura->iva_importe,
                'retencion_importe'  => $factura->retencion_importe,
                'total_factura'      => $factura->total_factura,
            ],
            'hash'          => $factura->hash_factura,
            'hash_anterior' => $factura->hash_anterior,
        ];

        // Convertimos a JSON y guardamos en /storage/app/public/verifactu/
        $nombre = $factura->numero_factura . '.json';
        $contenido = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        Storage::disk('public')->put('verifactu/' . $nombre, $contenido);

        // Registrar log
        $this->log->registrar($factura, AccionFactura::EXPORTADA_JSON, 'Exportación JSON VeriFactu');

        // Ruta pública accesible desde el navegador
        return asset("storage/verifactu/$nombre"); // solo una barra, sin doble slash

    }
}
