<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Factura extends Model
{
    use HasFactory;

    protected $table = 'facturas';
    protected $primaryKey = 'id_factura';

    protected $fillable = [
        'serie',
        'numero_factura',
        'id_cliente',
        'fecha_emision',
        'base_imponible',
        'iva_porcentaje',
        'iva_importe',
        'retencion_porcentaje',
        'retencion_importe',
        'total_factura',
        'forma_pago',
        'hash_factura',
        'anulada',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'base_imponible' => 'decimal:2',
        'iva_porcentaje' => 'decimal:2',
        'iva_importe' => 'decimal:2',
        'retencion_porcentaje' => 'decimal:2',
        'retencion_importe' => 'decimal:2',
        'total_factura' => 'decimal:2',
        'anulada' => 'boolean',
    ];

    /**
     * Relación: Factura pertenece a un Cliente.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    /**
     * Relación: Factura tiene muchos detalles.
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(FacturaDetalle::class, 'id_factura', 'id_factura');
    }
}
