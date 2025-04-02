<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServicioResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id_servicio' => $this->id_servicio,
            'nombre' => $this->nombre_servicio,
            'descripcion' => $this->descripcion,
            'precio_hora' => (float) $this->precio_hora,
            'activo' => (bool) $this->activo,
            'creado_en' => $this->created_at?->toIso8601String(),
            'actualizado_en' => $this->updated_at?->toIso8601String(),

            // Si es hijo, mostrar ID del padre
            'servicio_padre_id' => $this->servicio_padre_id,
        ];
    }
}
