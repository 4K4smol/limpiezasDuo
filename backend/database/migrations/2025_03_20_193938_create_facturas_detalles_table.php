<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('facturas_detalles', function (Blueprint $table) {
            $table->id('id_factura_detalle');
            $table->unsignedBigInteger('id_factura');
            $table->string('descripcion_concepto', 255);
            $table->integer('cantidad')->default(1);
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('iva_porcentaje', 5, 2)->nullable();
            $table->decimal('iva_importe', 10, 2)->nullable();
            $table->decimal('total_linea', 10, 2)->nullable();
            $table->timestamps();

            $table->foreign('id_factura')
                ->references('id_factura')
                ->on('facturas')
                ->onDelete('cascade');

            $table->index(['id_factura']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas_detalles');
    }
};
