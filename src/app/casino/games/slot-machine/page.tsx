'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CasinoNav } from '@/components/CasinoNav'
import { useCasinoStore } from '@/hooks/useCasinoStore'
import { useCasinoSounds } from '@/components/SoundManager'
import { formatCoins, getRandomSlotSymbol, SLOT_SYMBOLS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SlotReel {
  symbol: string
  isSpinning: boolean
}

const BET_AMOUNTS = [50, 100, 250, 500, 1000]

const PAYOUT_TABLE = {
  '🍒🍒🍒': 500,
  '🍋🍋🍋': 750,
  '🍊🍊🍊': 1000,
  '🍇🍇🍇': 1250,
  '⭐⭐⭐': 2000,
  '💎💎💎': 5000,
  '🔔🔔🔔': 3000,
  '7️⃣7️⃣7️⃣': 10000, // JACKPOT!
}

export default function SlotMachinePage() {
  const { 
    coins, 
    updateCoins, 
    unlockAchievement,
    winStreak,
    isLoaded 
  } = useCasinoStore()
  
  const { playSlot, playWin, playLose, playJackpot, playCoin } = useCasinoSounds()
  
  const [reels, setReels] = useState<SlotReel[]>([
    { symbol: '🍒', isSpinning: false },
    { symbol: '🍋', isSpinning: false },
    { symbol: '🍊', isSpinning: false }
  ])
  
  const [currentBet, setCurrentBet] = useState(BET_AMOUNTS[0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [spinHistory, setSpinHistory] = useState<Array<{symbols: string[], payout: number, bet: number}>>([])

  // Animation keyframes for spinning reels
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slot-spin {
        0% { transform: translateY(0); }
        25% { transform: translateY(-100px); }
        50% { transform: translateY(-200px); }
        75% { transform: translateY(-300px); }
        100% { transform: translateY(0); }
      }
      
      .slot-reel-spinning {
        animation: slot-spin 0.1s linear infinite;
      }
      
      @keyframes jackpot-glow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
          transform: scale(1.05);
        }
      }
      
      .jackpot-animation {
        animation: jackpot-glow 1s ease-in-out infinite;
      }
      
      @keyframes win-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .win-animation {
        animation: win-pulse 0.5s ease-in-out 3;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const spin = async () => {
    if (coins < currentBet || isSpinning) return
    
    setIsSpinning(true)
    setShowResult(false)
    setLastWin(0)
    
    // Deduct bet amount
    updateCoins(-currentBet, false)
    
    // Start spinning animation
    setReels(prev => prev.map(reel => ({ ...reel, isSpinning: true })))
    playSlot()
    
    // Simulate spinning duration
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate results
    const newSymbols = [
      getRandomSlotSymbol(),
      getRandomSlotSymbol(),
      getRandomSlotSymbol()
    ]
    
    // Stop spinning with results
    setReels(newSymbols.map(symbol => ({ symbol, isSpinning: false })))
    
    // Calculate payout
    const symbolString = newSymbols.join('')
    const payout = PAYOUT_TABLE[symbolString as keyof typeof PAYOUT_TABLE] || 0
    
    // Check for partial matches (2 out of 3)
    const partialPayout = getPartialPayout(newSymbols)
    const totalPayout = payout || partialPayout
    
    // Update coins and show result
    if (totalPayout > 0) {
      updateCoins(totalPayout, true)
      setLastWin(totalPayout)
      
      // Check for jackpot achievement
      if (payout === 10000) {
        unlockAchievement('jackpot')
        playJackpot()
      } else {
        playWin()
      }
    } else {
      playLose()
    }
    
    // Add to history
    setSpinHistory(prev => [
      { symbols: newSymbols, payout: totalPayout, bet: currentBet },
      ...prev.slice(0, 4) // Keep last 5 spins
    ])
    
    setShowResult(true)
    setIsSpinning(false)
    
    // Play coin sound for wins
    if (totalPayout > 0) {
      setTimeout(() => playCoin(), 500)
    }
  }

  const getPartialPayout = (symbols: string[]): number => {
    // Check for two matching symbols
    const symbolCounts = symbols.reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    for (const [symbol, count] of Object.entries(symbolCounts)) {
      if (count === 2) {
        // Partial payout based on symbol value
        switch (symbol) {
          case '7️⃣': return currentBet * 2
          case '💎': return currentBet * 1.5
          case '🔔': return currentBet * 1.25
          case '⭐': return currentBet
          default: return Math.floor(currentBet * 0.5)
        }
      }
    }
    
    return 0
  }

  const getResultMessage = () => {
    if (!showResult) return ''
    
    if (lastWin === 10000) {
      return '🎉 JACKPOT! 🎉'
    } else if (lastWin > currentBet * 5) {
      return '🔥 BIG WIN! 🔥'
    } else if (lastWin > 0) {
      return '✨ You Win! ✨'
    } else {
      return '💔 Try Again!'
    }
  }

  const getResultColor = () => {
    if (lastWin === 10000) return 'text-yellow-400'
    if (lastWin > currentBet * 5) return 'text-orange-400'
    if (lastWin > 0) return 'text-green-400'
    return 'text-red-400'
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎰</div>
          <div className="text-xl text-white">Loading Slot Machine...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <CasinoNav compact />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              🎰 Slot Machine
            </h1>
            <p className="text-xl text-gray-300">
              Spin the reels and match symbols to win big!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Slot Machine */}
            <div className="lg:col-span-2">
              <Card className={cn(
                "bg-gradient-to-b from-gray-800 to-gray-900 border-yellow-600/50",
                lastWin === 10000 && showResult && "jackpot-animation"
              )}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-yellow-400">Lucky Slots</CardTitle>
                  <CardDescription>Match 3 symbols to win!</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Slot Reels */}
                  <div className="bg-black/50 p-6 rounded-lg border-2 border-yellow-600/30">
                    <div className="flex justify-center gap-4">
                      {reels.map((reel, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "w-24 h-24 bg-gray-700 border-2 border-yellow-600/50 rounded-lg",
                            "flex items-center justify-center text-5xl",
                            "overflow-hidden relative",
                            lastWin > 0 && showResult && "win-animation"
                          )}
                        >
                          <div className={cn(
                            "transition-all duration-200",
                            reel.isSpinning && "slot-reel-spinning"
                          )}>
                            {reel.isSpinning ? '🎰' : reel.symbol}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Result Display */}
                  {showResult && (
                    <div className="text-center space-y-2">
                      <div className={cn("text-2xl font-bold", getResultColor())}>
                        {getResultMessage()}
                      </div>
                      {lastWin > 0 && (
                        <div className="text-xl text-yellow-400">
                          Won: {formatCoins(lastWin)} coins!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bet Selection */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Select Bet Amount</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {BET_AMOUNTS.map(amount => (
                          <Button
                            key={amount}
                            variant={currentBet === amount ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentBet(amount)}
                            disabled={isSpinning || coins < amount}
                            className={cn(
                              currentBet === amount 
                                ? "bg-yellow-600 hover:bg-yellow-700 text-black" 
                                : "border-gray-600 text-gray-300 hover:bg-gray-700"
                            )}
                          >
                            {formatCoins(amount)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Spin Button */}
                    <div className="text-center">
                      <Button
                        onClick={spin}
                        disabled={isSpinning || coins < currentBet}
                        className={cn(
                          "text-2xl font-bold px-12 py-6 h-auto",
                          "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900",
                          "disabled:from-gray-600 disabled:to-gray-800"
                        )}
                      >
                        {isSpinning ? '🎰 SPINNING...' : `🎰 SPIN (${formatCoins(currentBet)})`}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Player Stats */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    💰 Your Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-yellow-400">
                      {formatCoins(coins)}
                    </div>
                    <div className="text-sm text-gray-400">coins</div>
                    {winStreak > 0 && (
                      <Badge className="bg-green-600">
                        🔥 {winStreak} win streak
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payout Table */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">💎 Payout Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(PAYOUT_TABLE).map(([symbols, payout]) => (
                      <div key={symbols} className="flex justify-between items-center">
                        <span className="text-2xl">{symbols.replace(/(.)/g, '$1 ')}</span>
                        <span className={cn(
                          "font-bold",
                          payout === 10000 ? "text-yellow-400" : "text-green-400"
                        )}>
                          {formatCoins(payout)}
                          {payout === 10000 && " 🎉"}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-600">
                      <div className="text-xs text-gray-400">
                        • 2 matching symbols = partial payout
                        • Higher bets = higher potential wins
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Spins */}
              {spinHistory.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">📊 Recent Spins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {spinHistory.map((spin, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-lg">{spin.symbols.join(' ')}</span>
                          <div className="text-right">
                            <div className={cn(
                              "font-bold",
                              spin.payout > 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {spin.payout > 0 ? '+' : '-'}{formatCoins(spin.payout || spin.bet)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Game Instructions */}
          <Card className="mt-8 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🎯 How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Basic Rules:</h4>
                  <ul className="space-y-1">
                    <li>• Select your bet amount</li>
                    <li>• Click SPIN to play</li>
                    <li>• Match 3 symbols to win big</li>
                    <li>• 2 matching symbols = partial payout</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Tips:</h4>
                  <ul className="space-y-1">
                    <li>• Higher bets = higher potential wins</li>
                    <li>• 7️⃣7️⃣7️⃣ is the JACKPOT (10,000 coins!)</li>
                    <li>• Build win streaks for achievements</li>
                    <li>• Manage your bankroll wisely</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
