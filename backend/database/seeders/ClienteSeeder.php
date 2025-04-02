<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Cliente; // Asegúrate que tu modelo Cliente está aquí

class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- Limpieza Opcional ---
        // Descomenta si quieres vaciar la tabla antes de sembrar.
        // CUIDADO: Esto borra todos los clientes existentes.
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // Deshabilitar revisión FK temporalmente
        // Cliente::truncate(); // Vaciar la tabla eficientemente
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // Rehabilitar revisión FK
        // Alternativa más segura si truncate da problemas con FKs:
        // DB::table('clientes')->delete();


        // --- Crear Clientes ---

        // Opción 1: Usando Factory (Recomendado si tienes una definida)
        // Asegúrate de tener un ClienteFactory: php artisan make:factory ClienteFactory --model=Cliente
        if (class_exists(\Database\Factories\ClienteFactory::class)) {
             Cliente::factory()->count(5)->create();
             $this->command->info('5 Clientes creados usando Factory.');
        } else {
             // Opción 2: Creación Manual (si no tienes factory)
             Cliente::firstOrCreate(
                ['cif' => 'A12345678'], // Campo único para evitar duplicados al re-ejecutar
                [
                    'razon_social' => 'Empresa Ejemplo Uno S.L.',
                    'nombre_comercial' => 'Ejemplo Uno',
                    'direccion' => 'Calle Falsa 123',
                    'codigo_postal' => '28001',
                    'localidad' => 'Madrid',
                    'provincia' => 'Madrid',
                    'telefono' => '910000001',
                    'email' => 'contacto@ejemplouno.es'
                    // ... otros campos necesarios
                ]
             );
              Cliente::firstOrCreate(
                ['cif' => 'B87654321'], // Campo único
                [
                    'razon_social' => 'Servicios Ficticios Dos S.A.',
                    'nombre_comercial' => 'Ficticios Dos',
                    'direccion' => 'Avenida Inventada 45',
                    'codigo_postal' => '39002',
                    'localidad' => 'Santander',
                    'provincia' => 'Cantabria',
                    'telefono' => '942000002',
                    'email' => 'info@ficticiosdos.com'
                    // ... otros campos necesarios
                ]
             );
              $this->command->info('Clientes creados manualmente (o ya existían).');
        }
    }
}
