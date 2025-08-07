<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('servicios_periodicos_programacion', function (Blueprint $table) {
            $table->id('id_servicio_periodico_programacion');
            $table->unsignedBigInteger('id_servicio_periodico');
            $table->unsignedBigInteger('id_servicio');
            $table->unsignedBigInteger('id_ubicacion');

            $table->tinyInteger('semana_mensual')->comment('1-4 (semana del mes)');
            $table->dateTime('dia_hora')->comment('día referencial + hora');

            $table->timestamps();

            $table->foreign('id_servicio_periodico')
                  ->references('id_servicio_periodico')
                  ->on('servicios_periodicos')
                  ->onDelete('cascade');

            $table->foreign('id_servicio')
                  ->references('id_servicio')
                  ->on('servicios');

            $table->foreign('id_ubicacion')
                  ->references('id_ubicacion')
                  ->on('ubicaciones_clientes');

            $table->unique(
                ['id_servicio_periodico', 'semana_mensual', 'id_servicio'],
                'unq_programacion_semana_servicio'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios_periodicos_programacion');
    }
};
