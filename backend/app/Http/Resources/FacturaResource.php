<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_factura'      => $this->id_factura,
            'numero_factura'  => $this->numero_factura,
            'cliente'         => ClienteResource::make($this->whenLoaded('cliente')),
            'detalles'        => FacturaDetalleResource::collection($this->whenLoaded('detalles')),
            'fecha_emision'   => $this->fecha_emision?->format('Y-m-d'),
            'base_imponible'  => (float) $this->base_imponible,
            'iva_porcentaje'  => (float) $this->iva_porcentaje,
            'iva_importe'     => (float) $this->iva_importe,
            'retencion_porcentaje' => $this->retencion_porcentaje !== null ? (float) $this->retencion_porcentaje : null,
            'retencion_importe'    => $this->retencion_importe !== null ? (float) $this->retencion_importe : null,
            'total_factura'   => (float) $this->total_factura,
            'forma_pago'      => $this->forma_pago,
            'anulada'         => (bool) $this->anulada,
            'creado'          => $this->created_at?->toIso8601String(),
            'actualizado'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
