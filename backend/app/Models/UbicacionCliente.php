<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UbicacionCliente extends Model
{
    protected $table = 'ubicaciones_clientes';
    protected $primaryKey = 'id_ubicacion';

    protected $fillable = [
        'id_cliente',
        'complejidad',
        'direccion',
        'descripcion',
    ];

    // Relación con la empresa cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    // Relación con la tabla de complejidades
    public function nivelComplejidad()
    {
        return $this->belongsTo(Complejidad::class, 'complejidad', 'nivel');
    }

    // Relación con servicios periódicos (si usas ese módulo)
    public function programaciones()
    {
        return $this->hasMany(ServicioPeriodicoProgramacion::class, 'id_ubicacion');
    }

    // Relación con órdenes de trabajo
    public function ordenesTrabajo()
    {
        return $this->hasMany(OrdenTrabajo::class, 'id_ubicacion');
    }
}
