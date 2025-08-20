"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Activity, Archive, Lightbulb, ArrowRight } from "lucide-react"
import StatsGrid from "@/components/dashboard/StatsGrid"
import QuickActions from "@/components/dashboard/QuickActions"

// Mock data - replace with actual API calls
const mockStats = {
  conversations: 12,
  decisions: 8,
  projects: 3,
  prototypes: 15,
}

export default function Dashboard() {
  console.log("[v0] Dashboard component rendering")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold tracking-wide text-4xl text-black mb-2">SYMBI MISSION CONTROL</h1>
            <p className="text-lg text-gray-600">Command center for autonomous AI operations</p>
          </div>
          <div className="flex gap-4">
            <Link href="/chat">
              <Button
                className="border-4 border-black bg-green-500 text-black font-bold tracking-wide text-lg px-6 py-3 h-auto hover:bg-green-400 transition-all duration-200"
                style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                START SESSION
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={mockStats} isLoading={false} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* System Status */}
          <div className="lg:col-span-2">
            <div className="border-4 border-black bg-white p-6" style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6" />
                <h2 className="font-bold tracking-wide text-2xl">SYSTEM STATUS</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-4 border-black bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-bold tracking-wide">Intelligence Analyst</span>
                  </div>
                  <span className="text-sm text-gray-600">ONLINE</span>
                </div>

                <div className="flex items-center justify-between p-4 border-4 border-black bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-bold tracking-wide">Cybersecurity Sentinel</span>
                  </div>
                  <span className="text-sm text-gray-600">ONLINE</span>
                </div>

                <div className="flex items-center justify-between p-4 border-4 border-black bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-bold tracking-wide">Field Commander</span>
                  </div>
                  <span className="text-sm text-gray-600">ONLINE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <QuickActions />

            {/* Recent Activity */}
            <div className="border-4 border-black bg-white p-6" style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}>
              <h2 className="font-bold tracking-wide text-xl mb-6">RECENT ACTIVITY</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="border-4 border-black bg-blue-500 p-2"
                    style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                  >
                    <MessageSquare className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold tracking-wide text-sm">New conversation started</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="border-4 border-black bg-green-500 p-2"
                    style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                  >
                    <Archive className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold tracking-wide text-sm">Decision logged</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="border-4 border-black bg-purple-500 p-2"
                    style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                  >
                    <Lightbulb className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold tracking-wide text-sm">Prototype uploaded</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/chat" className="group">
            <div
              className="border-4 border-black bg-white p-6 transition-all duration-200 group-hover:translate-x-1 group-hover:translate-y-1"
              style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "8px 8px 0px 0px rgba(0,0,0,1)"
              }}
            >
              <MessageSquare className="w-8 h-8 mb-4" />
              <h3 className="font-bold tracking-wide text-xl mb-2">CHAT INTERFACE</h3>
              <p className="text-gray-600 mb-4">Communicate directly with SYMBI agents</p>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/decisions" className="group">
            <div
              className="border-4 border-black bg-white p-6 transition-all duration-200 group-hover:translate-x-1 group-hover:translate-y-1"
              style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "8px 8px 0px 0px rgba(0,0,0,1)"
              }}
            >
              <Archive className="w-8 h-8 mb-4" />
              <h3 className="font-bold tracking-wide text-xl mb-2">DECISION ARCHIVE</h3>
              <p className="text-gray-600 mb-4">Log and track strategic decisions</p>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/prototypes" className="group">
            <div
              className="border-4 border-black bg-white p-6 transition-all duration-200 group-hover:translate-x-1 group-hover:translate-y-1"
              style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "8px 8px 0px 0px rgba(0,0,0,1)"
              }}
            >
              <Lightbulb className="w-8 h-8 mb-4" />
              <h3 className="font-bold tracking-wide text-xl mb-2">PROTOTYPE GALLERY</h3>
              <p className="text-gray-600 mb-4">Innovation repository and idea sharing</p>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
