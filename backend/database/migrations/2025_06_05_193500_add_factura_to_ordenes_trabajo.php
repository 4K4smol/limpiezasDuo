<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('ordenes_trabajo', function (Blueprint $table) {
            $table->unsignedBigInteger('id_factura')->nullable()->after('id_empleado');

            $table->foreign('id_factura')
                ->references('id_factura')
                ->on('facturas')
                ->onDelete('set null');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordenes_trabajo', function (Blueprint $table) {
            //
        });
    }
};
