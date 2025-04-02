<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contactos_empresas', function (Blueprint $table) {
            $table->id('id_contacto');
            $table->unsignedBigInteger('id_cliente');
            $table->string('nombre_contacto', 100);
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('cargo', 100)->nullable();
            $table->timestamps();

            // Clave foránea
            $table->foreign('id_cliente')
                  ->references('id_cliente')
                  ->on('clientes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contactos_empresas');
    }
};
