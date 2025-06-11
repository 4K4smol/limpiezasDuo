<?php

namespace App\Services;

use App\Models\Factura;
use App\Models\FacturaLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Enums\AccionFactura;

class FacturacionVeriFactuService
{
    public function exportarFacturaJson(Factura $factura): string
    {
        $datos = [
            'numero_factura' => $factura->numero_factura,
            'fecha_emision' => $factura->fecha_emision->toDateString(),
            'cliente' => [
                'nombre' => $factura->cliente->razon_social,
                'cif' => $factura->cliente->cif,
                'email' => $factura->cliente->email,
            ],
            'lineas' => $factura->detalles->map(function ($d) {
                return [
                    'descripcion' => $d->descripcion_concepto,
                    'cantidad' => $d->cantidad,
                    'precio_unitario' => $d->precio_unitario,
                    'subtotal' => $d->subtotal,
                    'iva' => $d->iva_importe,
                    'total' => $d->total_linea,
                ];
            }),
            'totales' => [
                'base_imponible' => $factura->base_imponible,
                'iva_importe' => $factura->iva_importe,
                'retencion_importe' => $factura->retencion_importe,
                'total_factura' => $factura->total_factura,
            ],
            'hash' => $factura->hash_factura,
            'hash_anterior' => $factura->hash_anterior,
        ];

        $path = 'verifactu/' . $factura->numero_factura . '.json';
        Storage::disk('local')->put($path, json_encode($datos, JSON_PRETTY_PRINT));

        $this->registrarLog($factura, 'exportado_json', 'Exportación JSON VeriFactu');

        return $path;
    }

    public function registrarLog(Factura $factura, string $accion, ?string $comentario = null): void
    {
        FacturaLog::create([
            'id_factura' => $factura->id_factura,
            'accion' => AccionFactura::EXPORTADA_JSON,
            'usuario' => 'sistema',
            'ip' => request()->ip(),
            'comentario' => 'Exportación JSON VeriFactu',
        ]);
    }
}
