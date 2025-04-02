<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // <-- Importa la fachada Hash

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Opcional: Comprobar si el usuario ya existe para evitar errores si ejecutas el seeder varias veces
        if (!DB::table('usuarios')->where('nombre_usuario', 'admin')->exists()) {

            DB::table('usuarios')->insert([
                [ // Asegúrate de que es un array de arrays si insertas varios, o un solo array si es solo uno
                    'nombre_usuario' => 'admin',
                    // --- USA Hash::make() para hashear correctamente ---
                    // ¡IMPORTANTE! 'admin' es una contraseña MUY DÉBIL. Úsala solo para desarrollo local.
                    // Considera 'password' o algo más complejo incluso para seeding.
                    'password_hash' => Hash::make('admin'),
                    // --- Añade los campos que faltan ---
                    'rol' => 'admin', // O el rol que hayas definido para administradores
                    'activo' => true, // Establece el usuario como activo (true o 1)
                    // Opcional: Añadir timestamps si tu tabla no los maneja automáticamente y los necesitas
                    // 'created_at' => now(),
                    // 'updated_at' => now(),
                ],
                // Puedes añadir más usuarios aquí si lo necesitas:
                // [ 'nombre_usuario' => 'otro_user', 'password_hash' => Hash::make('password123'), 'rol' => 'empleado', 'activo' => true ],
            ]);

            $this->command->info('Usuario admin creado exitosamente.');

        } else {
            // Informa si el usuario ya existía
            $this->command->info('Usuario admin ya existe. Seeder omitido.');
        }

        // Alternativa usando el Modelo Eloquent (maneja timestamps automáticamente si existen)
        /*
        \App\Models\Usuario::updateOrCreate(
            ['nombre_usuario' => 'admin'], // Busca por este campo
            [ // Datos para insertar o actualizar
                'password_hash' => Hash::make('admin'),
                'rol' => 'admin',
                'activo' => true,
            ]
        );
        $this->command->info('Usuario admin asegurado/creado usando Eloquent.');
        */
    }
}
