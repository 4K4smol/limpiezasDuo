<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactosEmpresa extends Model
{
    protected $table = 'contactos_clientes';

    protected $fillable = [
        'id_cliente',
        'nombre_contacto',
        'telefono',
        'email',
        'cargo'
    ];

    // Relación N:1 con clientes
    public function Cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}
