<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicioPeriodico extends Model
{
    protected $table = 'servicios_periodicos';

    protected $primaryKey = 'id_servicio_periodico';
    protected $fillable = [
        'id_cliente',
        'id_ubicacion',
        'periodicidad_mensual',
        'activo'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function ubicacion()
    {
        return $this->belongsTo(UbicacionCliente::class, 'id_ubicacion');
    }

    public function servicios()
    {
        return $this->hasMany(ServicioPeriodicoServicio::class, 'id_servicio_periodico');
    }
}
