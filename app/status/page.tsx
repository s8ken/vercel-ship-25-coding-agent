"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "pass" | "fail"
  message: string
  timestamp?: string
  duration?: number
}

export default function StatusPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Models Endpoint", status: "pending", message: "Not tested" },
    { name: "Health Endpoint", status: "pending", message: "Not tested" },
    { name: "Chat Completion (Non-Stream)", status: "pending", message: "Not tested" },
    { name: "Chat Completion (Stream)", status: "pending", message: "Not tested" },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const baseUrl = window.location.origin

    // Test Models Endpoint
    await runTest("Models Endpoint", async () => {
      const response = await fetch(`${baseUrl}/api/v1/models`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (!data.data || !Array.isArray(data.data)) throw new Error("Invalid models response")
      return `Found ${data.data.length} models`
    })

    // Test Health Endpoint
    await runTest("Health Endpoint", async () => {
      const response = await fetch(`${baseUrl}/api/agents/health`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (!Array.isArray(data)) throw new Error("Invalid health response")
      const healthy = data.filter((agent) => agent.healthy).length
      return `${healthy}/${data.length} agents healthy`
    })

    // Test Non-Stream Chat
    await runTest("Chat Completion (Non-Stream)", async () => {
      const response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "symbi-intel-analyst-001",
          messages: [{ role: "user", content: "Test message for status check" }],
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) throw new Error("Invalid completion response")
      return `${data.usage?.total_tokens || 0} tokens used`
    })

    // Test Stream Chat
    await runTest("Chat Completion (Stream)", async () => {
      const response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "symbi-intel-analyst-001",
          messages: [{ role: "user", content: "Stream test" }],
          stream: true,
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!response.body) throw new Error("No stream body")

      const reader = response.body.getReader()
      let chunks = 0
      let hasUsage = false
      let hasDone = false

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = new TextDecoder().decode(value)
          const lines = text.split("\n").filter((line) => line.startsWith("data: "))

          for (const line of lines) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              hasDone = true
            } else if (data.trim()) {
              try {
                const parsed = JSON.parse(data)
                if (parsed.usage) hasUsage = true
                chunks++
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      if (!hasDone) throw new Error("Stream did not end with [DONE]")
      if (!hasUsage) throw new Error("Stream did not include usage event")
      return `${chunks} chunks, usage included, [DONE] received`
    })

    setIsRunning(false)
  }

  const runTest = async (testName: string, testFn: () => Promise<string>) => {
    const startTime = Date.now()

    setTests((prev) =>
      prev.map((test) =>
        test.name === testName
          ? { ...test, status: "pending", message: "Running...", timestamp: new Date().toISOString() }
          : test,
      ),
    )

    try {
      const result = await testFn()
      const duration = Date.now() - startTime

      setTests((prev) =>
        prev.map((test) => (test.name === testName ? { ...test, status: "pass", message: result, duration } : test)),
      )
    } catch (error: any) {
      const duration = Date.now() - startTime

      setTests((prev) =>
        prev.map((test) =>
          test.name === testName ? { ...test, status: "fail", message: error.message, duration } : test,
        ),
      )
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return "bg-green-500"
      case "fail":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">SYMBI STATUS</h1>
            <p className="text-lg text-gray-600">API endpoint health and functionality tests</p>
          </div>
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="border-4 border-black bg-blue-500 text-black font-bold px-6 py-3 h-auto"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                RUNNING TESTS
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                RUN TESTS
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.name}
              className="border-4 border-black bg-white p-6"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <h3 className="text-xl font-bold text-black">{test.name}</h3>
                </div>
                <div className={`border-4 border-black px-3 py-1 ${getStatusColor(test.status)}`}>
                  <span className="text-xs font-bold text-black">{test.status.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-2">{test.message}</p>

              {test.timestamp && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Last run: {new Date(test.timestamp).toLocaleString()}</span>
                  {test.duration && <span>Duration: {test.duration}ms</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-8 border-4 border-black bg-gray-50 p-6"
          style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
        >
          <h2 className="text-2xl font-bold text-black mb-4">TEST COMMANDS</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <strong>Models:</strong> curl -s {window.location.origin}/api/v1/models | jq
            </div>
            <div>
              <strong>Health:</strong> curl -s {window.location.origin}/api/agents/health | jq
            </div>
            <div>
              <strong>Chat:</strong> curl -s {window.location.origin}/api/v1/chat/completions -H 'Content-Type:
              application/json' -d '
              {`{"model":"symbi-intel-analyst-001","messages":[{"role":"user","content":"Test"}]}`}' | jq
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
