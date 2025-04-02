<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ComplejidadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $nivel = $this->route('nivel');

        return [
            'nivel' => 'required|in:A,B,C|unique:complejidades,nivel,' . $nivel . ',nivel',
            'descripcion' => 'nullable|string|max:255',
            'porcentaje' => 'required|numeric|min:0|max:100',
            'plus_fijo' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'nivel.required' => 'El nivel de complejidad es obligatorio.',
            'nivel.in' => 'Solo se permiten los niveles A, B o C.',
            'nivel.unique' => 'Ese nivel ya existe.',
            'porcentaje.max' => 'El porcentaje no puede superar el 100%.',
        ];
    }
}
