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
            $table->foreignId('id_cliente')
                ->constrained('clientes', 'id_cliente')
                ->cascadeOnDelete();
            $table->foreignId('id_ubicacion')
                ->constrained('ubicaciones_cliente', 'id_ubicacion')
                ->cascadeOnDelete();
            $table->enum('periodicidad_mensual', ['1', '2', '4']);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios_periodicos');
    }
};
