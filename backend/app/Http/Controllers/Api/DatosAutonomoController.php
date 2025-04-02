<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDatosAutonomoRequest;
use App\Models\DatosAutonomo;
use Illuminate\Http\JsonResponse;

class DatosAutonomoController extends Controller
{
    public function show(): JsonResponse
    {
        $datos = DatosAutonomo::first(); // solo hay uno
        return response()->json($datos);
    }

    public function update(UpdateDatosAutonomoRequest $request): JsonResponse
    {
        $datos = DatosAutonomo::firstOrFail();
        $datos->update($request->validated());
        return response()->json($datos);
    }
}
