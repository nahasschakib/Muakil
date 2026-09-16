import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header style={{
        height: 56, borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: 32,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <Link href="/agents" style={{
          fontWeight: 700, fontSize: 18, letterSpacing: '-0.03em',
          color: 'var(--foreground)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          MU<span style={{ color: 'oklch(0.38 0.16 22)' }}>A</span>KIL
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {[
            { href: '/agents', label: 'Agents' },
            { href: '/brand-kit', label: 'Brand Kit' },
            { href: '/livrables', label: 'Livrables' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="mu-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Avatar */}
        <UserButton />
      </header>

      <main style={{ flex: 1, background: 'var(--background)' }}>
        {children}
      </main>
    </div>
  )
}
