import { NextResponse } from "next/server";
import { signedBedrockFetch } from "../../../lib/bedrock";

const instructions: Record<string, string> = {
  crear: "Crea una primera propuesta completa a partir del briefing. No resumas los campos ni los presentes como una lista: conviertelos en una pieza de campana con una entrada atractiva, un desarrollo breve y una llamada a la accion.",
  adaptar: "Adapta el texto al canal indicado. Conserva los hechos y cambia solo la estructura, la longitud y la llamada a la accion cuando sea necesario.",
  resumir: "Resume el texto conservando el mensaje comercial y los datos verificables.",
  ampliar: "Amplia el texto con informacion util, sin inventar especificaciones ni promesas.",
  corregir: "Corrige gramatica y estilo. Hazlo claro, directo y profesional.",
  variar: "Genera una variacion con un enfoque distinto, sin cambiar los hechos.",
};

export async function POST(request: Request) {
  const { text = "", action, tone = "directo", product = "", objective = "", audience = "", channel = "", angle = "", cta = "", facts = "" } = await request.json();
  if (!instructions[action] || (action !== "crear" && !text?.trim())) {
    return NextResponse.json({ error: "Faltan el texto o la accion." }, { status: 400 });
  }
  if (action === "crear" && (!product.trim() || !objective.trim() || !audience.trim() || !angle.trim() || !cta.trim() || !facts.trim())) {
    return NextResponse.json({ error: "Completa el briefing antes de crear la propuesta." }, { status: 400 });
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return NextResponse.json({ demo: true, output: demoEdit(text, action, product, audience, facts, cta) });
  }

  const region = process.env.AWS_REGION || "eu-west-3";
  const modelId = process.env.BEDROCK_TEXT_MODEL_ID || "eu.anthropic.claude-haiku-4-5-20251001-v1:0";
  const body = JSON.stringify({
    system: [{ text: "Eres el redactor de NexoMaker Studio. Tu trabajo no es repetir un briefing, sino convertirlo en una pieza de campana util. Adapta la estructura y la longitud al canal. Empieza con una frase que despierte interes, desarrolla una sola idea y termina con la llamada a la accion indicada. No uses titulos, etiquetas, Markdown ni asteriscos. La Informacion comprobada es tu unica fuente de afirmaciones sobre el producto: no deduzcas beneficios, resultados o mejoras que no aparezcan ahi. El enfoque orienta la narracion, pero no sirve como evidencia factual. No inventes precios, certificaciones, especificaciones ni promesas. Devuelve solo el texto final." }],
    messages: [{ role: "user", content: [{ text: `${instructions[action]}\n\nProducto: ${product}\nObjetivo: ${objective}\nPublico: ${audience}\nCanal: ${channel}\nEnfoque: ${angle}\nTono: ${tone}\nLlamada a la accion: ${cta}\nInformacion comprobada: ${facts}\n\nTexto actual:\n${text || "No existe todavia."}` }] }],
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
      system: [{ text: "Revisas un texto de campana antes de mostrarlo. Conserva su entrada, su tono, su estructura y su llamada a la accion. Elimina o reformula unicamente las afirmaciones sobre el producto que no esten respaldadas de forma directa por la Informacion comprobada. No conviertas el texto en una lista de datos ni lo reduzcas a un resumen. No uses Markdown. Devuelve solo el texto corregido." }],
      messages: [{ role: "user", content: [{ text: `Producto: ${product}\nObjetivo: ${objective}\nPublico: ${audience}\nCanal: ${channel}\nEnfoque: ${angle}\nTono: ${tone}\nLlamada a la accion: ${cta}\nInformacion comprobada:\n${facts}\n\nBorrador que debes comprobar:\n${draft}` }] }],
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

function demoEdit(text: string, action: string, product: string, audience: string, facts: string, cta: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (action === "crear") return `${product.trim()}: mas control cuando el proyecto lo necesita.\n\n${facts.trim()} Una propuesta dirigida a ${audience.toLowerCase()}.\n\n${cta.trim()}.`;
  if (action === "adaptar") return `${clean}\n\nConsulta la ficha del producto para conocer todos los detalles.`;
  if (action === "resumir") return `${clean.slice(0, 180)}${clean.length > 180 ? "..." : ""}`;
  if (action === "ampliar") return `${clean}\n\nLa propuesta se completa con una imagen centrada en el producto, una llamada a la accion clara y especificaciones revisadas antes de publicar.`;
  if (action === "corregir") return clean.charAt(0).toUpperCase() + clean.slice(1).replace(/!+/g, ".");
  return `Una forma distinta de contarlo: ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
}
