import type { NextRequest } from "next/server"
import { sendToBlackbox } from "@/lib/blackbox-adapter"

interface ChatCompletionRequest {
  model: string
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
  }>
  stream?: boolean
  max_tokens?: number
  temperature?: number
}

export async function POST(request: NextRequest) {
  console.log("[v0] Chat completions API called")

  try {
    const body: ChatCompletionRequest = await request.json()
    const { model, messages, stream = false } = body

    console.log("[v0] Processing request for model:", model)
    console.log("[v0] Message count:", messages.length)

    // Generate request ID
    const rid = Math.random().toString(36).substring(2, 15)

    const result = await sendToBlackbox(model, messages)

    const response = {
      id: `chatcmpl-${rid}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant" as const,
            content: result.content,
          },
          finish_reason: "stop" as const,
        },
      ],
      usage: result.usage,
    }

    const headers = {
      "Content-Type": "application/json",
      "symbi-request-id": rid,
      "X-Plan": "pro",
      "X-SU-Remaining": "1000",
      "X-SU-Percent": "75",
    }

    console.log("[v0] Sending response with content length:", result.content.length)
    return new Response(JSON.stringify(response), { headers })
  } catch (error: any) {
    console.error("[v0] Chat completion error:", error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || "Internal server error",
          type: "api_error",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
