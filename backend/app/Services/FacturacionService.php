<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Factura;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
        $cliente = Cliente::findOrFail($idCliente);
        if (empty($items)) {
            throw new InvalidArgumentException('La factura debe tener al menos un ítem.');
        }

        $fechaEmision = $fechaEmision ?? Carbon::now();
        $numeroFactura = $this->generarNumeroFactura($fechaEmision->year);
        $totales = $this->calcularTotales($items, $ivaPorcentaje, $retencionPorcentaje);

        return DB::transaction(function () use (
            $cliente,
            $numeroFactura,
            $fechaEmision,
            $formaPago,
            $ivaPorcentaje,
            $retencionPorcentaje,
            $totales
        ) {
            $factura = Factura::create([
                'serie' => 'A',
                'numero_factura' => $numeroFactura,
                'id_cliente' => $cliente->id_cliente,
                'fecha_emision' => $fechaEmision,
                'base_imponible' => $totales['base_imponible'],
                'iva_porcentaje' => $ivaPorcentaje,
                'iva_importe' => $totales['iva_importe'],
                'retencion_porcentaje' => $retencionPorcentaje,
                'retencion_importe' => $totales['retencion_importe'] ?: null,
                'total_factura' => $totales['total_factura'],
                'forma_pago' => $formaPago,
                'hash_factura' => $this->generarHashFactura($numeroFactura, $totales),
            ]);

            $factura->detalles()->createMany($totales['detalles']);
            return $factura->load('cliente', 'detalles');
        });
    }

    /**
     * Actualiza una factura existente y reemplaza sus ítems.
     */
    public function actualizarFactura(Factura $factura, array $datos): Factura
    {
        if (empty($datos['items'])) {
            throw new InvalidArgumentException('Debe haber ítems para actualizar la factura.');
        }

        $clienteId = $datos['id_cliente'] ?? $factura->id_cliente;
        Cliente::findOrFail($clienteId);

        $fechaEmision = isset($datos['fecha_emision']) ? Carbon::parse($datos['fecha_emision']) : $factura->fecha_emision;
        $iva = (float) $datos['iva_porcentaje'];
        $retencion = isset($datos['retencion_porcentaje']) ? (float) $datos['retencion_porcentaje'] : null;

        $totales = $this->calcularTotales($datos['items'], $iva, $retencion);

        return DB::transaction(function () use (
            $factura,
            $datos,
            $clienteId,
            $fechaEmision,
            $iva,
            $retencion,
            $totales
        ) {
            $factura->update([
                'id_cliente' => $clienteId,
                'fecha_emision' => $fechaEmision,
                'forma_pago' => $datos['forma_pago'] ?? $factura->forma_pago,
                'iva_porcentaje' => $iva,
                'retencion_porcentaje' => $retencion,
                'base_imponible' => $totales['base_imponible'],
                'iva_importe' => $totales['iva_importe'],
                'retencion_importe' => $totales['retencion_importe'] ?: null,
                'total_factura' => $totales['total_factura'],
                'hash_factura' => $this->generarHashFactura($factura->numero_factura, $totales),
            ]);

            $factura->detalles()->delete();
            $factura->detalles()->createMany($totales['detalles']);

            return $factura->refresh()->load('cliente', 'detalles');
        });
    }

    /**
    * Anula una factura si aún no ha sido anulada.
    *
    * @param Factura $factura La instancia de la factura a anular.
    * @return Factura La factura anulada.
    * @throws InvalidArgumentException Si la factura ya está anulada.
    */
    public function anularFactura(Factura $factura): Factura
    {
        if ($factura->anulada) {
            throw new InvalidArgumentException("La factura ya está anulada.");
        }

        return DB::transaction(function () use ($factura) {
            $factura->anulada = true;
            $factura->hash_anterior = $factura->hash; // guardamos el hash previo
            $factura->hash = null; // puede regenerarse si se desea
            $factura->save();

            return $factura;
        });
    }


    /**
     * Calcula totales y estructura los detalles de la factura.
     */
    private function calcularTotales(array $items, float $ivaPorcentaje, ?float $retencionPorcentaje = null): array
    {
        $base = 0;
        $detalles = [];

        foreach ($items as $item) {
            $descripcion = $item['descripcion_concepto'] ?? null;
            $cantidad = (int) ($item['cantidad'] ?? 0);
            $precio = (float) ($item['precio_unitario'] ?? 0);

            if (!$descripcion || $cantidad <= 0 || $precio < 0) {
                throw new InvalidArgumentException('Cada ítem debe tener descripción, cantidad > 0 y precio >= 0.');
            }

            $subtotal = round($cantidad * $precio, 2);
            $base += $subtotal;

            $detalles[] = [
                'descripcion_concepto' => $descripcion,
                'cantidad' => $cantidad,
                'precio_unitario' => $precio,
                'subtotal' => $subtotal,
                'iva_porcentaje' => $ivaPorcentaje,
                'iva_importe' => round($subtotal * ($ivaPorcentaje / 100), 2),
                'total_linea' => round($subtotal * (1 + $ivaPorcentaje / 100), 2),
            ];
        }

        $base = round($base, 2);
        $iva = round($base * ($ivaPorcentaje / 100), 2);
        $retencion = $retencionPorcentaje ? round($base * ($retencionPorcentaje / 100), 2) : 0;
        $total = round($base + $iva - $retencion, 2);

        return [
            'base_imponible' => $base,
            'iva_importe' => $iva,
            'retencion_importe' => $retencion,
            'total_factura' => $total,
            'detalles' => $detalles,
        ];
    }

    /**
     * Genera número de factura correlativo anual (formato: 2025-0001).
     */
    private function generarNumeroFactura(int $year): string
    {
        $prefijo = $year . '-';

        $ultima = Factura::where('numero_factura', 'like', "{$prefijo}%")
            ->orderByDesc('numero_factura')
            ->lockForUpdate()
            ->first();

        $next = $ultima
            ? (int) str_replace($prefijo, '', $ultima->numero_factura) + 1
            : 1;

        return $prefijo . str_pad($next, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Genera un hash SHA-256 para garantizar integridad de factura.
     */
    private function generarHashFactura(string $numero, array $totales): string
    {
        $data = [
            $numero,
            $totales['base_imponible'],
            $totales['iva_importe'],
            $totales['retencion_importe'],
            $totales['total_factura'],
        ];

        return hash('sha256', implode('|', $data));
    }
}
