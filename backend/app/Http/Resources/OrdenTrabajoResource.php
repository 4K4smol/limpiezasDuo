<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrdenTrabajoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_orden' => $this->id_orden,
            // Carga condicional de relaciones
            'cliente' => ClienteResource::make($this->whenLoaded('cliente')),
            'ubicacion' => UbicacionClienteResource::make($this->whenLoaded('ubicacion')),
            'empleado' => EmpleadoResource::make($this->whenLoaded('empleado')), // Manejará null automáticamente
            'fecha_creacion' => $this->fecha_creacion?->format('Y-m-d'),
            'fecha_programada' => $this->fecha_programada?->format('Y-m-d'),
            'hora_programada' => $this->hora_programada, // O formatear si es necesario H:i
            'estado' => $this->estado,
            'observaciones' => $this->observaciones,
            // Carga condicional de la colección de detalles
            'detalles' => OrdenTrabajoDetalleResource::collection($this->whenLoaded('detalles')),
            'creado' => $this->created_at?->toIso8601String(),
            'actualizado' => $this->updated_at?->toIso8601String(),
        ];
    }
}
