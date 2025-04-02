<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ubicaciones_cliente', function (Blueprint $table) {
            $table->id('id_ubicacion');
            $table->unsignedBigInteger('id_cliente');
            $table->char('complejidad', 1)->default('A');
            $table->string('direccion');
            $table->string('descripcion')->nullable(); // Ej: "Planta baja", "Oficina central"
            $table->timestamps();

            $table->foreign('id_cliente')
                ->references('id_cliente')
                ->on('clientes')
                ->onDelete('cascade');

            $table->foreign('complejidad')
                ->references('nivel')
                ->on('complejidades')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ubicaciones_cliente');
    }
};
