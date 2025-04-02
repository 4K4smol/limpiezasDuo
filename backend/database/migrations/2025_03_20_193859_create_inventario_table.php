<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventario', function (Blueprint $table) {
            $table->id('id_item');
            $table->string('nombre_item', 100);
            $table->text('descripcion')->nullable();
            $table->integer('cantidad_actual')->default(0);
            $table->integer('stock_minimo')->default(0); // 👈 Nuevo campo
            $table->string('unidad', 20)->default('unidad');
            $table->string('ubicacion', 100)->nullable();
            $table->tinyInteger('activo')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventario');
    }
};
