<?php

namespace App\Http\Controllers\Api; // Asegúrate que el namespace sea correcto para tu estructura

use App\Http\Controllers\Controller;
use App\Http\Requests\FacturaRequest\StoreFacturaRequest;
use App\Http\Requests\FacturaRequest\UpdateFacturaRequest; // Asegúrate que existe y valida lo necesario para update
use App\Http\Resources\FacturaResource;
use App\Models\Factura;
use App\Services\FacturacionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection; // Necesario para la respuesta de paginación

class FacturaController extends Controller
{
    protected FacturacionService $facturacionService; // Tipado PHP 7.4+

    public function __construct(FacturacionService $facturacionService)
    {
        $this->facturacionService = $facturacionService;
        // Considera añadir middleware aquí si es necesario, ej: $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Muestra una lista paginada de facturas.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection // Cambiado tipo de retorno
    {
        // Usamos paginate para eficiencia y eager loading con el nombre correcto de la relación
        $facturas = Factura::with('cliente', 'detalles') // CORREGIDO: Asumiendo que la relación se llama 'detalles'
                           ->latest() // Ordena por fecha de creación descendente
                           ->paginate(15); // O el número que prefieras

        // FacturaResource::collection maneja automáticamente la estructura de paginación
        return FacturaResource::collection($facturas);
    }

    /**
     * Muestra una factura específica.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse // Tipado del parámetro ID
    {
        // Buscamos con eager loading y el nombre correcto de la relación
        $factura = Factura::with('cliente', 'detalles') // CORREGIDO: Asumiendo que la relación se llama 'detalles'
                          ->find($id);

        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        return response()->json(new FacturaResource($factura), 200);
    }

    /**
     * Almacena una nueva factura usando FacturacionService.
     *
     * @param StoreFacturaRequest $request
     * @return JsonResponse
     */
    public function store(StoreFacturaRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        try {
            // Delegamos la creación completa al servicio (esto ya estaba bien)
            $factura = $this->facturacionService->generarFactura(
                $validatedData['id_cliente'],
                $validatedData['items'], // El servicio debe saber cómo manejar este array
                $validatedData['iva_porcentaje'],
                $validatedData['retencion_porcentaje'] ?? null,
                $validatedData['forma_pago'] ?? null,
                // $validatedData['fecha_emision'] ?? null // Podrías añadir fecha si es necesario
            );

            // Devolvemos la nueva factura creada con código 201
            return response()->json(new FacturaResource($factura->load('cliente', 'detalles')), 201); // Eager load para respuesta completa

        } catch (\InvalidArgumentException $e) { // Capturar excepciones específicas si es posible
             Log::warning("Error de validación de negocio al crear factura: " . $e->getMessage());
             return response()->json(['message' => $e->getMessage()], 422); // 422 Unprocessable Entity
        } catch (Exception $e) {
            Log::error("Fallo al crear factura desde API: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error interno al generar la factura.'], 500);
        }
    }

    /**
     * Actualiza una factura existente usando FacturacionService.
     * ¡Requiere implementación del método actualizarFactura en el servicio!
     *
     * @param UpdateFacturaRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateFacturaRequest $request, int $id): JsonResponse // Tipado del parámetro ID
    {
        $factura = Factura::find($id);

        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        // --- CORRECCIÓN CLAVE ---
        // No usar $factura->update() directamente para lógica compleja.
        // Delegar la actualización al servicio para recalcular totales y manejar detalles si es necesario.
        // ¡¡DEBES IMPLEMENTAR FacturacionService::actualizarFactura!!
        //-------------------------

        $validatedData = $request->validated();

        try {
            // Llamamos al método del servicio que debe contener la lógica de negocio
            $facturaActualizada = $this->facturacionService->actualizarFactura($factura, $validatedData);

            // Devolvemos la factura actualizada
            return response()->json(new FacturaResource($facturaActualizada->load('cliente', 'detalles')), 200); // Eager load para respuesta completa

        } catch (\InvalidArgumentException $e) { // Capturar excepciones específicas si es posible
             Log::warning("Error de validación de negocio al actualizar factura {$id}: " . $e->getMessage());
             return response()->json(['message' => $e->getMessage()], 422); // 422 Unprocessable Entity
        } catch (Exception $e) {
            Log::error("Fallo al actualizar factura {$id}: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error interno al actualizar la factura.'], 500);
        }
    }

    /**
     * Elimina una factura.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse // Tipado del parámetro ID
    {
        $factura = Factura::find($id);

        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        try {
            // Considera si necesitas lógica de negocio antes de borrar (ej: no borrar facturas pagadas).
            // Si es así, crea y llama a un método en FacturacionService:
            // $this->facturacionService->eliminarFactura($factura);

            // Si el borrado simple es suficiente (confiando en cascade):
            $factura->delete();

            // CORREGIDO: Código de estado 204 para DELETE exitoso sin contenido en la respuesta.
            return response()->json(null, 204);

        } catch (Exception $e) {
            // Podrías tener excepciones si hay restricciones de BD (ej: Foreign Key si no usas cascade)
            Log::error("Fallo al eliminar factura {$id}: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error interno al eliminar la factura.'], 500);
        }
    }
}
