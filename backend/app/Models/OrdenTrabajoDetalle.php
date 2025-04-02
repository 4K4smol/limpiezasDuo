<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrdenTrabajoDetalle extends Model
{
    use HasFactory;

    protected $table = 'ordenes_trabajo_detalles';
    protected $primaryKey = 'id_detalle'; // <-- ¡Importante!

    protected $fillable = [
        'id_orden',
        'id_servicio',
        'horas_realizadas',
        'precio_hora',
        'plus_complejidad',
        'precio_total',
    ];

    protected $casts = [
        'horas_realizadas' => 'decimal:2',
        'precio_hora' => 'decimal:2',
        'plus_complejidad' => 'decimal:2',
        'precio_total' => 'decimal:2',
    ];

    public function ordenTrabajo(): BelongsTo
    {
        return $this->belongsTo(OrdenTrabajo::class, 'id_orden', 'id_orden');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'id_servicio', 'id_servicio');
    }

    // Puedes añadir un mutador/accesor para calcular precio_total si no quieres guardarlo directamente
    // protected static function booted()
    // {
    //     static::saving(function ($detalle) {
    //         $detalle->precio_total = ($detalle->precio_hora * $detalle->horas_realizadas) + $detalle->plus_complejidad;
    //     });
    // }
}
