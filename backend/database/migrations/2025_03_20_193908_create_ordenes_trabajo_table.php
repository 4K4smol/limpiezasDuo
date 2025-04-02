<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ordenes_trabajo', function (Blueprint $table) {
            $table->id('id_orden');
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_ubicacion');
            $table->unsignedBigInteger('id_empleado')->nullable();
            $table->date('fecha_creacion')->default(now());
            $table->date('fecha_programada')->nullable();
            $table->time('hora_programada')->nullable();
            $table->string('estado', 50)->default('Pendiente');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('id_cliente')
                  ->references('id_cliente')
                  ->on('clientes')
                  ->onDelete('cascade');

            $table->foreign('id_ubicacion')
                  ->references('id_ubicacion')
                  ->on('ubicaciones_cliente')
                  ->onDelete('restrict');

            $table->foreign('id_empleado')
                  ->references('id_empleado')
                  ->on('empleados')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ordenes_trabajo');
    }
};
