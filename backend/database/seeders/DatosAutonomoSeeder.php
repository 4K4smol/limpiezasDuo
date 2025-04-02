<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatosAutonomoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('datos_autonomo')->insert([
            [
                'nombre'            => 'CLAUDIO SÁMANO PUEBLA',
                'nif'               => '72147983-L',
                'direccion'         => 'C/ General Ceballos 14 1ºD',
                'localidad'         => 'Torrelavega',
                'provincia'         => 'Cantabria',
                'cp'                => '31300',
                'telefono'          => '692 16 07 10',
                'email'             => 'limpiezasduo@hotmail.com',
                'iban'              => 'ES28 2100 5611 9702 0005 1489',
                'info_adicional'    => ''
            ],
        ]);
    }
}
