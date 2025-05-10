<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Servicio extends Model
{
    protected $table = 'servicios';
    protected $primaryKey = 'id_servicio';
    public $timestamps = true;

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio_hora',
        'is_active',
        'parent_id_servicio',
    ];

    // Relación: subservicios
    public function hijos(): HasMany
    {
        return $this->hasMany(Servicio::class, 'parent_id_servicio', 'id_servicio');
    }

    // Relación: servicio padre
    public function padre(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'parent_id_servicio', 'id_servicio');
    }

    // Relación con servicios periódicos concretos
    public function serviciosPeriodicosServicio(): HasMany
    {
        return $this->hasMany(ServicioPeriodicoServicio::class, 'id_servicio', 'id_servicio');
    }
}
