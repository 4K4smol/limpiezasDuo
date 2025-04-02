<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complejidad extends Model
{
    protected $table = 'complejidades';

    protected $primaryKey = 'nivel'; // es CHAR(1): A, B o C
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nivel',
        'descripcion',
        'porcentaje',
        'plus_fijo',
    ];

    public function ubicaciones()
    {
        return $this->hasMany(UbicacionCliente::class, 'complejidad', 'nivel');
    }
}
