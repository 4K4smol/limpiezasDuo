<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_cliente,
            'razon_social' => $this->razon_social,
            'cif' => $this->cif,
            'codigo_postal' => $this->codigo_postal,
            'ciudad' => $this->ciudad,
            'telefono' => $this->telefono,
            'email' => $this->email,
            'fecha_registro' => $this->fecha_registro,
            'activo' => $this->activo,
            'ubicaciones' => $this->ubicaciones,
            'created_at' => $this->created_at,
        ];
    }
}
