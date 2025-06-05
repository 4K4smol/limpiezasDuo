<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Factura;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

class FacturacionService
{
    /**
     * Crea una nueva factura y sus detalles.
     */
    public function generarFactura(
        int $idCliente,
        array $items,
        float $ivaPorcentaje,
        ?float $retencionPorcentaje = null,
        ?string $formaPago = null,
        ?Carbon $fechaEmision = null
    ): Factura {
        $cliente = Cliente::find($idCliente);
        if (!$cliente) {
            throw new InvalidArgumentException("Cliente con ID {$idCliente} no encontrado.");
        }

        if (empty($items)) {
            throw new InvalidArgumentException('La lista de ítems no puede estar vacía.');
        }

        $fechaEmision = $fechaEmision ?? Carbon::now();
        $numeroFactura = $this->generarSiguienteNumeroFactura($fechaEmision->year);

        $calculos = $this->calcularTotales($items, $ivaPorcentaje, $retencionPorcentaje);

        try {
            return DB::transaction(function () use (
                $numeroFactura, $cliente, $fechaEmision, $ivaPorcentaje,
                $retencionPorcentaje, $formaPago, $calculos
            ) {
                $factura = Factura::create([
                    'numero_factura' => $numeroFactura,
                    'id_cliente' => $cliente->id_cliente,
                    'fecha_emision' => $fechaEmision,
                    'base_imponible' => $calculos['base_imponible'],
                    'iva_porcentaje' => $ivaPorcentaje,
                    'iva_importe' => $calculos['iva_importe'],
                    'retencion_porcentaje' => $retencionPorcentaje,
                    'retencion_importe' => $calculos['retencion_importe'] ?: null,
                    'total_factura' => $calculos['total_factura'],
                    'forma_pago' => $formaPago,
                ]);

                $factura->detalles()->createMany($calculos['detalles']);

                return $factura;
            });
        } catch (Throwable $e) {
            Log::error("Error al generar la factura: {$e->getMessage()}", [
                'datos' => compact('idCliente', 'items', 'ivaPorcentaje', 'retencionPorcentaje', 'formaPago'),
                'exception' => $e
            ]);
            throw $e;
        }
    }

    /**
     * Actualiza una factura existente, reemplazando sus detalles.
     */
    public function actualizarFactura(Factura $factura, array $datos): Factura
    {
        if (empty($datos['items'])) {
            throw new InvalidArgumentException('La lista de ítems no puede estar vacía para actualizar.');
        }

        if (isset($datos['id_cliente']) && !Cliente::find($datos['id_cliente'])) {
            throw new InvalidArgumentException("Cliente con ID {$datos['id_cliente']} no encontrado.");
        }

        $calculos = $this->calcularTotales(
            $datos['items'],
            $datos['iva_porcentaje'],
            $datos['retencion_porcentaje'] ?? null
        );

        try {
            DB::transaction(function () use ($factura, $datos, $calculos) {
                $factura->update([
                    'id_cliente' => $datos['id_cliente'] ?? $factura->id_cliente,
                    'fecha_emision' => $datos['fecha_emision'] ?? $factura->fecha_emision,
                    'forma_pago' => $datos['forma_pago'] ?? $factura->forma_pago,
                    'iva_porcentaje' => $datos['iva_porcentaje'],
                    'retencion_porcentaje' => $datos['retencion_porcentaje'] ?? null,
                    'base_imponible' => $calculos['base_imponible'],
                    'iva_importe' => $calculos['iva_importe'],
                    'retencion_importe' => $calculos['retencion_importe'] ?: null,
                    'total_factura' => $calculos['total_factura'],
                ]);

                $factura->detalles()->delete();
                $factura->detalles()->createMany($calculos['detalles']);
            });

            return $factura->refresh()->load('cliente', 'detalles');
        } catch (Throwable $e) {
            Log::error("Error al actualizar factura {$factura->id_factura}: {$e->getMessage()}", [
                'datos' => $datos,
                'exception' => $e
            ]);
            throw $e;
        }
    }

    /**
     * Calcula totales y prepara detalles de factura.
     */
    private function calcularTotales(array $items, float $ivaPorcentaje, ?float $retencionPorcentaje = null): array
    {
        $base = 0;
        $detalles = [];

        foreach ($items as $item) {
            if (!isset($item['descripcion_concepto'], $item['cantidad'], $item['precio_unitario'])) {
                throw new InvalidArgumentException('Cada ítem debe tener descripción, cantidad y precio.');
            }

            $cantidad = (int) $item['cantidad'];
            $precio = (float) $item['precio_unitario'];

            if ($cantidad <= 0 || $precio < 0) {
                throw new InvalidArgumentException("Cantidad o precio inválido en ítem: {$item['descripcion_concepto']}");
            }

            $subtotal = round($cantidad * $precio, 2);
            $base += $subtotal;

            $detalles[] = [
                'descripcion_concepto' => $item['descripcion_concepto'],
                'cantidad' => $cantidad,
                'precio_unitario' => $precio,
                'subtotal' => $subtotal,
            ];
        }

        $iva = round($base * ($ivaPorcentaje / 100), 2);
        $retencion = $retencionPorcentaje ? round($base * ($retencionPorcentaje / 100), 2) : 0;
        $total = round($base + $iva - $retencion, 2);

        return [
            'base_imponible' => round($base, 2),
            'iva_importe' => $iva,
            'retencion_importe' => $retencion,
            'total_factura' => $total,
            'detalles' => $detalles,
        ];
    }

    /**
     * Genera el número secuencial de factura para el año actual.
     */
    private function generarSiguienteNumeroFactura(int $year): string
    {
        $prefijo = $year . '-';

        $ultima = Factura::where('numero_factura', 'like', "{$prefijo}%")
            ->orderByDesc('numero_factura')
            ->lockForUpdate()
            ->first();

        $siguiente = $ultima
            ? (int) str_replace($prefijo, '', $ultima->numero_factura) + 1
            : 1;

        return $prefijo . str_pad($siguiente, 4, '0', STR_PAD_LEFT);
    }
}
