<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class InventarioSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = Carbon::now();

        DB::table('inventario')->insert([
            [
                'nombre_item' => 'Guantes de látex',
                'descripcion' => 'Guantes desechables para protección en tareas de limpieza.',
                'cantidad_actual' => 200,
                'stock_minimo' => 50,
                'unidad' => 'pares',
                'ubicacion' => 'Almacén A',
                'activo' => 1,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'nombre_item' => 'Lejía',
                'descripcion' => 'Desinfectante líquido concentrado.',
                'cantidad_actual' => 30,
                'stock_minimo' => 10,
                'unidad' => 'litros',
                'ubicacion' => 'Estantería 2',
                'activo' => 1,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'nombre_item' => 'Bayetas de microfibra',
                'descripcion' => 'Bayetas reutilizables para superficies delicadas.',
                'cantidad_actual' => 50,
                'stock_minimo' => 20,
                'unidad' => 'unidades',
                'ubicacion' => 'Carrito de limpieza',
                'activo' => 1,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'nombre_item' => 'Limpiacristales',
                'descripcion' => 'Spray para limpieza de cristales sin dejar marcas.',
                'cantidad_actual' => 15,
                'stock_minimo' => 5,
                'unidad' => 'botellas',
                'ubicacion' => 'Estantería 3',
                'activo' => 1,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'nombre_item' => 'Fregonas',
                'descripcion' => 'Fregonas de repuesto para suelos.',
                'cantidad_actual' => 25,
                'stock_minimo' => 10,
                'unidad' => 'unidades',
                'ubicacion' => 'Zona de útiles',
                'activo' => 1,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
        ]);
    }
}
