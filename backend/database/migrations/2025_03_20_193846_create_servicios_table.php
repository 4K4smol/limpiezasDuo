<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->id('id_servicio');
            $table->string('nombre_servicio', 150);
            $table->text('descripcion')->nullable();
            $table->decimal('precio_hora', 10, 2)->default(0.00);
            $table->tinyInteger('activo')->default(1);
            $table->foreignId('servicio_padre_id')->nullable()->constrained('servicios', 'id_servicio')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
