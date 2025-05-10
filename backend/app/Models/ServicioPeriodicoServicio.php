<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicioPeriodicoServicio extends Model
{
    protected $table = 'servicios_periodicos_servicio';
    protected $primaryKey = 'id_servicios_periodicos_servicio';
    public $timestamps = true;

    protected $fillable = [
        'id_servicio_periodico',
        'id_servicio',
        'periodicidad_mensual',
        'datetime',
    ];

    public function servicioPeriodico(): BelongsTo
    {
        return $this->belongsTo(ServicioPeriodico::class, 'id_servicio_periodico', 'id_servicio_periodico');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'id_servicio', 'id_servicio');
    }
}
