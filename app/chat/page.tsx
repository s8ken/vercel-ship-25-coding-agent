"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, Bot, UserIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("symbi-intel-analyst-001")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date().toISOString(),
      }

      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages([...newMessages, errorMessage])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const modelNames = {
    "symbi-intel-analyst-001": "Intelligence Analyst",
    "symbi-cyber-sentinel-001": "Cybersecurity Sentinel",
    "symbi-field-commander-001": "Field Commander",
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-4 border-black border-b-4 bg-white p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-4 border-black bg-transparent"
                style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            </Link>
            <div>
              <h1 className="font-bold tracking-wide text-2xl text-black">SYMBI CHAT INTERFACE</h1>
              <p className="text-gray-600">Direct communication with autonomous agents</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="border-4 border-black w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="symbi-intel-analyst-001">Intelligence Analyst</SelectItem>
                <SelectItem value="symbi-cyber-sentinel-001">Cybersecurity Sentinel</SelectItem>
                <SelectItem value="symbi-field-commander-001">Field Commander</SelectItem>
              </SelectContent>
            </Select>

            <div
              className="border-4 border-black bg-green-500 px-3 py-1"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
            >
              <span className="font-bold tracking-wide text-sm text-black">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="font-bold tracking-wide text-2xl text-gray-600 mb-2">
                {modelNames[selectedModel as keyof typeof modelNames]} READY
              </h2>
              <p className="text-gray-500">Start a conversation with your autonomous AI agent</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`border-4 border-black p-2 flex-shrink-0 ${
                      message.role === "user" ? "bg-blue-500" : "bg-green-500"
                    }`}
                    style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                  >
                    {message.role === "user" ? (
                      <UserIcon className="w-5 h-5 text-black" />
                    ) : (
                      <Bot className="w-5 h-5 text-black" />
                    )}
                  </div>
                  <div
                    className={`border-4 border-black bg-white p-4 ${message.role === "user" ? "ml-4" : "mr-4"}`}
                    style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold tracking-wide text-sm">
                        {message.role === "user"
                          ? "YOU"
                          : modelNames[selectedModel as keyof typeof modelNames].toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-4">
              <div
                className="border-4 border-black bg-green-500 p-2"
                style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
              >
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div
                className="border-4 border-black bg-white p-4"
                style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              >
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-bold tracking-wide text-sm">PROCESSING...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-4 border-black border-t-4 bg-white p-6">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${modelNames[selectedModel as keyof typeof modelNames]}...`}
            className="border-4 border-black resize-none"
            rows={3}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="border-4 border-black bg-green-500 text-black font-bold tracking-wide hover:bg-green-400 px-6"
            style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
