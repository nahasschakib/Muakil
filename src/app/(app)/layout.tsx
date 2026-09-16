import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4 shrink-0">
        <Link href="/agents" className="font-bold text-lg tracking-tight">
          MUAKIL
        </Link>
        <nav className="flex items-center gap-1 ml-4">
          <Link
            href="/agents"
            className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Agents
          </Link>
          <Link
            href="/brand-kit"
            className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Brand Kit
          </Link>
          <Link
            href="/livrables"
            className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Livrables
          </Link>
        </nav>
        <div className="ml-auto">
          <UserButton />
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  )
}
