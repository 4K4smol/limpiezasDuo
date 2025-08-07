<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo};

class ServicioPeriodicoProgramacion extends Model
{
    use HasFactory;

    protected $table = 'servicios_periodicos_programacion';
    protected $primaryKey = 'id_servicio_periodico_programacion';

    protected $fillable = [
        'id_servicio_periodico',
        'id_servicio',
        'id_ubicacion',
        'semana_mensual',
        'dia_hora',
    ];

    protected $casts = [
        'dia_hora' => 'datetime:H:i',
    ];

    public function contrato(): BelongsTo
    {
        return $this->belongsTo(ServicioPeriodico::class, 'id_servicio_periodico');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'id_servicio');
    }

    public function ubicacion(): BelongsTo
    {
        return $this->belongsTo(UbicacionCliente::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function getDiaSemanaAttribute(): int
    {
        return (int) $this->dia_hora->isoWeekday();
    }
}
