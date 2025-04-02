<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'empleados';

    protected $fillable = [
        'nombre',
        'dni',
        'telefono',
        'email',
        'puesto',
        'fecha_alta',
        'activo'
    ];

    // Relación 1:N con ordenes_trabajo (si queremos saber qué órdenes atendió este empleado)
    public function ordenesTrabajo()
    {
        return $this->hasMany(OrdenTrabajo::class, 'id_empleado');
    }
}
