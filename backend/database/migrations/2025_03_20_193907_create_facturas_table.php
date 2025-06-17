<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id('id_factura');

            // Identificación
            $table->string('serie', 3)->default('A');
            $table->string('numero_factura', 20);
            $table->unique(['serie', 'numero_factura']);

            // Cliente
            $table->unsignedBigInteger('id_cliente');

            // Fechas
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento')->nullable();

            // Importes
            $table->decimal('base_imponible', 10, 2);
            $table->decimal('iva_porcentaje', 5, 2)->default(21.00);
            $table->decimal('iva_importe', 10, 2);
            $table->decimal('retencion_porcentaje', 5, 2)->nullable();
            $table->decimal('retencion_importe', 10, 2)->nullable();
            $table->decimal('total_factura', 10, 2);

            // Pago
            $table->string('forma_pago', 100)->nullable(); // más flexible
            $table->decimal('importe_pagado', 10, 2)->default(0.00);
            $table->enum('estado_pago', ['pendiente', 'parcial', 'pagado'])->default('pendiente');

            // VeriFactu
            $table->string('hash_factura', 255)->nullable()->unique();      // SHA-256 de la factura
            $table->string('hash_anterior', 255)->nullable();               // Encadenamiento con factura anterior

            $table->boolean('anulada')->default(false);

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->foreign('id_cliente')->references('id_cliente')->on('clientes')->onDelete('restrict');

            // Índices
            $table->index(['fecha_emision']);
            $table->index(['id_cliente', 'fecha_emision']);
            $table->index(['estado_pago']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
