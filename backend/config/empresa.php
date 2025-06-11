<?php
// backend/config/empresa.php
// Configuración de la empresa para facturación
return [
    'nombre' => env('EMPRESA_NOMBRE', 'Claudio Sámano Puebla'),
    'nif' => env('EMPRESA_NIF', '72147983-L'),
    'direccion' => env('EMPRESA_DIRECCION', 'C/ General Ceballos 14 1ºD'),
    'cp' => env('EMPRESA_CP', '39300'),
    'ciudad' => env('EMPRESA_CIUDAD', 'Torrelavega'),
    'telefono' => env('EMPRESA_TELEFONO', '692160710'),
    'email' => env('EMPRESA_EMAIL', 'limpiezasduo@hotmail.com'),
    'nombre_comercial' => env('EMPRESA_NOMBRE_COMERCIAL', 'LIMPIEZAS DÚO'),
];
