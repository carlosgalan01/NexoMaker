import { NextResponse } from "next/server";
import { signedBedrockFetch } from "../../../lib/bedrock";

async function refinePrompt(prompt: string, style: string) {
  const region = process.env.BEDROCK_TEXT_REGION || process.env.AWS_REGION || "eu-west-3";
  const modelId = process.env.BEDROCK_TEXT_MODEL_ID || "eu.anthropic.claude-haiku-4-5-20251001-v1:0";
  const body = JSON.stringify({
    system: [
      {
        text: "You are the image prompt editor for NexoMaker Studio. Rewrite the user's request as one concise, descriptive English prompt for an image generation model. Preserve the user's intent and requested style. Add useful visual details only when they are implied or harmless. Do not add brands, logos, written text, copyrighted characters, technical claims, prices, or certifications unless the user explicitly requested them. Return only the final English image prompt, with no explanation or quotation marks.",
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            text: `User request: ${prompt}\nPreferred style: ${style}`,
          },
        ],
      },
    ],
    inferenceConfig: { maxTokens: 220, temperature: 0.3 },
  });

  const endpoint = `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`;
  const response = await signedBedrockFetch(endpoint, body, region);

  if (!response.ok) {
    const detail = await response.text();
    console.error("Bedrock prompt refinement error", response.status, detail);
    throw new Error(`Prompt refinement failed: ${response.status}`);
  }

  const data = await response.json();
  const refinedPrompt = data.output?.message?.content?.[0]?.text?.trim();
  if (!refinedPrompt) throw new Error("Haiku did not return a refined prompt.");
  return refinedPrompt;
}

export async function POST(request: Request) {
  const { prompt, style = "fotografia", aspectRatio = "16:9" } = await request.json();
  if (!prompt?.trim()) return NextResponse.json({ error: "Escribe una descripcion." }, { status: 400 });

  const hasIamCredentials = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  if (!hasIamCredentials) {
    return NextResponse.json({ demo: true, image: "/campaign-demo.webp" });
  }

  try {
    const refinedPrompt = await refinePrompt(prompt, style);

    const region = process.env.BEDROCK_IMAGE_REGION || "us-west-2";
    const modelId = process.env.BEDROCK_IMAGE_MODEL_ID || "stability.stable-image-core-v1:1";
    const body = JSON.stringify({
      prompt: refinedPrompt,
      aspect_ratio: aspectRatio,
      output_format: "png",
      negative_prompt: "logos, watermarks, signatures, captions, written text",
    });
    const endpoint = `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/invoke`;
    const response = await signedBedrockFetch(endpoint, body, region, { accept: "application/json" });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Bedrock image error", response.status, detail);
      return NextResponse.json({ error: "Bedrock no pudo generar la imagen.", detail }, { status: response.status });
    }

    const data = await response.json();
    const finishReason = data.finish_reasons?.[0];
    if (finishReason) {
      console.warn("Stable Image filtered generation", finishReason, { refinedPrompt });
      return NextResponse.json(
        { error: "El modelo de imagen ha filtrado esta peticion. Prueba a reformularla.", detail: finishReason },
        { status: 400 },
      );
    }

    const generatedImage = data.images?.[0];
    if (!generatedImage) {
      return NextResponse.json({ error: "Bedrock no devolvio ninguna imagen." }, { status: 502 });
    }

    return NextResponse.json({
      demo: false,
      image: `data:image/png;base64,${generatedImage}`,
      refinedPrompt,
    });
  } catch (error) {
    console.error("Image generation pipeline error", error);
    return NextResponse.json({ error: "No se pudo completar la generacion de imagen." }, { status: 500 });
  }
}
