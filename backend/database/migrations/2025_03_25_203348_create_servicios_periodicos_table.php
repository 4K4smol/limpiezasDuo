<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('servicios_periodicos', function (Blueprint $table) {
            $table->id('id_servicio_periodico');
            $table->unsignedBigInteger('id_cliente');
            $table->tinyInteger('periodicidad_mensual')->comment('veces al mes: 1, 2 o 4');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('id_cliente')
                  ->references('id_cliente')
                  ->on('clientes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios_periodicos');
    }
};
