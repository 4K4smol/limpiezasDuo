<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServicioPeriodicoRequest\StoreServicioPeriodicoRequest;
use App\Http\Resources\ServicioPeriodicoResource;
use App\Models\ServicioPeriodico;
use App\Services\ServicioPeriodicoService;
use Illuminate\Support\Facades\DB;

class ServicioPeriodicoController extends Controller
{
    public function index()
    {
        return ServicioPeriodico::with([
            'cliente:id_cliente,razon_social',
            'programaciones.servicio:id_servicio,nombre',
            'programaciones.ubicacion:id_ubicacion,direccion'
        ])->activos()->paginate(10);
    }

    public function store(StoreServicioPeriodicoRequest $req)
    {
        $data = $req->validated();

        $contrato = DB::transaction(function () use ($data) {
            $sp = ServicioPeriodico::create([
                'id_cliente'           => $data['id_cliente'],
                'periodicidad_mensual' => $data['periodicidad_mensual'],
                'activo'               => $data['activo'] ?? true,
            ]);

            $sp->programaciones()->createMany($data['programaciones']);
            return $sp;
        });

        return new ServicioPeriodicoResource($contrato->load('programaciones'));
    }

    public function show(ServicioPeriodico $servicios_periodico)
    {
        return new ServicioPeriodicoResource(
            $servicios_periodico->load('programaciones')
        );
    }

    public function update(
        StoreServicioPeriodicoRequest $req,
        ServicioPeriodico $servicios_periodico
    ) {
        $data = $req->validated();

        DB::transaction(function () use ($servicios_periodico, $data) {
            $servicios_periodico->update($data);
            $servicios_periodico->programaciones()->delete();
            $servicios_periodico->programaciones()->createMany($data['programaciones']);
        });

        return new ServicioPeriodicoResource(
            $servicios_periodico->fresh()->load('programaciones')
        );
    }

    public function destroy(ServicioPeriodico $servicios_periodico)
    {
        $servicios_periodico->delete();
        return response()->noContent();
    }

    public function generarOrdenes(ServicioPeriodico $sp)
    {
        $ordenes = app(ServicioPeriodicoService::class)->generarOrdenesDesdeContrato($sp);
        return response()->json(['msg' => 'Órdenes generadas', 'ordenes' => $ordenes]);
    }
}
