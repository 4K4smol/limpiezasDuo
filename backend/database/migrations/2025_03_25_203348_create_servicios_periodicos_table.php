<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios_periodicos', function (Blueprint $table) {
            $table->id('id_servicio_periodico');
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_ubicacion');
            $table->enum('periodicidad_mensual', ['1', '2', '4']); // veces por mes
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('id_cliente')
                ->references('id_cliente')
                ->on('clientes')
                ->onDelete('cascade');

            $table->foreign('id_ubicacion')
                ->references('id_ubicacion')
                ->on('ubicaciones_cliente')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios_periodicos');
    }
};
