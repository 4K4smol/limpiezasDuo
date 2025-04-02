<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Cliente;
use App\Models\Factura;
use App\Models\FacturaDetalle;
use App\Services\FacturacionService; // ¡Importa tu servicio!
use Exception; // Para capturar errores

class FacturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- Limpieza Opcional ---
        // Descomenta si quieres empezar de cero con facturas y detalles.
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        // FacturaDetalle::truncate(); // Detalles primero por la FK
        // Factura::truncate();
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        // Alternativa:
        // DB::table('facturas_detalles')->delete();
        // DB::table('facturas')->delete();

        // Obtener instancia del servicio desde el contenedor de Laravel
        $facturacionService = app(FacturacionService::class);

        // Obtener IDs de clientes existentes
        $clientesIds = Cliente::pluck('id_cliente');

        if ($clientesIds->isEmpty()) {
            $this->command->error('No se encontraron clientes. Ejecuta ClienteSeeder primero.');
            return;
        }

        // --- Datos de Ejemplo para las Facturas ---
        $itemsFactura1 = [
            ['descripcion_concepto' => 'Servicio Limpieza Mensual Oficina', 'cantidad' => 1, 'precio_unitario' => 250.50],
            ['descripcion_concepto' => 'Limpieza Extra Ventanas', 'cantidad' => 2, 'precio_unitario' => 45.00],
        ];
        $itemsFactura2 = [
            ['descripcion_concepto' => 'Mantenimiento y Limpieza Comunidad', 'cantidad' => 1, 'precio_unitario' => 480.00],
        ];
        $itemsParaActualizar = [
             ['descripcion_concepto' => 'Servicio Limpieza Mensual Oficina (Ampliado)', 'cantidad' => 1, 'precio_unitario' => 280.00], // Precio cambiado
             ['descripcion_concepto' => 'Limpieza Extra Ventanas Altas', 'cantidad' => 2, 'precio_unitario' => 55.00], // Desc y precio cambiados
             ['descripcion_concepto' => 'Suministro Productos Limpieza', 'cantidad' => 1, 'precio_unitario' => 35.75], // Item nuevo
        ];

        $ivaGeneral = 21.00;
        $retencionProfesional = 7.00; // Ejemplo de retención

        // --- EJEMPLO 1: Generar Factura Simple (IVA solamente) ---
        try {
            $clienteId1 = $clientesIds->random(); // Elige un cliente al azar
            $facturaGenerada1 = $facturacionService->generarFactura(
                $clienteId1,
                $itemsFactura1,
                $ivaGeneral,
                null, // Sin retención
                'Transferencia Bancaria'
            );
            $this->command->info("Factura {$facturaGenerada1->numero_factura} creada con éxito.");

        } catch (Exception $e) {
            $this->command->error("Error generando Factura 1: " . $e->getMessage());
        }

         // --- EJEMPLO 2: Generar Factura con Retención ---
        try {
            $clienteId2 = $clientesIds->random();
            // Asegúrate que clienteId2 sea diferente de clienteId1 si quieres variedad
            while ($clienteId2 == $clienteId1 && $clientesIds->count() > 1) {
                 $clienteId2 = $clientesIds->random();
            }

            $facturaGenerada2 = $facturacionService->generarFactura(
                $clienteId2,
                $itemsFactura2,
                $ivaGeneral,
                $retencionProfesional, // Con retención
                'Recibo Domiciliado'
            );
            $this->command->info("Factura {$facturaGenerada2->numero_factura} creada con éxito (con retención).");

        } catch (Exception $e) {
            $this->command->error("Error generando Factura 2: " . $e->getMessage());
        }

        // --- EJEMPLO 3: Actualizar la Primera Factura Generada ---
        // Esperamos un poco para que la primera factura exista seguro si hay concurrencia (no suele pasar en seeders)
        // sleep(1); // Opcional, normalmente no necesario aquí

        $facturaParaActualizar = Factura::orderBy('id_factura', 'asc')->first(); // Tomamos la primera factura creada

        if ($facturaParaActualizar) {
            try {
                 $datosUpdate = [
                    // 'id_cliente' => $clienteId2, // Podrías cambiar el cliente si quisieras
                    'items' => $itemsParaActualizar, // La lista COMPLETA y NUEVA de items
                    'iva_porcentaje' => $ivaGeneral, // Podría cambiar el IVA si aplicara
                    'retencion_porcentaje' => null, // Quitar la retención si la tuviera
                    'forma_pago' => 'Confirming', // Cambiar forma de pago
                    // 'fecha_emision' => now()->subDays(2) // Podrías cambiar la fecha
                 ];

                $facturaActualizada = $facturacionService->actualizarFactura(
                    $facturaParaActualizar,
                    $datosUpdate
                );
                $this->command->info("Factura {$facturaActualizada->numero_factura} (ID: {$facturaActualizada->id_factura}) actualizada con éxito.");

            } catch (Exception $e) {
                $this->command->error("Error actualizando factura {$facturaParaActualizar->id_factura}: " . $e->getMessage());
            }
        } else {
            $this->command->warn("No se encontró una factura para probar la actualización.");
        }
    }
}
