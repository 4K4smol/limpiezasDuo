<?php

namespace App\Http\Requests\ServicioRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_servicio' => [
                'required',
                'string',
                'max:150',
                Rule::unique('servicios', 'nombre_servicio')
            ],
            'descripcion' => ['nullable', 'string'],
            'precio_hora' => ['required', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'activo' => ['sometimes', 'boolean'],
            'servicio_padre_id' => ['nullable', 'exists:servicios,id_servicio'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_servicio.required' => 'El nombre del servicio es obligatorio.',
            'nombre_servicio.unique' => 'Ya existe un servicio con este nombre.',
            'precio_hora.required' => 'El precio por hora es obligatorio.',
            'precio_hora.regex' => 'El precio debe tener hasta dos decimales.',
            'activo.boolean' => 'El campo activo debe ser verdadero o falso.',
            'servicio_padre_id.exists' => 'El servicio padre seleccionado no existe.',
        ];
    }
}
