<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Factura extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'id_factura';

    protected $fillable = [
        'serie',
        'numero_factura',
        'id_cliente',
        'fecha_emision',
        'fecha_vencimiento',
        'base_imponible',
        'iva_porcentaje',
        'iva_importe',
        'retencion_porcentaje',
        'retencion_importe',
        'total_factura',
        'forma_pago',
        'importe_pagado',
        'estado_pago',
        'hash_factura',
        'hash_anterior',
        'anulada',
    ];

    /**
     * Convierte estos atributos a objetos Carbon automáticamente.
     */
    protected $casts = [
        'fecha_emision'      => 'date',      // convierte a Carbon (solo fecha)
        'fecha_vencimiento'  => 'date',      // idem
        'created_at'         => 'datetime',  // opcional
        'updated_at'         => 'datetime',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function detalles()
    {
        return $this->hasMany(FacturaDetalle::class, 'id_factura');
    }

    public function logs()
    {
        return $this->hasMany(FacturaLog::class, 'id_factura');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'id_factura');
    }

    public function estaAnulada(): bool
    {
        return $this->anulada === true;
    }
}
