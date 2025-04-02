<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrdenTrabajoDetalleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_detalle' => $this->id_detalle,
            // Carga condicional del servicio relacionado
            'servicio' => ServicioResource::make($this->whenLoaded('servicio')),
            'horas_realizadas' => (float) $this->horas_realizadas,
            'precio_hora' => (float) $this->precio_hora,
            'plus_complejidad' => (float) $this->plus_complejidad,
            'precio_total' => (float) $this->precio_total,
            'creado' => $this->created_at?->toIso8601String(),
            'actualizado' => $this->updated_at?->toIso8601String(),
        ];
    }
}
