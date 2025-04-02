<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id('id_pago');
            $table->unsignedBigInteger('id_factura');
            $table->date('fecha_pago');
            $table->decimal('monto_pagado', 10, 2);
            $table->string('metodo_pago', 50)->nullable();
            $table->string('referencia_pago', 100)->nullable();
            $table->timestamps();

            $table->foreign('id_factura')
                  ->references('id_factura')
                  ->on('facturas')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
