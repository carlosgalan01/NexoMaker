import { NextResponse } from "next/server";

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

  const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
  if (!token) {
    return NextResponse.json({ demo: true, output: demoEdit(text, action) });
  }

  const region = process.env.BEDROCK_TEXT_REGION || "eu-west-1";
  const modelId = process.env.BEDROCK_TEXT_MODEL_ID || "eu.anthropic.claude-haiku-4-5-20251001-v1:0";
  const response = await fetch(
    `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        system: [{ text: "Eres el editor de NexoMaker. No inventes datos tecnicos, precios ni certificaciones. Devuelve solo el texto final." }],
        messages: [{ role: "user", content: [{ text: `${instructions[action]} Tono: ${tone}.\n\n${text}` }] }],
        inferenceConfig: { maxTokens: 700, temperature: 0.4 },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json({ error: "Bedrock no pudo editar el texto.", detail }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json({ demo: false, output: data.output?.message?.content?.[0]?.text || "" });
}

function demoEdit(text: string, action: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (action === "resumir") return `${clean.slice(0, 180)}${clean.length > 180 ? "..." : ""}`;
  if (action === "ampliar") return `${clean}\n\nLa propuesta se completa con una imagen centrada en el producto, una llamada a la accion clara y especificaciones revisadas antes de publicar.`;
  if (action === "corregir") return clean.charAt(0).toUpperCase() + clean.slice(1).replace(/!+/g, ".");
  return `Una forma distinta de contarlo: ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
}
