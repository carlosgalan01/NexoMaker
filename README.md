# NexoMaker · prototipo web

Primera iteración visual del comercio electrónico ficticio NexoMaker, creado como apoyo al caso práctico de la Unidad 2 de Generative AI.

## Qué demuestra esta versión

- Una tienda especializada y madura, no una simple landing.
- Catálogo navegable con información técnica y compatibilidades.
- Carrito visual y detalle de producto.
- Tres escenarios guiados de Nexo Assist.
- Separación explícita entre una demostración simulada y un sistema de IA real.

Nexo Assist todavía no llama a ningún modelo. Su comportamiento es determinista y sirve para validar el flujo antes de diseñar el piloto con RAG, reglas de compatibilidad, métricas y controles.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Despliegue

El proyecto está preparado para importarse directamente en Vercel. No necesita variables de entorno en esta versión.
