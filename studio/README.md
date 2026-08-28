# NexoMaker Studio

MVP academico para el caso practico de la Unidad 3 de Generative AI. Permite preparar una campana desde un briefing, generar su imagen, crear o adaptar el texto, conservar versiones y dejar comentarios antes de publicar.

## Relacion con NexoMaker

El MVP se ejecuta como una web independiente para poder probarlo sin modificar la tienda. En una version real seria un modulo interno de NexoMaker, no una herramienta publica separada. Recibiria del catalogo las fichas de producto ya revisadas, prepararia propuestas desde un briefing y enviaria la pieza aprobada al gestor de contenidos o al canal de campana correspondiente.

La generacion no decide que se publica. Disenadores y redactores preparan borradores; el aprobador comprueba datos, tono y derechos. Los motivos de rechazo y los resultados de las campanas servirian para mejorar las instrucciones y comparar modelos.

## Estado real

- La version desplegada en Vercel utiliza Amazon Bedrock de forma real.
- Claude Haiku 4.5 crea y adapta el texto a partir del producto, el objetivo, el publico y el canal. Tambien resume, amplia, corrige y genera variaciones.
- El mismo modelo traduce y concreta las peticiones visuales antes de enviarlas al modelo de imagen.
- Stable Image Core genera las imagenes a partir del prompt refinado.
- Sin credenciales, la aplicacion conserva un modo demostracion y lo indica en pantalla.
- Los roles y comentarios se guardan solo durante la sesion. Una version de produccion necesitaria autenticacion y base de datos.
- La demo no esta conectada al catalogo ni al gestor de contenidos de NexoMaker. Esa integracion se describe como siguiente fase y no se presenta como terminada.

## Ejecutar

1. Instalar dependencias: `npm install` (o abrir la carpeta en VS Code y aceptar la instalacion sugerida).
2. Duplicar `.env.example` como `.env.local` desde el Explorador de VS Code y anadir las credenciales de AWS.
3. Ejecutar `npm run dev` (o usar el boton Run and Debug de VS Code).
4. Abrir `http://localhost:3000`.

## Variables

No se debe subir `.env.local` a GitHub. En Vercel, las credenciales se guardan en Project Settings > Environment Variables y solo las utilizan las rutas del servidor.
