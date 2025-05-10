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
            $table->string('nombre', 150)->unique();
            $table->text('descripcion')->nullable();
            $table->decimal('precio_hora', 10, 2)->default(0.00);
            $table->boolean('is_active')->default(true);

            // Clave foránea a sí misma
            $table->foreignId('parent_id_servicio')
                  ->nullable()
                  ->constrained('servicios', 'id_servicio')
                  ->nullOnDelete();

            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
