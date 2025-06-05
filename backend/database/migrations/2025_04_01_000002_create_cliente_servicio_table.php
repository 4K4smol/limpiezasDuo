<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cliente_servicio', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id');
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('servicio_id');
            $table->decimal('precio_negociado', 10, 2)->unsigned()->default(0);
            $table->text('condiciones')->nullable();
            $table->date('vigencia_desde')->nullable();
            $table->date('vigencia_hasta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('cliente_id')->references('id_cliente')->on('clientes')->onDelete('cascade');
            $table->foreign('servicio_id')->references('id_servicio')->on('servicios')->onDelete('cascade');
            $table->index(['cliente_id', 'servicio_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cliente_servicio');
    }
};
