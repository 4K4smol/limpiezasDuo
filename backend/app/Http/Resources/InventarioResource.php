<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id_item,
            'nombre_item'     => $this->nombre_item,
            'descripcion'     => $this->descripcion,
            'cantidad_actual' => $this->cantidad_actual,
            'stock_minimo'    => $this->stock_minimo,
            'unidad'          => $this->unidad,
            'ubicacion'       => $this->ubicacion,
            'activo'          => $this->activo,
            'created_at'      => $this->created_at,
        ];
    }
}
