<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\EstadoOrden;

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
        'estado' => EstadoOrden::class,
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
