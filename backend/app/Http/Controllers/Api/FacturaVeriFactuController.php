<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Services\FacturacionVeriFactuService;

class FacturaVeriFactuController extends Controller
{
    public function exportarJson($id, FacturacionVeriFactuService $verifactu)
    {
        $factura = Factura::with(['cliente', 'detalles'])->findOrFail($id);
        $ruta = $verifactu->exportarFacturaJson($factura);

        return response()->json([
            'success' => true,
            'archivo' => $ruta
        ]);
    }
}
