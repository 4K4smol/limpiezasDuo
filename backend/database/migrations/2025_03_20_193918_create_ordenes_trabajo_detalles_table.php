<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ordenes_trabajo_detalles', function (Blueprint $table) {
            $table->id('id_detalle');
            $table->unsignedBigInteger('id_orden');
            $table->unsignedBigInteger('id_servicio');

            // 🕒 Duración real del servicio en horas (bloques de 15 min → 0.25)
            $table->decimal('horas_realizadas', 4, 2)->default(1.00); // Ej: 1.25 = 1h 15m

            // 💰 Precio base por hora del servicio (puede copiarse desde 'servicios')
            $table->decimal('precio_hora', 10, 2);

            // 💡 Plus por complejidad (calculado según la ubicación)
            $table->decimal('plus_complejidad', 10, 2)->default(0.00);

            // 💸 Precio final (precio_hora * horas_realizadas + plus_complejidad)
            $table->decimal('precio_total', 10, 2);

            $table->timestamps();

            // 🔗 Relaciones
            $table->foreign('id_orden')
                  ->references('id_orden')
                  ->on('ordenes_trabajo')
                  ->onDelete('cascade');

            $table->foreign('id_servicio')
                  ->references('id_servicio')
                  ->on('servicios')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ordenes_trabajo_detalles');
    }
};
