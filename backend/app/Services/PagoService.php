<?php
// backend/app/Services/PagoService.php
namespace App\Services;

use App\Models\Factura;
use App\Models\Pago;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PagoService
{
    public function registrarPago(Factura $factura, array $datos): Pago
    {
        if ($factura->anulada) {
            throw new InvalidArgumentException("No se puede pagar una factura anulada.");
        }

        $monto = round(floatval($datos['monto']), 2);
        if ($monto <= 0) {
            throw new InvalidArgumentException("El monto debe ser mayor a 0.");
        }

        $totalPagado = $factura->importe_pagado + $monto;
        if ($totalPagado > $factura->total) {
            throw new InvalidArgumentException("El pago excede el total de la factura.");
        }

        return DB::transaction(function () use ($factura, $datos, $monto, $totalPagado) {
            $pago = $factura->pagos()->create([
                'fecha'     => $datos['fecha'] ?? now()->toDateString(),
                'monto'     => $monto,
                'metodo'    => $datos['metodo'] ?? 'desconocido',
                'referencia' => $datos['referencia'] ?? null,
            ]);

            $factura->importe_pagado = $totalPagado;

            if ($totalPagado == $factura->total) {
                $factura->estado_pago = 'pagado';
            } elseif ($totalPagado > 0) {
                $factura->estado_pago = 'parcial';
            } else {
                $factura->estado_pago = 'pendiente';
            }

            $factura->save();

            return $pago;
        });
    }
}
