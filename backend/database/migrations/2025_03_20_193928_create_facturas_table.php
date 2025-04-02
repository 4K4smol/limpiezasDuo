<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id('id_factura');
            $table->string('numero_factura', 20);
            $table->unsignedBigInteger('id_cliente');
            $table->date('fecha_emision');
            $table->decimal('base_imponible', 10, 2);
            $table->decimal('iva_porcentaje', 5, 2);
            $table->decimal('iva_importe', 10, 2);
            $table->decimal('retencion_porcentaje', 5, 2)->nullable();
            $table->decimal('retencion_importe', 10, 2)->nullable();
            $table->decimal('total_factura', 10, 2);
            $table->string('forma_pago', 50)->nullable();
            $table->timestamps();

            $table->foreign('id_cliente')
                  ->references('id_cliente')
                  ->on('clientes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
