<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrdenTrabajo extends Model
{
    use HasFactory;

    protected $table = 'ordenes_trabajo';
    protected $primaryKey = 'id_orden'; // <-- ¡Importante!

    protected $fillable = [
        'id_cliente',
        'id_ubicacion',
        'id_empleado',
        'fecha_creacion',
        'fecha_programada',
        'hora_programada',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha_creacion' => 'date',
        'fecha_programada' => 'date',
        // 'hora_programada' => 'datetime:H:i', // O maneja como string
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function ubicacion(): BelongsTo
    {
        return $this->belongsTo(UbicacionCliente::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'id_empleado', 'id_empleado');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(OrdenTrabajoDetalle::class, 'id_orden', 'id_orden');
    }
}
