<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // Necesario para verificar el hash
use App\Models\Usuario; // Importa tu modelo
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'nombre_usuario' => 'required|string',
            'password' => 'required|string', // Recibimos 'password' del frontend
        ]);

        // Busca al usuario por nombre_usuario
        $usuario = Usuario::where('nombre_usuario', $request->nombre_usuario)->first();

        // Verifica si el usuario existe Y si el hash coincide Y si está activo
        if (! $usuario || ! Hash::check($request->password, $usuario->password_hash) || !$usuario->activo) {
            throw ValidationException::withMessages([
                'nombre_usuario' => [__('auth.failed')], // Mensaje genérico de error
            ]);
        }

        // Verifica si el usuario ya tiene un token con el mismo nombre (opcional, para evitar múltiples tokens si no se desea)
        // $usuario->tokens()->where('name', 'api-token')->delete();

        // Crea el token de API para el usuario
        $token = $usuario->createToken('api-token')->plainTextToken; // Puedes nombrar el token como quieras

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $usuario, // Devuelve los datos del usuario (sin el hash)
        ]);
    }

    public function logout(Request $request)
    {
        // Revoca el token que se usó para autenticar la solicitud actual
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
