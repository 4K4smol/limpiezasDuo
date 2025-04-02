<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table = 'inventario';

    protected $fillable = [
        'nombre_item',
        'descripcion',
        'cantidad_actual',
        'unidad',
        'ubicacion',
        'activo'
    ];

    // Según tu lógica, podrías tener relaciones adicionales (movimientos, etc.)
}
