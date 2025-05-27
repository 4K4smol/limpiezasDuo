<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\UbicacionCliente;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        // --- Crear Clientes (manual o con factory) ---
        $clientes = [];

        if (class_exists(\Database\Factories\ClienteFactory::class)) {
            $clientes = Cliente::factory()->count(5)->create();
            $this->command->info('5 Clientes creados usando Factory.');
        } else {
            $clientes[] = Cliente::firstOrCreate(
                ['cif' => 'A12345678'],
                [
                    'razon_social' => 'Empresa Ejemplo Uno S.L.',
                    'nombre_comercial' => 'Ejemplo Uno',
                    'direccion' => 'Calle Falsa 123',
                    'codigo_postal' => '28001',
                    'localidad' => 'Madrid',
                    'provincia' => 'Madrid',
                    'telefono' => '910000001',
                    'email' => 'contacto@ejemplouno.es'
                ]
            );

            $clientes[] = Cliente::firstOrCreate(
                ['cif' => 'B87654321'],
                [
                    'razon_social' => 'Servicios Ficticios Dos S.A.',
                    'nombre_comercial' => 'Ficticios Dos',
                    'direccion' => 'Avenida Inventada 45',
                    'codigo_postal' => '39002',
                    'localidad' => 'Santander',
                    'provincia' => 'Cantabria',
                    'telefono' => '942000002',
                    'email' => 'info@ficticiosdos.com'
                ]
            );

            $this->command->info('Clientes creados manualmente (o ya existían).');
        }

        $complejidades = ['A', 'B', 'C'];

        foreach ($clientes as $cliente) {
            // Evitar duplicados si el cliente ya tiene ubicaciones
            if ($cliente->ubicaciones()->exists()) {
                $this->command->warn("El cliente {$cliente->nombre_comercial} ya tiene ubicaciones.");
                continue;
            }

            $cantidadUbicaciones = rand(1, 3);

            for ($i = 1; $i <= $cantidadUbicaciones; $i++) {
                UbicacionCliente::create([
                    'id_cliente' => $cliente->id_cliente,
                    'complejidad' => $complejidades[array_rand($complejidades)],
                    'direccion' => "Calle nº $i - Cliente {$cliente->id_cliente}",
                    'descripcion' => "Ubicación generada automáticamente nº $i",
                ]);
            }

            $this->command->info("Cliente '{$cliente->nombre_comercial}' tiene ahora $cantidadUbicaciones ubicaciones.");
        }
    }
}
