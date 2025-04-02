<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{

    use HasFactory;


    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';

    protected $fillable = [
        'razon_social',
        'cif',
        'codigo_postal',
        'ciudad',
        'telefono',
        'email',
        'fecha_registro',
        'activo'
    ];

    // Relación 1:N con contactos_empresas
    public function contactos()
    {
        return $this->hasMany(ContactosEmpresa::class, 'id_cliente');
    }

    // Relación 1:N con ordenes_trabajo
    public function ordenesTrabajo()
    {
        return $this->hasMany(OrdenTrabajo::class, 'id_cliente');
    }

    // Relación 1:N con facturas
    public function facturas()
    {
        return $this->hasMany(Factura::class, 'id_cliente');
    }
}
