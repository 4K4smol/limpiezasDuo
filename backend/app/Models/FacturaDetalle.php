<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacturaDetalle extends Model
{
    use HasFactory;

    protected $table = 'facturas_detalles';
    protected $primaryKey = 'id_factura_detalle';

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
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'iva_porcentaje' => 'decimal:2',
        'iva_importe' => 'decimal:2',
        'total_linea' => 'decimal:2',
    ];

    /**
     * Relación: este detalle pertenece a una factura.
     */
    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'id_factura', 'id_factura');
    }
}
