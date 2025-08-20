// SYMBI Brain Adapter - Translates OpenAI messages to Blackbox agent envelopes
interface OpenAIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

interface BlackboxEnvelope {
  agent: string
  classification: string
  compartments: string[]
  payload: {
    content: string
    context?: string
  }
}

interface BlackboxResponse {
  ok: boolean
  reply: {
    payload: {
      content: string
    }
  }
}

export async function sendToBlackbox(
  model: string,
  messages: OpenAIMessage[],
): Promise<{ content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  const { getAgentConfig } = await import("./model-routing")

  const agentConfig = getAgentConfig(model)
  if (!agentConfig) {
    throw new Error(`Unknown model: ${model}`)
  }

  // Build context from conversation history
  const context = messages
    .slice(0, -1)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")
  const userMessage = messages[messages.length - 1]

  const envelope: BlackboxEnvelope = {
    agent: agentConfig.agent,
    classification: agentConfig.classification,
    compartments: agentConfig.compartments,
    payload: {
      content: userMessage.content,
      context: context || undefined,
    },
  }

  const baseUrl = process.env.BLACKBOX_BASE_URL || "https://symbi.world/api/agents"
  const token = process.env.BLACKBOX_TOKEN

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${baseUrl}/send`, {
      method: "POST",
      headers,
      body: JSON.stringify(envelope),
    })

    if (!response.ok) {
      throw new Error(`Blackbox API error: ${response.status}`)
    }

    const result: BlackboxResponse = await response.json()

    if (!result.ok) {
      throw new Error("Blackbox processing failed")
    }

    // Estimate token usage (4 chars per token)
    const promptTokens = Math.ceil(JSON.stringify(envelope).length / 4)
    const completionTokens = Math.ceil(result.reply.payload.content.length / 4)

    return {
      content: result.reply.payload.content,
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
      },
    }
  } catch (error) {
    console.log("[v0] Blackbox API not available, using mock response:", error)

    const mockContent = `SYMBI ${agentConfig.agent.toUpperCase().replace("_", " ")} ONLINE\n\nReceived: "${userMessage.content}"\n\nThis is a mock response. Configure BLACKBOX_BASE_URL and BLACKBOX_TOKEN environment variables to connect to your agent infrastructure.\n\nAgent: ${agentConfig.agent}\nClassification: ${agentConfig.classification}\nCompartments: ${agentConfig.compartments.join(", ")}`

    return {
      content: mockContent,
      usage: {
        prompt_tokens: Math.ceil(JSON.stringify(envelope).length / 4),
        completion_tokens: Math.ceil(mockContent.length / 4),
        total_tokens: Math.ceil((JSON.stringify(envelope).length + mockContent.length) / 4),
      },
    }
  }
}
