<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\AccionFactura;

class FacturaLog extends Model
{

    protected $table = 'facturas_logs';

    protected $primaryKey = 'id_factura_log';

    protected $casts = [
        'accion' => AccionFactura::class,
    ];

    protected $fillable = [
        'id_factura',
        'accion',
        'usuario',
        'ip',
        'comentario',
    ];
}
