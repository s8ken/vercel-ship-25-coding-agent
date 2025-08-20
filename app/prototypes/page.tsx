"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lightbulb, Plus } from "lucide-react"

export default function Prototypes() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="font-bold tracking-wide text-4xl text-black mb-2">PROTOTYPE GALLERY</h1>
            <p className="text-lg text-gray-600">Innovation repository and idea sharing space</p>
          </div>
        </div>

        <div
          className="border-4 border-black bg-white p-12 text-center"
          style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        >
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="font-bold tracking-wide text-2xl text-gray-600 mb-4">PROTOTYPE SYSTEM READY</h2>
          <p className="text-gray-500 mb-6">Prototype management and sharing system is ready for implementation</p>
          <Button
            className="border-4 border-black bg-purple-500 text-black font-bold tracking-wide px-6 py-3"
            style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
          >
            <Plus className="w-5 h-5 mr-2" />
            NEW PROTOTYPE
          </Button>
        </div>
      </div>
    </div>
  )
}
