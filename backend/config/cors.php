<?php

return [

    // config/cors.php
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'], // Asegúrate de incluir 'login' y 'logout' si son rutas separadas
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')], // Usa una variable de entorno para la URL de tu React app (Vite default es 5173)
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ¡MUY IMPORTANTE para Sanctum!
];
