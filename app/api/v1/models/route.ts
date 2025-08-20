import { getAvailableModels } from "@/lib/model-routing"

export async function GET() {
  const models = getAvailableModels().map((id) => ({
    id,
    object: "model",
    created: Math.floor(Date.now() / 1000),
    owned_by: "symbi",
    context_length: 32768,
    max_output_tokens: 4096,
  }))

  return Response.json({
    object: "list",
    data: models,
  })
}
