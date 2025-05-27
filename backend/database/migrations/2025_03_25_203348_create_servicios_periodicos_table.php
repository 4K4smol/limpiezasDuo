<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('servicios_periodicos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_cliente');
            $table->foreign('id_cliente')
                ->references('id_cliente')  // 👈 esto cambia
                ->on('clientes')
                ->onDelete('cascade');

            $table->tinyInteger('periodicidad_mensual')
                ->comment('veces al mes: 1, 2 o 4');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('servicios_periodicos');
    }
};
