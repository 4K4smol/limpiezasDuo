<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplejidadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'nivel' => $this->nivel,
            'descripcion' => $this->descripcion,
            'porcentaje' => $this->porcentaje,
            'plus_fijo' => $this->plus_fijo,
            'created_at' => $this->created_at,
        ];
    }
}
