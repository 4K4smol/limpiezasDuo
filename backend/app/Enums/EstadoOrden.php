<?php

namespace App\Enums;

enum EstadoOrden: string
{
    case Pendiente = 'Pendiente';
    case Completado = 'Completado';
    case Cancelado = 'Cancelado';
}
