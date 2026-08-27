# NexoMaker Studio

MVP academico para el caso practico de la Unidad 3 de Generative AI. Permite demostrar un flujo de creacion de campanas con imagen, edicion de texto, historial, roles y comentarios.

## Relacion con NexoMaker

El MVP se ejecuta como una web independiente para poder probarlo sin modificar la tienda. En una version real seria un modulo interno de NexoMaker, no una herramienta publica separada. Recibiria del catalogo las fichas de producto ya revisadas, prepararia propuestas desde un briefing y enviaria la pieza aprobada al gestor de contenidos o al canal de campana correspondiente.

La generacion no decide que se publica. Disenadores y redactores preparan borradores; el aprobador comprueba datos, tono y derechos. Los motivos de rechazo y los resultados de las campanas servirian para mejorar las instrucciones y comparar modelos.

## Estado real

- Sin credenciales, funciona en modo demostracion y lo indica en pantalla.
- Con una clave de Amazon Bedrock, las rutas del servidor llaman a Stability AI y Claude. Cada modelo utiliza su region disponible.
- Los roles y comentarios se guardan solo durante la sesion. Una version de produccion necesitaria autenticacion y base de datos.
- La demo no esta conectada al catalogo ni al gestor de contenidos de NexoMaker. Esa integracion se describe como siguiente fase y no se presenta como terminada.

## Ejecutar

1. Instalar dependencias: `npm install` (o abrir la carpeta en VS Code y aceptar la instalacion sugerida).
2. Duplicar `.env.example` como `.env.local` desde el Explorador de VS Code y anadir la clave de Bedrock.
3. Ejecutar `npm run dev` (o usar el boton Run and Debug de VS Code).
4. Abrir `http://localhost:3000`.

## Variables

No se debe subir `.env.local` a GitHub. Para Vercel, se configuran en Project Settings > Environment Variables.
