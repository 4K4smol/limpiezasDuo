<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id('id_lead');
            $table->string('empresa_nombre', 150);
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('mensaje')->nullable();
            $table->date('fecha_envio')->default(now());
            $table->tinyInteger('atendido')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
