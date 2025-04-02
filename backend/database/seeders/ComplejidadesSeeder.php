<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComplejidadesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('complejidades')->insert([
            ['nivel' => 'A', 'descripcion' => 'Fácil / Estándar', 'porcentaje' => 0, 'plus_fijo' => 0],
            ['nivel' => 'B', 'descripcion' => 'Media dificultad', 'porcentaje' => 10, 'plus_fijo' => 5],
            ['nivel' => 'C', 'descripcion' => 'Alta dificultad / mucho esfuerzo', 'porcentaje' => 20, 'plus_fijo' => 10],
        ]);
    }
}
