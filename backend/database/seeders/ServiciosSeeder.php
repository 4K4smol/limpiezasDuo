<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ServiciosSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Primero insertamos servicios PADRE
        $limpiezaCompletaId = DB::table('servicios')->insertGetId([
            'nombre_servicio' => 'Limpieza completa',
            'descripcion' => 'Servicio completo de limpieza de cristales.',
            'precio_hora' => 20.00,
            'activo' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $limpiezaPortalesId = DB::table('servicios')->insertGetId([
            'nombre_servicio' => 'Limpieza portales',
            'descripcion' => 'Servicio integral para comunidades y accesos.',
            'precio_hora' => 21.00,
            'activo' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Ahora insertamos SUBSERVICIOS asociados
        DB::table('servicios')->insert([
            // Subservicios de "Limpieza completa"
            [
                'nombre_servicio' => 'Limpieza cristales exterior',
                'descripcion' => 'Limpieza de cristales exteriores.',
                'precio_hora' => 22.00,
                'activo' => 1,
                'servicio_padre_id' => $limpiezaCompletaId,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre_servicio' => 'Limpieza cristales interior',
                'descripcion' => 'Limpieza de cristales interiores.',
                'precio_hora' => 20.00,
                'activo' => 1,
                'servicio_padre_id' => $limpiezaCompletaId,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Subservicios de "Limpieza portales"
            [
                'nombre_servicio' => 'Limpieza terraza',
                'descripcion' => 'Limpieza de terraza exterior o comunitaria.',
                'precio_hora' => 20.00,
                'activo' => 1,
                'servicio_padre_id' => $limpiezaPortalesId,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre_servicio' => 'Limpieza plantas',
                'descripcion' => 'Limpieza de rellanos, escaleras y barandillas.',
                'precio_hora' => 19.00,
                'activo' => 1,
                'servicio_padre_id' => $limpiezaPortalesId,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Servicios individuales (sin padre)
            [
                'nombre_servicio' => 'Limpieza garage',
                'descripcion' => 'Limpieza de garajes o sótanos.',
                'precio_hora' => 22.00,
                'activo' => 1,
                'servicio_padre_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre_servicio' => 'Limpieza General',
                'descripcion' => 'Limpieza estándar de oficinas o viviendas.',
                'precio_hora' => 20.00,
                'activo' => 1,
                'servicio_padre_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre_servicio' => 'Limpieza de toldos y persianas (Sin desmonte)',
                'descripcion' => 'Limpieza superficial de toldos y persianas.',
                'precio_hora' => 25.00,
                'activo' => 1,
                'servicio_padre_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre_servicio' => 'Limpieza después de obras o reformas',
                'descripcion' => 'Limpieza profunda tras obras o reformas.',
                'precio_hora' => 28.00,
                'activo' => 1,
                'servicio_padre_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre_servicio' => 'Servicio exprés',
                'descripcion' => 'Limpieza urgente o puntual de intervención rápida.',
                'precio_hora' => 30.00,
                'activo' => 1,
                'servicio_padre_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
