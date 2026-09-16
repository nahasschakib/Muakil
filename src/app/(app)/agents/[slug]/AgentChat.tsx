'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import type { Agent } from '@/lib/agents'
import type { BrandKit } from '@prisma/client'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AgentChat({
  agent,
  orgId,
  brandKit,
}: {
  agent: Agent
  orgId: string
  brandKit: BrandKit | null
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text || isPending) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    startTransition(async () => {
      try {
        const res = await fetch(`/api/agents/${agent.slug}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            orgId,
          }),
        })

        if (!res.ok) throw new Error('Erreur API')

        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '❌ Une erreur est survenue. Réessaie.' },
        ])
      }
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header agent */}
      <div className="border-b border-border bg-card px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="text-2xl">{agent.emoji}</span>
          <div>
            <h1 className="font-semibold text-sm">{agent.prenom}</h1>
            <p className="text-xs text-muted-foreground">{agent.role}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl">{agent.emoji}</span>
              <p className="mt-3 font-medium">Bonjour, je suis {agent.prenom}</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                {agent.description}
              </p>
              {brandKit && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Je travaille pour <span className="font-medium">{brandKit.brandName}</span>
                </p>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={`Demande quelque chose à ${agent.prenom}…`}
            disabled={isPending}
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={isPending || !input.trim()}
            className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
