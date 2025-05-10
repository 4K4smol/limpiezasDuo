<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServicioRequest\StoreServicioRequest;
use App\Http\Requests\ServicioRequest\UpdateServicioRequest;
use App\Http\Resources\ServicioResource;
use App\Models\Servicio;
use Illuminate\Http\JsonResponse;

class ServicioController extends Controller
{
    public function index(): JsonResponse
    {
        $servicios = Servicio::with('hijos')->whereNull('parent_id_servicio')->get();
        return response()->json(ServicioResource::collection($servicios));
    }

    public function store(StoreServicioRequest $request): JsonResponse
    {
        $servicio = Servicio::create($request->validated());
        return response()->json(new ServicioResource($servicio), 201);
    }

    public function show(Servicio $servicio): JsonResponse
    {
        $servicio->load('padre', 'hijos');
        return response()->json(new ServicioResource($servicio));
    }

    public function update(UpdateServicioRequest $request, Servicio $servicio): JsonResponse
    {
        $servicio->update($request->validated());
        return response()->json(new ServicioResource($servicio));
    }

    public function destroy(Servicio $servicio): JsonResponse
    {
        $servicio->delete();
        return response()->json(null, 204);
    }
}
