<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura {{ $factura->numero_factura }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; margin: 0 30px; }
        h2 { margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .totales { margin-top: 30px; width: 50%; float: right; }
        .totales td { padding: 6px; }
    </style>
</head>
<body>
    <h2>Factura Nº {{ $factura->numero_factura }}</h2>

    <p><strong>Fecha de emisión:</strong> {{ $factura->fecha_emision }}</p>
    <p><strong>Cliente:</strong> {{ $factura->cliente->razon_social }} (ID: {{ $factura->id_cliente }})</p>

    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($factura->detalles as $item)
                <tr>
                    <td>{{ $item->descripcion_concepto }}</td>
                    <td>{{ $item->cantidad }}</td>
                    <td>{{ number_format($item->precio_unitario, 2) }} €</td>
                    <td>{{ number_format($item->subtotal, 2) }} €</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totales">
        <tr>
            <td><strong>Base imponible:</strong></td>
            <td>{{ number_format($factura->base_imponible, 2) }} €</td>
        </tr>
        <tr>
            <td><strong>IVA ({{ $factura->iva_porcentaje }}%):</strong></td>
            <td>{{ number_format($factura->iva_importe, 2) }} €</td>
        </tr>
        @if($factura->retencion_porcentaje > 0)
        <tr>
            <td><strong>Retención ({{ $factura->retencion_porcentaje }}%):</strong></td>
            <td>-{{ number_format($factura->retencion_importe, 2) }} €</td>
        </tr>
        @endif
        <tr>
            <td><strong>Total:</strong></td>
            <td><strong>{{ number_format($factura->total_factura, 2) }} €</strong></td>
        </tr>
    </table>
</body>
</html>
