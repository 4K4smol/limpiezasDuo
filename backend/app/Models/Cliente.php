<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Servicio;

class Cliente extends Model
{
    use HasFactory;
    use SoftDeletes;
    use BelongsToTenant;


    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';

    protected $fillable = [
        'razon_social',
        'cif',
        'codigo_postal',
        'ciudad',
        'telefono',
        'email',
        'tenant_id'
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

    public function ubicaciones()
    {
        return $this->hasMany(UbicacionCliente::class, 'id_cliente', 'id_cliente');
    }

    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'cliente_servicio', 'cliente_id', 'servicio_id')
            ->withPivot(['precio_negociado', 'condiciones', 'vigencia_desde', 'vigencia_hasta'])
            ->withTimestamps();
    }
}
