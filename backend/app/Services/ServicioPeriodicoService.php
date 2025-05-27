<?php

namespace App\Services;

use App\Models\ServicioPeriodico;
use App\Models\OrdenTrabajo;
use App\Models\OrdenTrabajoDetalle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ServicioPeriodicoService
{
    public function generarOrdenesDesdeContrato(ServicioPeriodico $sp, int $meses = 1): array
    {
        $ordenesCreadas = [];

        foreach ($sp->programaciones as $prog) {
            $base = Carbon::parse($prog->dia_hora);
            $weekday = $base->isoWeekday(); // 1 (lunes) → 7 (domingo)
            $hora = $base->format('H:i');

            for ($i = 0; $i < $meses; $i++) {
                $fechaBase = Carbon::now()->startOfMonth()->addMonths($i);
                $fechaProgramada = $this->calcularFechaProgramada($fechaBase, $prog->semana_mensual, $weekday)
                                        ->setTimeFromTimeString($hora);

                DB::beginTransaction();

                try {
                    $orden = OrdenTrabajo::create([
                        'id_cliente' => $sp->id_cliente,
                        'id_ubicacion' => $prog->id_ubicacion,
                        'fecha_programada' => $fechaProgramada->toDateString(),
                        'hora_programada' => $hora,
                        'estado' => 'Pendiente',
                    ]);

                    $precioBase = $prog->servicio->precio_hora ?? 20.00; // fallback
                    $ubicacion = $prog->ubicacion;
                    $plus = match ($ubicacion->complejidad) {
                        'A' => 0,
                        'B' => 5,
                        'C' => 10,
                        default => 0
                    };

                    OrdenTrabajoDetalle::create([
                        'id_orden' => $orden->id_orden,
                        'id_servicio' => $prog->id_servicio,
                        'horas_realizadas' => 1.00,
                        'precio_hora' => $precioBase,
                        'plus_complejidad' => $plus,
                        'precio_total' => ($precioBase * 1.00) + $plus,
                    ]);

                    DB::commit();
                    $ordenesCreadas[] = $orden;
                } catch (\Throwable $e) {
                    DB::rollBack();
                    report($e);
                }
            }
        }

        return $ordenesCreadas;
    }

    private function calcularFechaProgramada(Carbon $inicioMes, int $semanaMensual, int $weekday): Carbon
    {
        $inicio = $inicioMes->copy()->startOfWeek(Carbon::MONDAY);
        $fecha = $inicio->addWeeks($semanaMensual - 1)->next($weekday);
        return $fecha;
    }
}
