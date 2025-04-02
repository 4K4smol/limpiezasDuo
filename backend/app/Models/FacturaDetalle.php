<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacturaDetalle extends Model
{
    use HasFactory;

    protected $table = 'facturas_detalles'; // Nombre de la tabla
    protected $primaryKey = 'id_factura_detalle'; // Clave primaria

    protected $fillable = [
        'id_factura',
        'descripcion_concepto',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    /**
     * Obtiene la factura a la que pertenece este detalle.
     */
    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'id_factura', 'id_factura');
    }
}
