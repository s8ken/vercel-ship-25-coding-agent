export async function GET() {
  // Mock health data - replace with actual Blackbox health check
  const agents = [
    {
      id: "intelligence_analyst",
      healthy: true,
      last_beat: new Date().toISOString(),
    },
    {
      id: "cybersecurity_sentinel",
      healthy: true,
      last_beat: new Date().toISOString(),
    },
    {
      id: "field_commander",
      healthy: true,
      last_beat: new Date().toISOString(),
    },
    {
      id: "overseer_liaison",
      healthy: true,
      last_beat: new Date().toISOString(),
    },
  ]

  return Response.json(agents)
}
