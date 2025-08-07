<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServicioPeriodicoRequest\StoreServicioPeriodicoRequest;
use App\Http\Resources\ServicioPeriodicoResource;
use App\Models\ServicioPeriodico;
use App\Services\ServicioPeriodicoService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ServicioPeriodicoController extends Controller
{
    public function index(): JsonResponse
    {
        $contratos = ServicioPeriodico::with([
            'cliente:id_cliente,razon_social',
            'programaciones.servicio:id_servicio,nombre',
            'programaciones.ubicacion:id_ubicacion,direccion'
        ])->activos()->paginate(10);

        return response()->json(ServicioPeriodicoResource::collection($contratos));
    }

    public function store(StoreServicioPeriodicoRequest $request): JsonResponse
    {
        $data = $request->validated();

        $contrato = DB::transaction(function () use ($data) {
            $sp = ServicioPeriodico::create([
                'id_cliente' => $data['id_cliente'],
                'periodicidad_mensual' => $data['periodicidad_mensual'],
                'activo' => $data['activo'] ?? true,
            ]);
            $sp->programaciones()->createMany($data['programaciones']);
            return $sp;
        });

        return response()->json(new ServicioPeriodicoResource(
            $contrato->load('cliente', 'programaciones.servicio', 'programaciones.ubicacion')
        ), 201);
    }

    public function show(int $id): JsonResponse
    {
        $sp = ServicioPeriodico::with(['cliente', 'programaciones.servicio', 'programaciones.ubicacion'])
            ->findOrFail($id);

        return response()->json(new ServicioPeriodicoResource($sp));
    }

    public function update(StoreServicioPeriodicoRequest $request, int $id): JsonResponse
    {
        $sp = ServicioPeriodico::findOrFail($id);
        $data = $request->validated();

        DB::transaction(function () use ($sp, $data) {
            $sp->update([
                'id_cliente' => $data['id_cliente'],
                'periodicidad_mensual' => $data['periodicidad_mensual'],
                'activo' => $data['activo'] ?? true,
            ]);
            $sp->programaciones()->delete();
            $sp->programaciones()->createMany($data['programaciones']);
        });

        return response()->json(new ServicioPeriodicoResource(
            $sp->fresh()->load('cliente', 'programaciones.servicio', 'programaciones.ubicacion')
        ));
    }

    public function generarOrdenes(ServicioPeriodico $sp): JsonResponse
    {
        $ordenes = app(ServicioPeriodicoService::class)->generarOrdenesDesdeContrato($sp);

        return response()->json(['msg' => 'Órdenes generadas', 'ordenes' => $ordenes]);
    }
}
