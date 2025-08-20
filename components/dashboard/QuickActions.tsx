"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Archive, Upload } from "lucide-react"

const quickActions = [
  {
    title: "NEW CONVERSATION",
    subtitle: "Start SYMBI session",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-blue-500",
  },
  {
    title: "LOG DECISION",
    subtitle: "Archive choice",
    icon: Archive,
    href: "/decisions",
    color: "bg-green-500",
  },
  {
    title: "UPLOAD PROTOTYPE",
    subtitle: "Share new idea",
    icon: Upload,
    href: "/prototypes",
    color: "bg-purple-500",
  },
]

export default function QuickActions() {
  return (
    <div className="border-4 border-black bg-white p-6" style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}>
      <div className="flex items-center gap-3 mb-6">
        <Plus className="w-6 h-6" />
        <h2 className="font-bold tracking-wide text-xl">QUICK LAUNCH</h2>
      </div>

      <div className="space-y-3">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button
              className={`w-full justify-start border-4 border-black ${action.color} text-black font-bold tracking-wide p-4 h-auto transition-all duration-200 hover:translate-x-1 hover:translate-y-1`}
              style={{
                boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "8px 8px 0px 0px rgba(0,0,0,1)"
              }}
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold tracking-wide text-sm">{action.title}</div>
                  <div className="text-xs opacity-75">{action.subtitle}</div>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
