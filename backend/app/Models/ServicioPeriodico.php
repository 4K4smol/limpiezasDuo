<?php

namespace App\Models;

use App\Enums\PeriodicidadMensual;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class ServicioPeriodico extends Model
{
    use HasFactory;

    protected $table = 'servicios_periodicos';
    protected $primaryKey = 'id_servicio_periodico';

    protected $fillable = [
        'id_cliente',
        'periodicidad_mensual',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'periodicidad_mensual' => PeriodicidadMensual::class,
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function programaciones(): HasMany
    {
        return $this->hasMany(ServicioPeriodicoProgramacion::class, 'id_servicio_periodico');
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    protected function frecuencia(): Attribute
    {
        return Attribute::get(fn() => $this->periodicidad_mensual->value . ' veces/mes');
    }

    public function getRouteKeyName(): string
    {
        return 'id_servicio_periodico';
    }
}
