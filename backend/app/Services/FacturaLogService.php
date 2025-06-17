<?php

namespace App\Services;

use App\Models\Factura;
use App\Models\FacturaLog;
use App\Enums\AccionFactura;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;

class FacturaLogService
{
    /**
     * Registra una acción realizada sobre una factura.
     *
     * @param Factura $factura
     * @param AccionFactura $accion
     * @param string|null $comentario
     * @return void
     */
    public function registrar(Factura $factura, AccionFactura $accion, ?string $comentario = null): void
    {
        $usuario = Auth::user();
        $nombreUsuario = $usuario?->nombre_usuario ?? 'sistema';
        $ip = Request::ip();

        FacturaLog::create([
            'id_factura' => $factura->id_factura,
            'accion'     => $accion,
            'usuario'    => $nombreUsuario,
            'ip'         => $ip,
            'comentario' => $comentario,
        ]);
    }
}
