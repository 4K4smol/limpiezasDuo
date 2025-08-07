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
            'cliente' => ClienteResource::make($this->whenLoaded('cliente')),
            'ubicacion' => UbicacionClienteResource::make($this->whenLoaded('ubicacion')),
            'empleado' => EmpleadoResource::make($this->whenLoaded('empleado')),
            'fecha_creacion' => $this->fecha_creacion?->format('Y-m-d'),
            'fecha_programada' => $this->fecha_programada?->format('Y-m-d'),
            'hora_programada' => $this->hora_programada,
            'estado' => $this->estado,
            'observaciones' => $this->observaciones,
            'detalles' => OrdenTrabajoDetalleResource::collection($this->whenLoaded('detalles')),

            // NUEVOS CAMPOS PARA AGRUPACIÓN
            'id_servicio_periodico' => $this->id_servicio_periodico,
            'servicio_periodico' => $this->whenLoaded('servicioPeriodico', fn() => [
                'id' => $this->servicioPeriodico->id_servicio_periodico,
                'nombre' => $this->servicioPeriodico->servicio->nombre ?? null,
                'cliente_id' => $this->servicioPeriodico->id_cliente,
            ]),

            'creado' => $this->created_at?->toIso8601String(),
            'actualizado' => $this->updated_at?->toIso8601String(),
        ];
    }
}
