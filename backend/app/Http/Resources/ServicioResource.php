<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServicioResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id_servicio,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'precio_hora' => $this->precio_hora,
            'is_active' => $this->is_active,
            'padre' => $this->padre ? [
                'id' => $this->padre->id_servicio,
                'nombre' => $this->padre->nombre,
            ] : null,
            'hijos' => ServicioResource::collection($this->whenLoaded('hijos')),
        ];
    }
}
