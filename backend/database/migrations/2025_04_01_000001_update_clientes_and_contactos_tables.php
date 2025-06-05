<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->after('id_cliente');
            $table->softDeletes();
            $table->unique('cif');
            $table->unique(['razon_social', 'cif']);
            $table->dropColumn(['fecha_registro', 'activo']);
        });

        Schema::table('contactos_empresas', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->after('id_contacto');
            $table->boolean('principal')->default(false)->after('cargo');
            $table->softDeletes();
            $table->index('id_cliente');
        });
    }

    public function down(): void
    {
        Schema::table('contactos_empresas', function (Blueprint $table) {
            $table->dropIndex(['id_cliente']);
            $table->dropSoftDeletes();
            $table->dropColumn(['tenant_id', 'principal']);
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->date('fecha_registro')->default(now());
            $table->tinyInteger('activo')->default(1);
            $table->dropUnique(['cif']);
            $table->dropUnique(['razon_social', 'cif']);
            $table->dropSoftDeletes();
            $table->dropColumn('tenant_id');
        });
    }
};
