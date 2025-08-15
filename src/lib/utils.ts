import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Error logging utility
export function logError(error: Error, context: string) {
  const timestamp = new Date().toISOString()
  console.error(`[${timestamp}] Casino Error in ${context}:`, error)
}

// Random number generators for casino games
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Slot machine symbols
export const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🔔', '7️⃣']

export function getRandomSlotSymbol(): string {
  return SLOT_SYMBOLS[getRandomInt(0, SLOT_SYMBOLS.length - 1)]
}

// Roulette numbers and colors
export const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i) // 0-36
export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
export const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

export function getRouletteColor(number: number): 'red' | 'black' | 'green' {
  if (number === 0) return 'green'
  return RED_NUMBERS.includes(number) ? 'red' : 'black'
}

// Card utilities for Blackjack and Poker
export const CARD_SUITS = ['♠', '♥', '♦', '♣']
export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export interface Card {
  suit: string
  value: string
  numericValue: number
}

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of CARD_SUITS) {
    for (const value of CARD_VALUES) {
      let numericValue = parseInt(value)
      if (value === 'A') numericValue = 11
      else if (['J', 'Q', 'K'].includes(value)) numericValue = 10
      
      deck.push({ suit, value, numericValue })
    }
  }
  return shuffleDeck(deck)
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function calculateBlackjackValue(cards: Card[]): number {
  let value = 0
  let aces = 0
  
  for (const card of cards) {
    if (card.value === 'A') {
      aces++
      value += 11
    } else {
      value += card.numericValue
    }
  }
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }
  
  return value
}

// Formatting utilities
export function formatCoins(coins: number): string {
  return coins.toLocaleString()
}

export function formatTime(date: Date): string {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// Daily rewards logic
export function canClaimDailyReward(lastClaimDate: string | null): boolean {
  if (!lastClaimDate) return true
  
  const lastClaim = new Date(lastClaimDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - lastClaim.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays >= 1
}

export function getDailyRewardAmount(): number {
  return getRandomInt(100, 500) // Random daily bonus between 100-500 coins
}

// Achievement checking
export interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
  unlockedAt?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game',
    unlocked: false
  },
  {
    id: 'three_in_row',
    title: 'Hot Streak',
    description: 'Win 3 games in a row',
    unlocked: false
  },
  {
    id: 'jackpot',
    title: 'Jackpot Winner',
    description: 'Hit a jackpot in slots',
    unlocked: false
  },
  {
    id: 'high_roller',
    title: 'High Roller',
    description: 'Accumulate 10,000 coins',
    unlocked: false
  },
  {
    id: 'blackjack_21',
    title: 'Perfect 21',
    description: 'Get a natural blackjack',
    unlocked: false
  },
  {
    id: 'roulette_lucky',
    title: 'Lucky Number',
    description: 'Win on a single number bet in roulette',
    unlocked: false
  }
]

// Local storage utilities with error handling
export function saveToLocalStorage(key: string, data: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    logError(error as Error, `saveToLocalStorage - key: ${key}`)
    return false
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    logError(error as Error, `loadFromLocalStorage - key: ${key}`)
    return defaultValue
  }
}
