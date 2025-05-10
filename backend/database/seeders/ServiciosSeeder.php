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

        // Insertar servicios principales (padres)
        $serviciosPadre = [
            'Limpieza completa' => DB::table('servicios')->insertGetId([
                'nombre' => 'Limpieza completa',
                'descripcion' => 'Servicio completo de limpieza de cristales.',
                'precio_hora' => 20.00,
                'is_active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]),
            'Limpieza portales' => DB::table('servicios')->insertGetId([
                'nombre' => 'Limpieza portales',
                'descripcion' => 'Servicio integral para comunidades y accesos.',
                'precio_hora' => 21.00,
                'is_active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]),
        ];

        // Subservicios relacionados con los anteriores
        $subservicios = [
            // Subservicios de Limpieza completa
            [
                'nombre' => 'Limpieza cristales exterior',
                'descripcion' => 'Limpieza de cristales exteriores.',
                'precio_hora' => 22.00,
                'parent_id_servicio' => $serviciosPadre['Limpieza completa'],
            ],
            [
                'nombre' => 'Limpieza cristales interior',
                'descripcion' => 'Limpieza de cristales interiores.',
                'precio_hora' => 20.00,
                'parent_id_servicio' => $serviciosPadre['Limpieza completa'],
            ],

            // Subservicios de Limpieza portales
            [
                'nombre' => 'Limpieza terraza',
                'descripcion' => 'Limpieza de terraza exterior o comunitaria.',
                'precio_hora' => 20.00,
                'parent_id_servicio' => $serviciosPadre['Limpieza portales'],
            ],
            [
                'nombre' => 'Limpieza plantas',
                'descripcion' => 'Limpieza de rellanos, escaleras y barandillas.',
                'precio_hora' => 19.00,
                'parent_id_servicio' => $serviciosPadre['Limpieza portales'],
            ],
        ];

        // Servicios individuales sin padre
        $serviciosIndependientes = [
            [
                'nombre' => 'Limpieza garage',
                'descripcion' => 'Limpieza de garajes o sótanos.',
                'precio_hora' => 22.00,
            ],
            [
                'nombre' => 'Limpieza General',
                'descripcion' => 'Limpieza estándar de oficinas o viviendas.',
                'precio_hora' => 20.00,
            ],
            [
                'nombre' => 'Limpieza de toldos y persianas (Sin desmonte)',
                'descripcion' => 'Limpieza superficial de toldos y persianas.',
                'precio_hora' => 25.00,
            ],
            [
                'nombre' => 'Limpieza después de obras o reformas',
                'descripcion' => 'Limpieza profunda tras obras o reformas.',
                'precio_hora' => 28.00,
            ],
            [
                'nombre' => 'Servicio exprés',
                'descripcion' => 'Limpieza urgente o puntual de intervención rápida.',
                'precio_hora' => 30.00,
            ],
        ];

        // Insertar subservicios
        foreach ($subservicios as &$servicio) {
            $servicio['is_active'] = true;
            $servicio['created_at'] = $now;
            $servicio['updated_at'] = $now;
        }
        DB::table('servicios')->insert($subservicios);

        // Insertar servicios sin padre
        foreach ($serviciosIndependientes as &$servicio) {
            $servicio['parent_id_servicio'] = null;
            $servicio['is_active'] = true;
            $servicio['created_at'] = $now;
            $servicio['updated_at'] = $now;
        }
        DB::table('servicios')->insert($serviciosIndependientes);
    }
}
