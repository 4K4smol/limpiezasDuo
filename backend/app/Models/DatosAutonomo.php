<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosAutonomo extends Model
{
    protected $table = 'datos_autonomo';

    protected $fillable = [
        'nombre', 'nif', 'direccion', 'localidad', 'provincia',
        'cp', 'telefono', 'email', 'iban', 'info_adicional'
    ];
}
