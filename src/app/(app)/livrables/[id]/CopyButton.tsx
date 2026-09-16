'use client'

import { useState } from 'react'

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
    >
      {copied ? '✅ Copié' : '📋 Copier'}
    </button>
  )
}
