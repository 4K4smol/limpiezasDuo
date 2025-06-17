<?php

namespace App\Http\Controllers\Api;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Http\Controllers\Controller;
use App\Http\Requests\FacturaRequest\StoreFacturaRequest;
use App\Http\Requests\FacturaRequest\UpdateFacturaRequest;
use App\Http\Resources\FacturaResource;
use App\Models\Factura;
use App\Services\FacturacionService;

class FacturaController extends Controller
{
    protected FacturacionService $facturacionService;

    public function __construct(FacturacionService $facturacionService)
    {
        $this->facturacionService = $facturacionService;
        // $this->middleware('auth:sanctum'); // activa si lo necesitas
    }

    /**
     * Listado paginado de facturas.
     */
    public function index(): AnonymousResourceCollection
    {
        $facturas = Factura::with('cliente', 'detalles')
            ->latest()
            ->paginate(15);

        return FacturaResource::collection($facturas);
    }

    /**
     * Ver una factura concreta.
     */
    public function show(int $id): JsonResponse
    {
        $factura = Factura::with('cliente', 'detalles')->find($id);

        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        return response()->json(new FacturaResource($factura), 200);
    }

    /**
     * Crear una nueva factura.
     */
    public function store(StoreFacturaRequest $request): JsonResponse
    {
        $validated = $request->validated();
        // dd($validated);
        try {
            $factura = $this->facturacionService->generarFactura(
                idCliente: $validated['id_cliente'],
                items: $validated['items'],
                ivaPorcentaje: $validated['iva_porcentaje'],
                retencionPorcentaje: $validated['retencion_porcentaje'] ?? null,
                formaPago: $validated['forma_pago'] ?? null,
                fechaEmision: $validated['fecha_emision'] ?? null
            );

            return response()->json(new FacturaResource($factura), 201);
        } catch (\InvalidArgumentException $e) {
            Log::warning("Error al crear factura: " . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            Log::error("Fallo al crear factura: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error interno al generar la factura.'], 500);
        }
    }

    /**
     * Actualizar una factura existente.
     */
    public function update(UpdateFacturaRequest $request, int $id): JsonResponse
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        if ($factura->anulada) {
           throw new \InvalidArgumentException("No se puede modificar o pagar una factura anulada.");
        }

        try {
            $facturaActualizada = $this->facturacionService->actualizarFactura($factura, $request->validated());
            return response()->json(new FacturaResource($facturaActualizada), 200);
        } catch (\InvalidArgumentException $e) {
            Log::warning("Error al actualizar factura {$id}: " . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            Log::error("Fallo al actualizar factura {$id}: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error interno al actualizar la factura.'], 500);
        }
    }

    /**
     * Eliminar una factura.
     */
    public function destroy(int $id): JsonResponse
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        try {
            $factura->delete();
            return response()->json(null, 204);
        } catch (Exception $e) {
            Log::error("Error al eliminar factura {$id}: " . $e->getMessage());
            return response()->json(['message' => 'Error interno al eliminar la factura.'], 500);
        }
    }

    /**
     * Descargar la factura como PDF.
     */
    public function descargar(int $id): Response
    {
        $factura = Factura::with('cliente', 'detalles')->findOrFail($id);
        $pdf = Pdf::loadView('facturas.pdf', compact('factura'));
        return $pdf->download("factura-{$factura->numero_factura}.pdf");
    }

    /**
     * Anula una factura mediante el servicio de facturación.
     *
     * @param int $id ID de la factura a anular.
     * @param FacturacionService $svc Servicio encargado de procesar la anulación.
     * @return JsonResponse Respuesta JSON con el resultado de la operación.
     */
    public function anular(int $id, FacturacionService $svc): JsonResponse
    {
        $factura = Factura::findOrFail($id);

        try {
            $anulada = $svc->anularFactura($factura);
            return response()->json([
                'message' => 'Factura anulada correctamente',
                'data'    => $anulada,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error al anular la factura'], 500);
        }
    }
}
