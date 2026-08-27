import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt, style = "fotografia", aspectRatio = "16:9" } = await request.json();
  if (!prompt?.trim()) return NextResponse.json({ error: "Escribe una descripcion." }, { status: 400 });

  const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
  if (!token) {
    return NextResponse.json({ demo: true, image: "/campaign-demo.webp" });
  }

  const region = process.env.BEDROCK_IMAGE_REGION || "us-west-2";
  const modelId = process.env.BEDROCK_IMAGE_MODEL_ID || "stability.stable-image-core-v1:1";
  const safePrompt = `${prompt}. Estilo ${style}. Imagen comercial para una tienda de fabricacion digital. Sin logotipos, texto ni marcas registradas.`;
  const response = await fetch(
    `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/invoke`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prompt: safePrompt, aspect_ratio: aspectRatio, output_format: "png" }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json({ error: "Bedrock no pudo generar la imagen.", detail }, { status: response.status });
  }

  const data = await response.json();
  const generatedImage = data.images?.[0];
  if (!generatedImage) {
    return NextResponse.json({ error: "Bedrock no devolvio ninguna imagen." }, { status: 502 });
  }
  return NextResponse.json({ demo: false, image: `data:image/png;base64,${generatedImage}` });
}
