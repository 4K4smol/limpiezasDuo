<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicioPeriodicoServicio extends Model
{
    protected $table = 'servicios_periodicos_servicio';

    protected $fillable = [
        'id_servicio_periodico',
        'id_servicio'
    ];

    public function servicioPeriodico()
    {
        return $this->belongsTo(ServicioPeriodico::class, 'id_servicio_periodico');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'id_servicio');
    }
}
