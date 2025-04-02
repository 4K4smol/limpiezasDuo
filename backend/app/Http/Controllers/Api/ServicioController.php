<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use App\Http\Requests\ServicioRequest\StoreServicioRequest;
use App\Http\Requests\ServicioRequest\UpdateServicioRequest;
use App\Http\Resources\ServicioResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ServicioController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query('hierarchy') === 'true') {
            $servicios = Servicio::with('subservicios')
                ->whereNull('servicio_padre_id')
                ->where('activo', 1)
                ->orderBy('nombre_servicio')
                ->get();

            return ServicioResource::collection($servicios);
        }

        if ($request->query('all') === 'true') {
            return ServicioResource::collection(
                Servicio::where('activo', true)->orderBy('nombre_servicio')->get()
            );
        }

        if ($request->query('all_with_inactive') === 'true') {
            return ServicioResource::collection(
                Servicio::orderBy('nombre_servicio')->get()
            );
        }

        return ServicioResource::collection(
            Servicio::orderBy('nombre_servicio')->paginate($request->input('per_page', 15))
        );
    }

    public function store(StoreServicioRequest $request)
    {
        try {
            $data = $request->validated();
            $data['activo'] = $data['activo'] ?? true;

            $servicio = Servicio::create($data);

            return response()->json([
                'message' => 'Servicio creado exitosamente.',
                'data' => new ServicioResource($servicio)
            ], Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            Log::error("Error al crear servicio: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear el servicio.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Servicio $servicio)
    {
        $servicio->load('subservicios');

        return new ServicioResource($servicio);
    }

    public function update(UpdateServicioRequest $request, Servicio $servicio)
    {
        try {
            $servicio->update($request->validated());

            return response()->json([
                'message' => 'Servicio actualizado exitosamente.',
                'data' => new ServicioResource($servicio->fresh())
            ]);
        } catch (\Throwable $e) {
            Log::error("Error al actualizar servicio {$servicio->id_servicio}: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al actualizar el servicio.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Servicio $servicio)
    {
        try {
            $servicio->delete();

            return response()->json([
                'message' => 'Servicio eliminado exitosamente.'
            ]);
        } catch (\Throwable $e) {
            Log::error("Error al eliminar servicio {$servicio->id_servicio}: " . $e->getMessage());
            return response()->json([
                'message' => 'Error al eliminar el servicio.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
