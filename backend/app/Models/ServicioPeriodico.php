<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServicioPeriodico extends Model
{
    protected $table = 'servicios_periodicos';
    protected $primaryKey = 'id_servicio_periodico';
    public $timestamps = true;

    protected $fillable = [
        'id_cliente',
        'id_ubicacion',
        'periodicidad_mensual',
        'activo',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function ubicacion(): BelongsTo
    {
        return $this->belongsTo(UbicacionCliente::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function serviciosAsociados(): HasMany
    {
        return $this->hasMany(ServicioPeriodicoServicio::class, 'id_servicio_periodico', 'id_servicio_periodico');
    }
}
