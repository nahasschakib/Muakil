'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import ReactMarkdown from 'react-markdown'
import { saveLivrable } from '@/app/(app)/livrables/actions'
import type { Agent } from '@/lib/agents'
import type { BrandKit } from '@prisma/client'
import remarkGfm from 'remark-gfm'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function SaveButton({
  content,
  agentSlug,
  agentPrenom,
}: {
  content: string
  agentSlug: string
  agentPrenom: string
}) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function handleSave() {
    setStatus('saving')
    try {
      const firstLine = content.split('\n').find((l) => l.trim()) ?? 'Livrable sans titre'
      const title = firstLine.replace(/^#+\s*/, '').slice(0, 80)
      await saveLivrable({ agentSlug, title, content })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={status === 'saving' || status === 'saved'}
      className="self-start text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
    >
      {status === 'idle' && '📎 Enregistrer'}
      {status === 'saving' && 'Enregistrement…'}
      {status === 'saved' && '✅ Enregistré'}
      {status === 'error' && '❌ Erreur'}
    </button>
  )
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
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        h1: ({ children }) => <h1 className="mb-2 text-base font-bold">{children}</h1>,
                        h2: ({ children }) => <h2 className="mb-2 text-sm font-bold">{children}</h2>,
                        h3: ({ children }) => <h3 className="mb-1 text-sm font-semibold">{children}</h3>,
                        hr: () => <hr className="my-2 border-border" />,
                        code: ({ children }) => <code className="rounded bg-background/50 px-1 py-0.5 font-mono text-xs">{children}</code>,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="w-full text-xs border-collapse">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-background/60">{children}</thead>,
                        tbody: ({ children }) => <tbody>{children}</tbody>,
                        tr: ({ children }) => <tr className="border-b border-border/50">{children}</tr>,
                        th: ({ children }) => (
                          <th className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="px-3 py-2 text-muted-foreground">{children}</td>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
                {msg.role === 'assistant' && (
                  <SaveButton
                    content={msg.content}
                    agentSlug={agent.slug}
                    agentPrenom={agent.prenom}
                  />
                )}
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
