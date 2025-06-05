<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToTenant;

class ContactosEmpresa extends Model
{
    use SoftDeletes;
    use BelongsToTenant;

    protected $table = 'contactos_empresas';

    protected $fillable = [
        'id_cliente',
        'nombre_contacto',
        'telefono',
        'email',
        'cargo',
        'principal',
        'tenant_id'
    ];

    // Relación N:1 con clientes
    public function Cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}
