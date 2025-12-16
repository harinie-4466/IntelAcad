"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-cyan-800 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-background border border-border rounded-lg shadow-xl transition-all duration-200 ${
            isMinimized ? "w-80 h-12" : "w-80 h-96"
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-cyan-800 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-cyan-700"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-cyan-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col h-80">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="text-muted-foreground">
                      Hello! I'm your AI assistant. How can I help you with your academic journey today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-border">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800"
                  />
                  <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700 text-white">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
