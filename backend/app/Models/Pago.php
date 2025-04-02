<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'pagos';

    protected $fillable = [
        'id_factura',
        'fecha_pago',
        'monto_pagado',
        'metodo_pago',
        'referencia_pago'
    ];

    // Relación N:1 con facturas
    public function factura()
    {
        return $this->belongsTo(Factura::class, 'id_factura');
    }
}
