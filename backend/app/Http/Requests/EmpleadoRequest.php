<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmpleadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'nombre'    => 'required|string|max:100',
            'dni'       => 'nullable|string|max:20|unique:empleados,dni,' . $id . ',id_empleado',
            'telefono'  => 'nullable|string|max:20',
            'email'     => 'nullable|email|max:100',
            'puesto'    => 'nullable|string|max:100',
            'fecha_alta'=> 'nullable|date',
            'activo'    => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del empleado es obligatorio.',
            'dni.unique'      => 'El DNI ya está registrado para otro empleado.',
            'email.email'     => 'El correo electrónico no es válido.',
        ];
    }
}
