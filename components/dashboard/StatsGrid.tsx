import { MessageSquare, Archive, Lightbulb, TrendingUp } from "lucide-react"

interface StatsGridProps {
  stats: {
    conversations: number
    decisions: number
    projects: number
    prototypes: number
  }
  isLoading: boolean
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const statItems = [
    {
      title: "ACTIVE SESSIONS",
      value: stats.conversations,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      title: "LOGGED DECISIONS",
      value: stats.decisions,
      icon: Archive,
      color: "bg-green-500",
    },
    {
      title: "MISSION PROGRESS",
      value: stats.projects,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
    {
      title: "PROTOTYPES",
      value: stats.prototypes,
      icon: Lightbulb,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <div
          key={item.title}
          className="border-4 border-black bg-white p-6"
          style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`border-4 border-black ${item.color} p-3`}
              style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
            >
              <item.icon className="w-6 h-6 text-black" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 border-4 border-black animate-pulse"></div>
            ) : (
              <span className="font-bold tracking-wide text-3xl text-black">{item.value}</span>
            )}
          </div>
          <h3 className="font-bold tracking-wide text-sm text-gray-600">{item.title}</h3>
        </div>
      ))}
    </div>
  )
}
