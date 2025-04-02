<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmpleadoRequest;
use App\Http\Resources\EmpleadoResource;
use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        $empleados = Empleado::when($request->has('activo'), fn($q) => $q->where('activo', $request->activo))->get();
        return EmpleadoResource::collection($empleados);
    }

    public function show($id)
    {
        return new EmpleadoResource(Empleado::findOrFail($id));
    }

    public function store(EmpleadoRequest $request)
    {
        $empleado = Empleado::create($request->validated());
        return new EmpleadoResource($empleado);
    }

    public function update(EmpleadoRequest $request, $id)
    {
        $empleado = Empleado::findOrFail($id);
        $empleado->update($request->validated());
        return new EmpleadoResource($empleado);
    }

    public function toggleActivo($id)
    {
        $empleado = Empleado::findOrFail($id);
        $empleado->activo = !$empleado->activo;
        $empleado->save();

        return response()->json([
            'message' => 'Estado de actividad actualizado.',
            'activo' => $empleado->activo
        ]);
    }
}
