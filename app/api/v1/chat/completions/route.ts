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
    const { model, messages, stream = false, max_tokens, temperature } = body

    console.log("[v0] Processing request for model:", model)
    console.log("[v0] Message count:", messages.length)
    console.log("[v0] Stream mode:", stream)

    // Generate request ID
    const rid = Math.random().toString(36).substring(2, 15)

    if (stream) {
      const encoder = new TextEncoder()

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const result = await sendToBlackbox(model, messages)

            // Send delta chunks
            const words = result.content.split(" ")
            for (let i = 0; i < words.length; i++) {
              const delta = i === 0 ? words[i] : " " + words[i]
              const chunk = {
                id: `chatcmpl-${rid}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model,
                choices: [
                  {
                    index: 0,
                    delta: { content: delta },
                    finish_reason: null,
                  },
                ],
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
              await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate streaming delay
            }

            // Send final chunk
            const finalChunk = {
              id: `chatcmpl-${rid}`,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model,
              choices: [
                {
                  index: 0,
                  delta: {},
                  finish_reason: "stop",
                },
              ],
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`))

            // Send usage event
            const usageEvent = {
              id: `chatcmpl-${rid}`,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model,
              usage: result.usage,
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(usageEvent)}\n\n`))

            // Send [DONE]
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        },
      })

      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "symbi-request-id": rid,
        "X-Plan": "thoughtful", // Updated plan type
        "X-SU-Remaining": "1000",
        "X-SU-Percent": "75",
        "X-Resets-At": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      return new Response(stream, { headers })
    }

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
      "X-Plan": "thoughtful", // Updated plan type
      "X-SU-Remaining": "1000",
      "X-SU-Percent": "75",
      "X-Resets-At": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Added resets timestamp
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
