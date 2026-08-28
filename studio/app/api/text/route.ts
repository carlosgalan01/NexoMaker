import { NextResponse } from "next/server";
import { signedBedrockFetch } from "../../../lib/bedrock";

const instructions: Record<string, string> = {
  crear: "Crea una primera propuesta de texto a partir del briefing. Puedes anadir una llamada a la accion neutra, pero todas las afirmaciones sobre el producto deben aparecer literalmente en la informacion permitida.",
  adaptar: "Adapta el texto al canal indicado. Conserva los hechos y cambia solo la estructura, la longitud y la llamada a la accion cuando sea necesario.",
  resumir: "Resume el texto conservando el mensaje comercial y los datos verificables.",
  ampliar: "Amplia el texto con informacion util, sin inventar especificaciones ni promesas.",
  corregir: "Corrige gramatica y estilo. Hazlo claro, directo y profesional.",
  variar: "Genera una variacion con un enfoque distinto, sin cambiar los hechos.",
};

export async function POST(request: Request) {
  const { text = "", action, tone = "directo", product = "", objective = "", audience = "", channel = "", facts = "" } = await request.json();
  if (!instructions[action] || (action !== "crear" && !text?.trim())) {
    return NextResponse.json({ error: "Faltan el texto o la accion." }, { status: 400 });
  }
  if (action === "crear" && (!product.trim() || !objective.trim() || !audience.trim() || !facts.trim())) {
    return NextResponse.json({ error: "Completa el briefing antes de crear la propuesta." }, { status: 400 });
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return NextResponse.json({ demo: true, output: demoEdit(text, action) });
  }

  const region = process.env.AWS_REGION || "eu-west-3";
  const modelId = process.env.BEDROCK_TEXT_MODEL_ID || "eu.anthropic.claude-haiku-4-5-20251001-v1:0";
  const body = JSON.stringify({
    system: [{ text: "Eres el editor de NexoMaker Studio. Preparas textos comerciales claros y utiles a partir de un briefing. La seccion Informacion permitida es tu unica fuente de hechos sobre el producto. No deduzcas beneficios, resultados, problemas del cliente ni mejoras de rendimiento a partir de sus caracteristicas. Por ejemplo, una camara cerrada no permite afirmar por tu cuenta que habra mas precision, menos fallos o mejores piezas. No inventes datos tecnicos, precios, certificaciones ni promesas. Puedes cambiar el orden, el tono y la longitud, y puedes cerrar con una llamada a consultar la ficha. Si un dato no aparece, omitelo. Devuelve solo el texto final, sin explicar el proceso." }],
    messages: [{ role: "user", content: [{ text: `${instructions[action]}\n\nProducto: ${product}\nObjetivo: ${objective}\nPublico: ${audience}\nCanal: ${channel}\nTono: ${tone}\nInformacion permitida: ${facts}\n\nTexto actual:\n${text || "No existe todavia."}` }] }],
    inferenceConfig: { maxTokens: 700, temperature: 0.4 },
  });

  try {
    const response = await signedBedrockFetch(
      `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`,
      body,
      region,
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("Bedrock text error", response.status, detail);
      return NextResponse.json({ error: "Bedrock no pudo editar el texto.", detail }, { status: response.status });
    }

    const data = await response.json();
    const draft = data.output?.message?.content?.[0]?.text?.trim();
    if (!draft) return NextResponse.json({ error: "Haiku no devolvio ningun texto." }, { status: 502 });

    const verificationBody = JSON.stringify({
      system: [{ text: "Revisas textos de NexoMaker Studio antes de mostrarlos. La Informacion permitida es la unica fuente de afirmaciones sobre el producto. Reescribe el borrador y elimina cualquier beneficio, resultado, problema del cliente, caracteristica o promesa que no este respaldada de forma directa por esa informacion. El publico, el objetivo y el canal solo sirven para adaptar el tono y la longitud, no para inventar hechos. Puedes conservar una llamada neutra a consultar la ficha. Devuelve solo el texto corregido." }],
      messages: [{ role: "user", content: [{ text: `Informacion permitida:\n${facts}\n\nBorrador que debes comprobar:\n${draft}` }] }],
      inferenceConfig: { maxTokens: 700, temperature: 0 },
    });
    const verification = await signedBedrockFetch(
      `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`,
      verificationBody,
      region,
    );
    if (!verification.ok) {
      const detail = await verification.text();
      console.error("Bedrock text verification error", verification.status, detail);
      return NextResponse.json({ error: "No se pudo comprobar el texto generado." }, { status: verification.status });
    }
    const checkedData = await verification.json();
    const output = checkedData.output?.message?.content?.[0]?.text?.trim();
    if (!output) return NextResponse.json({ error: "Haiku no devolvio el texto comprobado." }, { status: 502 });
    return NextResponse.json({ demo: false, verified: true, output });
  } catch (error) {
    console.error("Bedrock connection error", error);
    return NextResponse.json(
      { error: "No se pudo conectar con Amazon Bedrock.", detail: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

function demoEdit(text: string, action: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (action === "crear") return "Descubre una impresora 3D cerrada pensada para talleres y makers que quieren trabajar con materiales tecnicos y mantener un mayor control de la temperatura. Consulta la ficha del producto antes de elegir tu configuracion.";
  if (action === "adaptar") return `${clean}\n\nConsulta la ficha del producto para conocer todos los detalles.`;
  if (action === "resumir") return `${clean.slice(0, 180)}${clean.length > 180 ? "..." : ""}`;
  if (action === "ampliar") return `${clean}\n\nLa propuesta se completa con una imagen centrada en el producto, una llamada a la accion clara y especificaciones revisadas antes de publicar.`;
  if (action === "corregir") return clean.charAt(0).toUpperCase() + clean.slice(1).replace(/!+/g, ".");
  return `Una forma distinta de contarlo: ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
}
