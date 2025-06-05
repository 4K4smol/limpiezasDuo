<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Cliente;

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

    public function clientes(): BelongsToMany
    {
        return $this->belongsToMany(Cliente::class, 'cliente_servicio', 'servicio_id', 'cliente_id')
            ->withPivot(['precio_negociado', 'condiciones', 'vigencia_desde', 'vigencia_hasta'])
            ->withTimestamps();
    }
}
