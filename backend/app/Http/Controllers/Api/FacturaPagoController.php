<?php
// backend/app/Http/Controllers/Api/FacturaPagoController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Services\PagoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;

class FacturaPagoController extends Controller
{
    public function registrar(Request $request, int $id, PagoService $svc): JsonResponse
    {
        $factura = Factura::findOrFail($id);

        $validated = $request->validate([
            'monto'      => ['required', 'numeric', 'min:0.01'],
            'fecha'      => ['nullable', 'date'],
            'metodo'     => ['nullable', 'string', 'max:100'],
            'referencia' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $pago = $svc->registrarPago($factura, $validated);
            return response()->json(['message' => 'Pago registrado correctamente', 'data' => $pago], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error interno al registrar el pago'], 500);
        }
    }
}
