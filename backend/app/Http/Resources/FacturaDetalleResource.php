<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturaDetalleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_factura_detalle'  => $this->id_factura_detalle,
            'descripcion_concepto' => $this->descripcion_concepto,
            'cantidad'            => (int) $this->cantidad,
            'precio_unitario'     => (float) $this->precio_unitario,
            'subtotal'            => (float) $this->subtotal,
        ];
    }
}

