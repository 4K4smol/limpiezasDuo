<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table = 'inventario';
    protected $primaryKey = 'id_item'; // 👈 CLAVE

    protected $fillable = [
        'nombre_item',
        'descripcion',
        'cantidad_actual',
        'stock_minimo',
        'unidad',
        'ubicacion',
        'activo'
    ];

    // Según tu lógica, podrías tener relaciones adicionales (movimientos, etc.)
}
