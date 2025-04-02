<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ComplejidadRequest;
use App\Http\Resources\ComplejidadResource;
use App\Models\Complejidad;

class ComplejidadController extends Controller
{
    public function index()
    {
        return ComplejidadResource::collection(Complejidad::all());
    }

    public function show($nivel)
    {
        return new ComplejidadResource(Complejidad::findOrFail($nivel));
    }

    public function store(ComplejidadRequest $request)
    {
        $complejidad = Complejidad::create($request->validated());
        return new ComplejidadResource($complejidad);
    }

    public function update(ComplejidadRequest $request, $nivel)
    {
        $complejidad = Complejidad::findOrFail($nivel);
        $complejidad->update($request->validated());
        return new ComplejidadResource($complejidad);
    }

    public function destroy($nivel)
    {
        $complejidad = Complejidad::findOrFail($nivel);
        $complejidad->delete();

        return response()->json(['message' => 'Eliminado correctamente.']);
    }
}
