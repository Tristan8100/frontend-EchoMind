'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
import { api2 } from '@/lib/api'

export function ChatInterfaceChats({ messages = [], id }: { messages?: any[], id?: any }) {
  const [chatMessages, setChatMessages] = useState(messages)
  const [inputValue, setInputValue] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    scrollAreaRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setChatMessages(messages)
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [chatMessages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      sender: 'professor',
      message: inputValue,
      created_at: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, newMessage])
    setInputValue('')

    const response = await api2.post(`/api/messages/${id}`, { message: inputValue })
    console.log(response.data.response)

    const aiMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      message: response.data.response,
      created_at: new Date().toISOString(),
    }
    setChatMessages((prev) => [...prev, aiMessage])
  }

  const transformedMessages = chatMessages.map((message) => ({
    id: message.id,
    sender: message.sender,
    content: message.message,
    timestamp: new Date(message.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  return (
    <Card className="mx-0 sm:mx-2 sm:mx-4 bg-background md:mx-8 lg:mx-12 xl:mx-16 flex flex-col h-[calc(100vh-100px)]">
      <CardHeader className="pb-3">
        <h2 className="font-semibold text-lg">Professor AI Chat</h2>
      </CardHeader>

      {/* Scrollable message area */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 pb-4">
            {transformedMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === "professor" ? "flex-row-reverse text-right" : "flex-row"
                }`}
              >
                {/* Fallback initials instead of avatar */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold">
                  {message.sender === "professor" ? "P" : "AI"}
                </div>

                <div
                  className={`flex flex-col space-y-1 max-w-xs lg:max-w-md ${
                    message.sender === "professor" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.sender === "professor"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div ref={scrollAreaRef}></div>
        </ScrollArea>
      </CardContent>

      {/* Fixed input area at the bottom */}
      <CardFooter className="pt-3 pb-6 bg-background">
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
