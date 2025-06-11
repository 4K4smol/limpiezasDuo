<?php

// database/migrations/xxxx_xx_xx_create_facturas_logs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('facturas_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_factura');
            $table->string('accion'); // ejemplo: creado, modificado, anulado, exportado
            $table->string('usuario')->nullable();
            $table->ipAddress('ip')->nullable();
            $table->text('comentario')->nullable();
            $table->timestamps();

            $table->foreign('id_factura')
                  ->references('id_factura')
                  ->on('facturas')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas_logs');
    }
};
