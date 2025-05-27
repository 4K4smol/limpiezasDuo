<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicioPeriodicoResource extends JsonResource
{
    public function toArray($req): array
    {
        return [
            'id'          => $this->id,
            'cliente'     => $this->cliente->only('id_cliente','razon_social'),
            'periodicidad'=> $this->periodicidad_mensual->value,
            'activo'      => $this->activo,
            'programaciones' => $this->programaciones->map(function ($p) {
                return [
                    'id_servicio'    => $p->id_servicio,
                    'servicio'       => $p->servicio->nombre,
                    'id_ubicacion'   => $p->id_ubicacion,
                    'direccion'      => $p->ubicacion->direccion,
                    'semana_mensual' => $p->semana_mensual,
                    'dia_hora'       => $p->dia_hora->format('H:i'),
                    'dia_semana'     => $p->dia_semana, // accessor
                ];
            }),
        ];
    }
}
