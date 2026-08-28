import { NextResponse } from "next/server";
import { signedBedrockFetch } from "../../../lib/bedrock";

const instructions: Record<string, string> = {
  resumir: "Resume el texto conservando el mensaje comercial y los datos verificables.",
  ampliar: "Amplia el texto con informacion util, sin inventar especificaciones ni promesas.",
  corregir: "Corrige gramatica y estilo. Hazlo claro, directo y profesional.",
  variar: "Genera una variacion con un enfoque distinto, sin cambiar los hechos.",
};

export async function POST(request: Request) {
  const { text, action, tone = "directo" } = await request.json();
  if (!text?.trim() || !instructions[action]) {
    return NextResponse.json({ error: "Faltan el texto o la accion." }, { status: 400 });
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return NextResponse.json({ demo: true, output: demoEdit(text, action) });
  }

  const region = process.env.AWS_REGION || "eu-west-3";
  const modelId = process.env.BEDROCK_TEXT_MODEL_ID || "eu.anthropic.claude-haiku-4-5-20251001-v1:0";
  const body = JSON.stringify({
    system: [{ text: "Eres el editor de NexoMaker Studio. Ayudas a crear contenido comercial claro y util. No inventes datos tecnicos, precios, certificaciones ni afirmaciones no proporcionadas. Devuelve solo el texto final." }],
    messages: [{ role: "user", content: [{ text: `${instructions[action]} Tono: ${tone}.\n\n${text}` }] }],
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
    return NextResponse.json({ demo: false, output: data.output?.message?.content?.[0]?.text || "" });
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
  if (action === "resumir") return `${clean.slice(0, 180)}${clean.length > 180 ? "..." : ""}`;
  if (action === "ampliar") return `${clean}\n\nLa propuesta se completa con una imagen centrada en el producto, una llamada a la accion clara y especificaciones revisadas antes de publicar.`;
  if (action === "corregir") return clean.charAt(0).toUpperCase() + clean.slice(1).replace(/!+/g, ".");
  return `Una forma distinta de contarlo: ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
}
