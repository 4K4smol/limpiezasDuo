<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    // --- INDICA EL NOMBRE DE TU CLAVE PRIMARIA AQUÍ ---
    // Si tu clave primaria NO se llama 'id', descomenta y ajusta la línea siguiente:
    protected $primaryKey = 'id_usuario'; // <-- ¡CAMBIA 'usuario_id' POR EL NOMBRE REAL DE TU COLUMNA!

    protected $fillable = [
        'nombre_usuario',
        'password_hash',
        'rol',
        'activo'
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function getRememberTokenName()
    {
        return 'remember_token'; // O null si no la tienes
    }

    // Si tu clave primaria NO es autoincremental (raro), añade:
    // public $incrementing = false;

    // Si tu clave primaria NO es un entero (ej. UUID), añade:
    // protected $keyType = 'string';

}
