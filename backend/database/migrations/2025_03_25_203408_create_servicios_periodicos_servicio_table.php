<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios_periodicos_servicio', function (Blueprint $table) {
            $table->id('id_servicios_periodicos_servicio');
            $table->unsignedBigInteger('id_servicio_periodico');
            $table->enum('periodicidad_mensual', ['1', '2', '3', '4']); // tipo de periodicidad
            $table->unsignedBigInteger('id_servicio');
            $table->dateTime('datetime');
            $table->timestamps();

            $table->foreign('id_servicio_periodico')
                ->references('id_servicio_periodico')
                ->on('servicios_periodicos')
                ->onDelete('cascade');

            $table->foreign('id_servicio')
                ->references('id_servicio')
                ->on('servicios')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios_periodicos_servicio');
    }
};
