// Model → Agent routing configuration
export interface AgentConfig {
  agent: string
  classification: string
  compartments: string[]
}

export const MODEL_ROUTING: Record<string, AgentConfig> = {
  "symbi-intel-analyst-001": {
    agent: "intelligence_analyst",
    classification: "C",
    compartments: ["OPS"],
  },
  "symbi-cyber-sentinel-001": {
    agent: "cybersecurity_sentinel",
    classification: "S",
    compartments: ["OPS", "GOVNET"],
  },
  "symbi-field-commander-001": {
    agent: "field_commander",
    classification: "C",
    compartments: ["OPS"],
  },
}

export function getAgentConfig(model: string): AgentConfig | null {
  return MODEL_ROUTING[model] || null
}

export function getAvailableModels(): string[] {
  return Object.keys(MODEL_ROUTING)
}
