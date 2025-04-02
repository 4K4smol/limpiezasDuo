<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmpleadoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id_empleado,
            'nombre'     => $this->nombre,
            'dni'        => $this->dni,
            'telefono'   => $this->telefono,
            'email'      => $this->email,
            'puesto'     => $this->puesto,
            'fecha_alta' => $this->fecha_alta,
            'activo'     => $this->activo,
            'created_at' => $this->created_at,
        ];
    }
}
