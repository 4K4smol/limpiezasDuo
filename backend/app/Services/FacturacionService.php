<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Factura;
use App\Models\FacturaDetalle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

class FacturacionService
{
    // --- MÉTODO GENERAR FACTURA (SIN CAMBIOS SIGNIFICATIVOS, PERO USARÁ EL HELPER) ---
    public function generarFactura(
        int $idCliente,
        array $items,
        float $ivaPorcentaje,
        ?float $retencionPorcentaje = null,
        ?string $formaPago = null,
        ?Carbon $fechaEmision = null
    ): Factura {
        if (empty($items)) {
            throw new InvalidArgumentException('La lista de ítems no puede estar vacía.');
        }
        if (!Cliente::find($idCliente)) {
             throw new InvalidArgumentException("Cliente con ID {$idCliente} no encontrado.");
        }

        $fechaEmision = $fechaEmision ?? Carbon::now();

        // --- Usar el método helper para calcular totales ---
        $calculos = $this->_calcularTotalesDesdeItems($items, $ivaPorcentaje, $retencionPorcentaje);
        $detallesParaCrear = $calculos['detalles_preparados']; // Obtenemos detalles ya preparados
        // --- Fin cálculos ---

        $numeroFactura = $this->generarSiguienteNumeroFactura($fechaEmision->year);

        try {
            $factura = DB::transaction(function () use (
                $numeroFactura, $idCliente, $fechaEmision, $calculos, // Usamos el array de cálculos
                $ivaPorcentaje, $retencionPorcentaje, $formaPago, $detallesParaCrear
            ) {
                $facturaCreada = Factura::create([
                    'numero_factura' => $numeroFactura,
                    'id_cliente' => $idCliente,
                    'fecha_emision' => $fechaEmision,
                    'base_imponible' => $calculos['base_imponible'],
                    'iva_porcentaje' => $ivaPorcentaje,
                    'iva_importe' => $calculos['iva_importe'],
                    'retencion_porcentaje' => $retencionPorcentaje,
                    'retencion_importe' => $calculos['retencion_importe'] > 0 ? $calculos['retencion_importe'] : null,
                    'total_factura' => $calculos['total_factura'],
                    'forma_pago' => $formaPago,
                ]);

                $facturaCreada->detalles()->createMany($detallesParaCrear);

                return $facturaCreada;
            });

            return $factura;

        } catch (Throwable $e) {
            Log::error("Error al generar la factura: " . $e->getMessage(), [
                'exception' => $e,
                'datos_entrada' => compact('idCliente', 'items', 'ivaPorcentaje', 'retencionPorcentaje', 'formaPago', 'fechaEmision')
            ]);
            throw $e;
        }
    }

    // --- NUEVO MÉTODO ACTUALIZAR FACTURA ---
    /**
     * Actualiza una factura existente, incluyendo sus detalles (borrando los anteriores y creando los nuevos).
     * ¡IMPORTANTE! El array $datosValidados['items'] DEBE contener la lista completa y final de ítems.
     *
     * @param Factura $factura La instancia de la factura a actualizar.
     * @param array $datosValidados Datos validados del request. Debe incluir al menos:
     *                            'items' => array (con la estructura de detalle),
     *                            'iva_porcentaje' => float,
     *                            'retencion_porcentaje' => ?float
     *                            Y opcionalmente: 'id_cliente', 'fecha_emision', 'forma_pago'
     *
     * @return Factura La instancia de la factura actualizada.
     * @throws InvalidArgumentException Si los datos de entrada son inválidos.
     * @throws Throwable Si ocurre un error durante la actualización en la base de datos.
     */
    public function actualizarFactura(Factura $factura, array $datosValidados): Factura
    {
        // Validación básica de entrada específica para la actualización
        if (empty($datosValidados['items'])) {
            throw new InvalidArgumentException('La lista de ítems no puede estar vacía para actualizar.');
        }
        // Validar que el cliente existe si se intenta cambiar
        if (isset($datosValidados['id_cliente']) && !Cliente::find($datosValidados['id_cliente'])) {
            throw new InvalidArgumentException("Cliente con ID {$datosValidados['id_cliente']} no encontrado.");
       }

        $ivaPorcentaje = $datosValidados['iva_porcentaje'];
        $retencionPorcentaje = $datosValidados['retencion_porcentaje'] ?? null; // Usa el nuevo o null

        // --- Recalcular totales SIEMPRE basado en los NUEVOS ítems ---
        $calculos = $this->_calcularTotalesDesdeItems($datosValidados['items'], $ivaPorcentaje, $retencionPorcentaje);
        $detallesParaCrear = $calculos['detalles_preparados']; // Obtenemos detalles ya preparados
        // --- Fin recalculación ---

        try {
            // Usamos transacción para asegurar atomicidad (borrar detalles + actualizar cabecera + crear detalles)
            DB::transaction(function () use ($factura, $datosValidados, $calculos, $ivaPorcentaje, $retencionPorcentaje, $detallesParaCrear) {

                // 1. Actualizar la cabecera de la factura con datos validados y recalculados
                $factura->update([
                    // Campos que pueden venir del request
                    'id_cliente' => $datosValidados['id_cliente'] ?? $factura->id_cliente, // Mantener si no viene
                    'fecha_emision' => $datosValidados['fecha_emision'] ?? $factura->fecha_emision, // Mantener si no viene
                    'forma_pago' => $datosValidados['forma_pago'] ?? $factura->forma_pago, // Mantener si no viene

                    // Campos SIEMPRE recalculados o directamente del request validado
                    'iva_porcentaje' => $ivaPorcentaje,
                    'retencion_porcentaje' => $retencionPorcentaje, // Puede ser null

                    // Campos SIEMPRE recalculados
                    'base_imponible' => $calculos['base_imponible'],
                    'iva_importe' => $calculos['iva_importe'],
                    'retencion_importe' => $calculos['retencion_importe'] > 0 ? $calculos['retencion_importe'] : null,
                    'total_factura' => $calculos['total_factura'],

                    // NOTA: No actualizamos 'numero_factura' aquí generalmente.
                ]);

                // 2. Borrar TODOS los detalles existentes de la factura
                $factura->detalles()->delete();

                // 3. Crear los NUEVOS detalles basados en $datosValidados['items']
                $factura->detalles()->createMany($detallesParaCrear);

            }); // Fin de la transacción

            // Recargar la factura con las relaciones actualizadas para devolverla
            // Es importante hacerlo fuera de la transacción update()
            $factura->refresh()->load('cliente', 'detalles');

            return $factura;

        } catch (Throwable $e) {
             Log::error("Error al actualizar la factura {$factura->id_factura}: " . $e->getMessage(), [
                'exception' => $e,
                'datos_entrada' => $datosValidados // Loggear datos puede ser útil
            ]);
            // Relanzar para que el controlador la maneje
            throw $e;
        }
    }

