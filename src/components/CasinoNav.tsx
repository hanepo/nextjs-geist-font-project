'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, formatCoins } from '@/lib/utils'
import { useCasinoStore } from '@/hooks/useCasinoStore'

interface NavItem {
  href: string
  label: string
  description?: string
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { href: '/casino', label: 'Home', description: 'Casino lobby' },
  { href: '/casino/settings', label: 'Settings', description: 'Game preferences' },
  { href: '/casino/leaderboard', label: 'Leaderboard', description: 'Top players' },
  { href: '/casino/achievements', label: 'Achievements', description: 'Your progress' }
]

const GAME_NAV_ITEMS: NavItem[] = [
  { href: '/casino/games/slot-machine', label: 'Slots', description: 'Spin to win' },
  { href: '/casino/games/roulette', label: 'Roulette', description: 'Place your bets' },
  { href: '/casino/games/blackjack', label: 'Blackjack', description: 'Beat the dealer' },
  { href: '/casino/games/poker', label: 'Poker', description: 'Play against bots' },
  { href: '/casino/games/dice', label: 'Dice', description: 'Roll for luck' }
]

interface CasinoNavProps {
  className?: string
  showGames?: boolean
  compact?: boolean
}

export function CasinoNav({ className, showGames = true, compact = false }: CasinoNavProps) {
  const pathname = usePathname()
  const { coins } = useCasinoStore()

  const isActive = (href: string) => {
    if (href === '/casino') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  if (compact) {
    return (
      <nav className={cn(
        "flex items-center justify-between p-4 bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-600/30",
        className
      )}>
        <Link 
          href="/casino"
          className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
          style={{ color: 'var(--casino-gold)' }}
        >
          🎰 Lucky Fun Casino
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-600/20 rounded-full border border-yellow-600/30">
            <span className="text-yellow-400 text-sm font-medium">💰</span>
            <span className="text-white font-bold">{formatCoins(coins)}</span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={cn(
      "bg-gradient-to-b from-black via-gray-900 to-black border-b border-yellow-600/30",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link 
          href="/casino"
          className="text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
          style={{ color: 'var(--casino-gold)' }}
        >
          🎰 Lucky Fun Casino
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
            <span className="text-yellow-400 text-lg">💰</span>
            <span className="text-white font-bold text-lg">{formatCoins(coins)}</span>
            <span className="text-gray-400 text-sm">coins</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {MAIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                "hover:bg-yellow-600/20 hover:border-yellow-600/50",
                "border border-transparent",
                isActive(item.href)
                  ? "bg-yellow-600/30 border-yellow-600/50 text-yellow-300"
                  : "text-gray-300 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Games Navigation */}
      {showGames && (
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Casino Games
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {GAME_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  "hover:bg-red-600/20 hover:border-red-600/50 hover:scale-105",
                  "group",
                  isActive(item.href)
                    ? "bg-red-600/30 border-red-600/50 text-red-300"
                    : "bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white"
                )}
                style={{
                  borderColor: isActive(item.href) ? 'var(--casino-red)' : undefined
                }}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1">{item.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          🎲 This game does not offer real money gambling or prizes. For entertainment only. 🎲
        </p>
      </div>
    </nav>
  )
}

// Mobile-friendly bottom navigation
export function CasinoBottomNav({ className }: { className?: string }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/casino') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const quickNavItems = [
    { href: '/casino', label: 'Home', icon: '🏠' },
    { href: '/casino/games/slot-machine', label: 'Slots', icon: '🎰' },
    { href: '/casino/games/roulette', label: 'Roulette', icon: '🎯' },
    { href: '/casino/games/blackjack', label: 'Cards', icon: '🃏' },
    { href: '/casino/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-yellow-600/30",
      "md:hidden", // Only show on mobile
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {quickNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              isActive(item.href)
                ? "text-yellow-400"
                : "text-gray-400 hover:text-white"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
