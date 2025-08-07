<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Http\Resources\ServicioPeriodicoProgramacionResource;

class ServicioPeriodicoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_servicio_periodico' => $this->id_servicio_periodico,
            'cliente' => ClienteResource::make($this->whenLoaded('cliente')),
            'periodicidad_mensual' => $this->periodicidad_mensual->value,
            'frecuencia' => $this->frecuencia,
            'activo' => $this->activo,
            'programaciones' => ServicioPeriodicoProgramacionResource::collection($this->whenLoaded('programaciones')),
            'creado' => $this->created_at?->toIso8601String(),
            'actualizado' => $this->updated_at?->toIso8601String(),
        ];
    }
}
