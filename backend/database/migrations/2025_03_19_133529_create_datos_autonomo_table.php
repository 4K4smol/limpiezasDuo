<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('datos_autonomo', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('nif', 20);
            $table->string('direccion');
            $table->string('localidad');
            $table->string('provincia');
            $table->string('cp', 10);
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->string('iban', 34)->nullable();
            $table->text('info_adicional')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('datos_autonomo');
    }
};