    // --- MÉTODO HELPER PRIVADO PARA CALCULAR TOTALES ---
    /**
     * Calcula los importes totales a partir de un array de items y porcentajes.
     * También prepara el array de detalles listo para createMany.
     *
     * @param array $items Array de ítems ['descripcion_concepto', 'cantidad', 'precio_unitario']
     * @param float $ivaPorcentaje
     * @param float|null $retencionPorcentaje
     * @return array ['base_imponible', 'iva_importe', 'retencion_importe', 'total_factura', 'detalles_preparados']
     * @throws InvalidArgumentException
     */
    private function _calcularTotalesDesdeItems(array $items, float $ivaPorcentaje, ?float $retencionPorcentaje): array
    {
        $baseImponibleTotal = 0;
        $detallesPreparados = [];
        $ivaDecimal = $ivaPorcentaje / 100;
        $retencionDecimal = $retencionPorcentaje ? ($retencionPorcentaje / 100) : 0;

        foreach ($items as $item) {
            if (!isset($item['descripcion_concepto'], $item['cantidad'], $item['precio_unitario'])) {
                throw new InvalidArgumentException('Cada ítem debe contener descripcion_concepto, cantidad y precio_unitario.');
            }
            $cantidad = (int) $item['cantidad'];
            $precioUnitario = (float) $item['precio_unitario'];
            $subtotal = round($cantidad * $precioUnitario, 2); // Redondear subtotal a 2 decimales

            $baseImponibleTotal += $subtotal;

            // Preparamos los datos para FacturaDetalle
            $detallesPreparados[] = [
                'descripcion_concepto' => $item['descripcion_concepto'],
                'cantidad' => $cantidad,
                'precio_unitario' => $precioUnitario,
                'subtotal' => $subtotal,
                // 'id_factura' se añade automáticamente por createMany
            ];
        }

        // Redondear cálculos finales a 2 decimales para evitar problemas de precisión
        $baseImponibleTotal = round($baseImponibleTotal, 2);
        $ivaImporte = round($baseImponibleTotal * $ivaDecimal, 2);
        $retencionImporte = round($baseImponibleTotal * $retencionDecimal, 2);
        $totalFactura = round($baseImponibleTotal + $ivaImporte - $retencionImporte, 2);

        return [
            'base_imponible' => $baseImponibleTotal,
            'iva_importe' => $ivaImporte,
            'retencion_importe' => $retencionImporte,
            'total_factura' => $totalFactura,
            'detalles_preparados' => $detallesPreparados,
        ];
    }

    // --- MÉTODO GENERAR SIGUIENTE NÚMERO (SIN CAMBIOS) ---
    private function generarSiguienteNumeroFactura(int $year): string
    {
        $prefijo = $year . '-';
        $ultimaFactura = Factura::where('numero_factura', 'like', $prefijo . '%')
                                ->orderBy('numero_factura', 'desc')
                                ->lockForUpdate() // Añadir bloqueo para mayor seguridad en concurrencia
                                ->first();
        $siguienteNumero = 1;
        if ($ultimaFactura) {
            $ultimoNumero = (int) str_replace($prefijo, '', $ultimaFactura->numero_factura);
            $siguienteNumero = $ultimoNumero + 1;
        }
        return $prefijo . str_pad($siguienteNumero, 4, '0', STR_PAD_LEFT);
         // El bloqueo se libera al final de la transacción que llama a este método
    }
}
