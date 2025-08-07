<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicioPeriodicoProgramacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id_servicio_periodico_programacion,
            'id_servicio'     => $this->id_servicio,
            'servicio_nombre' => $this->servicio->nombre ?? null,
            'id_ubicacion'    => $this->id_ubicacion,
            'ubicacion'       => $this->ubicacion->direccion ?? null,
            'semana_mensual'  => $this->semana_mensual,
            'dia_hora'        => $this->dia_hora?->format('H:i'),
        ];
    }
}
