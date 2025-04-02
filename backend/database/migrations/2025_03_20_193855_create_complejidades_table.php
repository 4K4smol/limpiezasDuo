<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complejidades', function (Blueprint $table) {
            $table->char('nivel', 1)->primary(); // A, B, C
            $table->string('descripcion')->nullable(); // opcional: "Zona difícil acceso", etc.
            $table->decimal('porcentaje', 5, 2)->default(0.00); // Ej: 10.00 = +10%
            $table->decimal('plus_fijo', 10, 2)->default(0.00); // Ej: +5€ fijos
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complejidades');
    }
};
