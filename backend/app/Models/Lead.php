<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'empresa_nombre',
        'telefono',
        'email',
        'mensaje',
        'fecha_envio',
        'atendido'
    ];

    // Normalmente un lead no está aún asociado a una empresa_cliente,
    // salvo que lo "conviertas" luego, generando un registro en clientes.
    // Así que aquí no es común una relación interna directa, salvo que quieras
    // llevar un "convertido_a_id" o similar.
}
