<?php

namespace App\Http\Requests\ServicioRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Asegúrate de protegerlo con middleware si es necesario
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:150|unique:servicios,nombre',
            'descripcion' => 'nullable|string',
            'precio_hora' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'parent_id_servicio' => 'nullable|exists:servicios,id_servicio',
        ];
    }

    public function messages()
    {
        return [
            'nombre.required' => 'El nombre del servicio es obligatorio.',
            'nombre.string' => 'El nombre del servicio debe ser una cadena de texto.',
            'nombre.max' => 'El nombre del servicio no debe superar los 150 caracteres.',
            'nombre.unique' => 'Ya existe un servicio con este nombre.',

            'descripcion.string' => 'La descripción debe ser una cadena de texto.',

            'precio_hora.required' => 'El precio por hora es obligatorio.',
            'precio_hora.numeric' => 'El precio por hora debe ser un valor numérico.',
            'precio_hora.min' => 'El precio por hora debe ser al menos 0.',

            'is_active.boolean' => 'El campo de estado debe ser verdadero o falso.',

            'parent_id_servicio.exists' => 'El servicio padre seleccionado no existe.',
        ];
    }
}
