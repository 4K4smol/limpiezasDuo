<?php

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
{
    protected $model = Cliente::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Genera un tipo de CIF/NIF aleatorio (simplificado)
        $cifType = $this->faker->randomElement(['A', 'B', 'E', 'G', 'J', '']);
        $cifNumber = $this->faker->numerify('########');
        $cifControl = $this->faker->randomLetter;
        $cif = ($cifType === '') ? $this->faker->unique()->numerify('########') . $this->faker->randomLetter : $cifType . $cifNumber . $cifControl;

        return [
            // --- USA LOS NOMBRES DE COLUMNA DE TU MODELO/TABLA ---
            'razon_social' => $this->faker->unique()->company, // Cambiado de nombre_fiscal
            'cif' => $cif,
            'codigo_postal' => $this->faker->postcode,
            'ciudad' => $this->faker->city, // Cambiado de localidad
            'telefono' => $this->faker->optional(0.9)->e164PhoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'fecha_registro' => $this->faker->dateTimeThisDecade(), // Añadido
            'activo' => $this->faker->boolean(90), // Añadido (90% activos)

            // --- Columnas que NO están en tu modelo actual (comentadas/eliminadas) ---
            // 'nombre_comercial' => $this->faker->boolean(70) ? $attributes['razon_social'] : $this->faker->catchPhrase,
            // 'direccion' => $this->faker->streetAddress,
            // 'provincia' => $this->faker->state,
            // 'pais' => 'España',
            // 'persona_contacto' => $this->faker->optional(0.6)->name,
            // 'observaciones' => $this->faker->optional(0.3)->sentence(10),
        ];
    }

    // El state 'autonomo' también necesita ajustarse
    public function autonomo(): Factory
    {
        return $this->state(function (array $attributes) {
             $firstName = $this->faker->firstName;
             $lastName = $this->faker->lastName;
             $fullName = $firstName . ' ' . $lastName;
             $nif = $this->faker->unique()->dni;

            return [
                'razon_social' => $fullName, // Cambiado de nombre_fiscal
                'cif' => $nif,
                // 'nombre_comercial' => $fullName, // No existe en el modelo
                // 'persona_contacto' => null, // No existe en el modelo
            ];
        });
    }
}
