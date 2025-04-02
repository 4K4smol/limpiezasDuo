<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Para la relación con ServiciosPeriodicos

class Servicio extends Model
{
    use HasFactory;

    protected $table = 'servicios';
    protected $primaryKey = 'id_servicio'; // <-- Clave primaria no estándar

    protected $fillable = [
        'nombre_servicio',
        'descripcion',
        'precio_hora',
        'activo',
        'servicio_padre_id',
    ];

    protected $casts = [
        'precio_hora' => 'decimal:2', // Castea a decimal con 2 posiciones
        'activo' => 'boolean',       // Castea a booleano (true/false desde 1/0)
    ];

    /**
     * Relación muchos a muchos con Servicios Periodicos.
     */
    public function serviciosPeriodicos(): BelongsToMany
    {
        return $this->belongsToMany(
            ServicioPeriodico::class,
            'servicios_periodicos_servicio', // Nombre de la tabla pivot
            'id_servicio',                   // Clave foránea de este modelo en la tabla pivot
            'id_servicio_periodico'          // Clave foránea del modelo relacionado en la tabla pivot
        )->withTimestamps(); // Opcional: si la tabla pivot tiene timestamps
    }

    // Servicio padre (si existe)
    public function padre()
    {
        return $this->belongsTo(Servicio::class, 'servicio_padre_id');
    }

    /**
     * Relación uno a muchos con OrdenTrabajoDetalle.
     * (Añadir si quieres navegar desde Servicio a sus detalles de orden)
     */
    // public function ordenDetalles(): HasMany
    // {
    //    return $this->hasMany(OrdenTrabajoDetalle::class, 'id_servicio', 'id_servicio');
    // }
}
