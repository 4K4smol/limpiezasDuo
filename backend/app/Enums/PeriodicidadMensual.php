<?php

namespace App\Enums;

/** Cuántas veces al mes se presta el servicio periódico */
enum PeriodicidadMensual: int
{
    case UNA  = 1;
    case DOS  = 2;
    case CUATRO = 4;

    /** Devuelve los valores permitidos para la regla `in:` de Laravel */
    public static function values(): string
    {
        return collect(self::cases())->pluck('value')->implode(',');
    }
}
