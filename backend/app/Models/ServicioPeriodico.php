<?php

namespace App\Models;

use App\Enums\PeriodicidadMensual;
use Illuminate\Database\Eloquent\{Model};
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class ServicioPeriodico extends Model
{
    use HasFactory;

    /* Tabla y claves ------------------------------------------------------- */
    protected $table = 'servicios_periodicos';

    protected $fillable = [
        'id_cliente',
        'periodicidad_mensual',
        'activo',
    ];

    /* Casts ---------------------------------------------------------------- */
    protected $casts = [
        'activo'                => 'boolean',
        'periodicidad_mensual'  => PeriodicidadMensual::class,
    ];

    /* Relaciones ----------------------------------------------------------- */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function programaciones(): HasMany
    {
        return $this->hasMany(ServicioPeriodicoProgramacion::class, 'id_servicio_periodico');
    }

    /* Scopes --------------------------------------------------------------- */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /* Accessors / Mutators ------------------------------------------------- */
    /** Muestra el texto “1 | 2 | 4 veces/mes” en $contrato->frecuencia */
    protected function frecuencia(): Attribute
    {
        return Attribute::get(fn () => $this->periodicidad_mensual->value . ' veces/mes');
    }
}
