<?php

namespace App\Models; // O el namespace donde tengas tu modelo

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Factura extends Model
{
    use HasFactory; // Asegúrate de tener HasFactory si quieres usar factories para Factura también

    protected $table = 'facturas'; // Correcto

    // --- AÑADE ESTA LÍNEA ---
    protected $primaryKey = 'id_factura';
    // --------------------------

    // Indica que la PK no es autoincremental si NO lo es (normalmente con ->id() SÍ lo es)
    // public $incrementing = false;

    // Indica el tipo de la PK si NO es integer (normalmente con ->id() SÍ lo es)
    // protected $keyType = 'string';

    protected $fillable = [
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
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'base_imponible' => 'decimal:2',
        'iva_porcentaje' => 'decimal:2',
        'iva_importe' => 'decimal:2',
        'retencion_porcentaje' => 'decimal:2',
        'retencion_importe' => 'decimal:2',
        'total_factura' => 'decimal:2',
    ];

    /**
     * Obtiene los detalles asociados a la factura.
     */
    public function detalles(): HasMany // O 'items' si prefieres ese nombre
    {
        // Asegúrate que el nombre de la FK y la PK local coincidan
        return $this->hasMany(FacturaDetalle::class, 'id_factura', 'id_factura');
    }

    /**
     * Obtiene el cliente al que pertenece la factura.
     */
    public function cliente(): BelongsTo
    {
         // Asegúrate que el nombre de la FK y la PK del otro modelo coincidan
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }
}
