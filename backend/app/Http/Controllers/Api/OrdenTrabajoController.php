<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrdenTrabajo;
use App\Models\Servicio; // Necesario para obtener precios
use App\Http\Requests\OrdenTrabajoRequest\StoreOrdenTrabajoRequest;
use App\Http\Requests\OrdenTrabajoRequest\UpdateOrdenTrabajoRequest;
use App\Http\Resources\OrdenTrabajoResource;
use Illuminate\Http\Request; // Añadido para el index
use Illuminate\Http\Response; // Añadido para destroy
use Illuminate\Support\Facades\DB; // Para transacciones
use Illuminate\Support\Facades\Log; // Para logging de errores

class OrdenTrabajoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Carga básica de relaciones para la lista
        $ordenes = OrdenTrabajo::with(['cliente:id_cliente,nombre', 'ubicacion:id_ubicacion,direccion', 'empleado:id_empleado,nombre'])
                    // TODO: Añadir filtros opcionales según parámetros de $request
                    // ej: ->when($request->estado, fn($q, $estado) => $q->where('estado', $estado))
                    // ej: ->when($request->cliente_id, fn($q, $id) => $q->where('id_cliente', $id))
                    ->latest('fecha_creacion') // Ordenar por creación descendente
                    ->paginate(15); // O $request->input('per_page', 15)

        return OrdenTrabajoResource::collection($ordenes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrdenTrabajoRequest $request)
    {
        // Obtener datos validados (excluyendo 'detalles' para la creación principal)
        $validatedOrden = $request->safe()->except('detalles');
        $validatedDetalles = $request->safe()->only('detalles')['detalles'];

        // Valor por defecto si no se proporciona el estado
        $validatedOrden['estado'] = $validatedOrden['estado'] ?? 'Pendiente';
        $validatedOrden['fecha_creacion'] = now()->toDateString();

        // Iniciar transacción para asegurar la integridad
        DB::beginTransaction();
        try {
            // Crear la orden de trabajo principal
            $ordenTrabajo = OrdenTrabajo::create($validatedOrden);

            // Crear los detalles
            foreach ($validatedDetalles as $detalleData) {
                // Obtener precio/hora del servicio base (importante)
                $servicio = Servicio::find($detalleData['id_servicio']);
                if (!$servicio) {
                    // Esto no debería pasar por la validación, pero por si acaso
                    throw new \Exception("Servicio con ID {$detalleData['id_servicio']} no encontrado.");
                }

                // Crear detalle asociándolo a la orden creada
                $ordenTrabajo->detalles()->create([
                    'id_servicio' => $detalleData['id_servicio'],
                    'horas_realizadas' => $detalleData['horas_realizadas'] ?? 1.00, // Valor por defecto
                    'precio_hora' => $servicio->precio_hora, // Copia el precio actual del servicio
                    'plus_complejidad' => 0.00, // Valor inicial, puede calcularse después
                    'precio_total' => ($servicio->precio_hora * ($detalleData['horas_realizadas'] ?? 1.00)) + 0.00, // Cálculo inicial
                ]);
            }

            // Confirmar la transacción
            DB::commit();

            // Cargar relaciones para la respuesta
            $ordenTrabajo->load(['cliente', 'ubicacion', 'empleado', 'detalles.servicio']);

             return response()->json([
                'message' => 'Orden de trabajo creada exitosamente.',
                'data' => OrdenTrabajoResource::make($ordenTrabajo)
             ], 201); // Código 201 Created

        } catch (\Throwable $e) {
            // Revertir transacción en caso de error
            DB::rollBack();
            Log::error("Error al crear orden de trabajo: {$e->getMessage()}"); // Loguear el error
            return response()->json([
                'message' => 'Error al crear la orden de trabajo.',
                'error' => $e->getMessage() // Proporcionar más detalles en desarrollo
            ], 500); // Internal Server Error
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(OrdenTrabajo $ordenTrabajo) // Usa Route Model Binding
    {
         // Cargar todas las relaciones necesarias para la vista detallada
        $ordenTrabajo->load(['cliente', 'ubicacion', 'empleado', 'detalles.servicio']);
        return OrdenTrabajoResource::make($ordenTrabajo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrdenTrabajoRequest $request, OrdenTrabajo $ordenTrabajo)
    {
        // Obtener datos validados para actualizar la orden principal
        $validatedData = $request->validated();

        // TODO: Implementar lógica más compleja si se permite actualizar detalles aquí.
        // Por ahora, solo actualizamos los campos principales de la orden.

        try {
            $ordenTrabajo->update($validatedData);

            // Recargar relaciones por si algo cambió (ej. empleado)
             $ordenTrabajo->load(['cliente', 'ubicacion', 'empleado', 'detalles.servicio']);

            return response()->json([
                'message' => 'Orden de trabajo actualizada exitosamente.',
                'data' => OrdenTrabajoResource::make($ordenTrabajo)
             ]);

        } catch (\Throwable $e) {
             Log::error("Error al actualizar orden de trabajo {$ordenTrabajo->id_orden}: {$e->getMessage()}");
            return response()->json([
                'message' => 'Error al actualizar la orden de trabajo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrdenTrabajo $ordenTrabajo)
    {
        try {
             $ordenTrabajo->delete(); // Las FK con onDelete('cascade') borrarán detalles
             return response()->json(['message' => 'Orden de trabajo eliminada exitosamente.'], Response::HTTP_OK); // O HTTP_NO_CONTENT (204) sin body
        } catch (\Throwable $e) {
             Log::error("Error al eliminar orden de trabajo {$ordenTrabajo->id_orden}: {$e->getMessage()}");
             // Considerar si hay restricciones que impidan borrar (ej. facturada)
            return response()->json([
                'message' => 'Error al eliminar la orden de trabajo.',
                'error' => $e->getMessage() // Podría ser un error de restricción FK si onDelete no es CASCADE
            ], 500);
        }
    }
}
