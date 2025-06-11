<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacturaDetalle extends Model
{
    protected $primaryKey = 'id_factura_detalle';
    protected $table = 'facturas_detalles';

    protected $fillable = [
        'id_factura',
        'descripcion_concepto',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'iva_porcentaje',
        'iva_importe',
        'total_linea',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'float',
        'subtotal' => 'float',
        'iva_porcentaje' => 'float',
        'iva_importe' => 'float',
        'total_linea' => 'float',
    ];

    public function factura()
    {
        return $this->belongsTo(Factura::class, 'id_factura');
    }
}
