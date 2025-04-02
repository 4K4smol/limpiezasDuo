<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDatosAutonomoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'nif' => 'required|string|max:20',
            'direccion' => 'required|string',
            'localidad' => 'required|string',
            'provincia' => 'required|string',
            'cp' => 'required|string|max:10',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'iban' => 'nullable|string|max:34',
            'info_adicional' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',

            'nif.required' => 'El NIF es obligatorio.',
            'nif.max' => 'El NIF no puede superar los 20 caracteres.',

            'direccion.required' => 'La dirección es obligatoria.',

            'localidad.required' => 'La localidad es obligatoria.',

            'provincia.required' => 'La provincia es obligatoria.',

            'cp.required' => 'El código postal es obligatorio.',
            'cp.max' => 'El código postal no puede superar los 10 caracteres.',

            'telefono.max' => 'El teléfono no puede superar los 20 caracteres.',

            'email.email' => 'El correo electrónico debe tener un formato válido.',
            'email.max' => 'El correo electrónico no puede superar los 100 caracteres.',

            'iban.max' => 'El IBAN no puede superar los 34 caracteres.',

            'info_adicional.string' => 'La información adicional debe ser texto.',
        ];
    }
}
