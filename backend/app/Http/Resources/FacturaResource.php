<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero' => $this->numero,
            'cliente' => [
                'id' => $this->cliente->id,
                'nombre' => $this->cliente->nombre,
                'email' => $this->cliente->email,
            ],
            'items' => $this->items->map(function ($item) {
                return [
                    'descripcion' => $item->descripcion,
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->precio_unitario,
                    'subtotal' => $item->cantidad * $item->precio_unitario,
                ];
            }),
            'iva_porcentaje' => $this->iva_porcentaje,
            'retencion_porcentaje' => $this->retencion_porcentaje,
            'forma_pago' => $this->forma_pago,
            'total' => $this->total,
            'fecha_emision' => $this->fecha_emision->format('Y-m-d'),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
