<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Puedes añadir lógica de permisos si lo necesitas
    }

    public function rules(): array
    {
        $id = $this->route('id'); // Para evitar conflicto en update

        return [
            'razon_social' => 'required|string|max:150',
            'cif' => 'required|string|max:20|unique:clientes,cif,' . $id . ',id_cliente',
            'codigo_postal' => 'nullable|string|max:10',
            'ciudad' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'activo' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'razon_social.required' => 'La razón social es obligatoria.',
            'razon_social.string' => 'La razón social debe ser una cadena de texto.',
            'razon_social.max' => 'La razón social no puede tener más de 150 caracteres.',

            'cif.required' => 'El CIF es obligatorio.',
            'cif.string' => 'El CIF debe ser una cadena de texto.',
            'cif.max' => 'El CIF no puede tener más de 20 caracteres.',
            'cif.unique' => 'Este CIF ya está registrado.',

            'codigo_postal.string' => 'El código postal debe ser una cadena de texto.',
            'codigo_postal.max' => 'El código postal no puede tener más de 10 caracteres.',

            'ciudad.string' => 'La ciudad debe ser una cadena de texto.',
            'ciudad.max' => 'La ciudad no puede tener más de 100 caracteres.',

            'telefono.string' => 'El teléfono debe ser una cadena de texto.',
            'telefono.max' => 'El teléfono no puede tener más de 20 caracteres.',

            'email.email' => 'El correo electrónico debe ser una dirección válida.',
            'email.max' => 'El correo electrónico no puede tener más de 100 caracteres.',

            'activo.boolean' => 'El campo activo debe ser verdadero o falso.',
        ];
    }

}
