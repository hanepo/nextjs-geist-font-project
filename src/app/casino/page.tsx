'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CasinoNav } from '@/components/CasinoNav'
import { useCasinoStore } from '@/hooks/useCasinoStore'
import { useCasinoSounds } from '@/components/SoundManager'
import { formatCoins } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface GameCard {
  id: string
  title: string
  description: string
  href: string
  emoji: string
  minBet: number
  maxWin: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  color: string
}

const CASINO_GAMES: GameCard[] = [
  {
    id: 'slot-machine',
    title: 'Slot Machine',
    description: 'Spin the reels and match symbols for big wins!',
    href: '/casino/games/slot-machine',
    emoji: '🎰',
    minBet: 50,
    maxWin: 5000,
    difficulty: 'Easy',
    color: 'from-yellow-600 to-yellow-800'
  },
  {
    id: 'roulette',
    title: 'Roulette Wheel',
    description: 'Place your bets and watch the wheel spin!',
    href: '/casino/games/roulette',
    emoji: '🎯',
    minBet: 25,
    maxWin: 3500,
    difficulty: 'Medium',
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'blackjack',
    title: 'Blackjack',
    description: 'Beat the dealer and get as close to 21 as possible!',
    href: '/casino/games/blackjack',
    emoji: '🃏',
    minBet: 100,
    maxWin: 2000,
    difficulty: 'Medium',
    color: 'from-green-600 to-green-800'
  },
  {
    id: 'poker',
    title: 'Poker',
    description: 'Play Texas Hold\'em against smart AI opponents!',
    href: '/casino/games/poker',
    emoji: '♠️',
    minBet: 200,
    maxWin: 10000,
    difficulty: 'Hard',
    color: 'from-purple-600 to-purple-800'
  },
  {
    id: 'dice',
    title: 'Dice Game',
    description: 'Roll the dice and test your luck!',
    href: '/casino/games/dice',
    emoji: '🎲',
    minBet: 25,
    maxWin: 1000,
    difficulty: 'Easy',
    color: 'from-blue-600 to-blue-800'
  }
]

export default function CasinoHomePage() {
  const { 
    coins, 
    canClaimDaily, 
    claimDailyReward, 
    unlockedAchievements,
    gamesPlayed,
    gamesWon,
    winStreak,
    isLoaded
  } = useCasinoStore()
  
  const { playCoin } = useCasinoSounds()
  const [showDailyReward, setShowDailyReward] = useState(false)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  // Check for daily reward on load
  useEffect(() => {
    if (isLoaded && canClaimDaily) {
      setShowDailyReward(true)
    }
  }, [isLoaded, canClaimDaily])

  const handleClaimDailyReward = () => {
    const result = claimDailyReward()
    if (result.success) {
      playCoin()
      setRewardClaimed(true)
      setShowDailyReward(false)
      
      // Show success message briefly
      setTimeout(() => setRewardClaimed(false), 3000)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600'
      case 'Medium': return 'bg-yellow-600'
      case 'Hard': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎰</div>
          <div className="text-xl text-white">Loading Lucky Fun Casino...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <CasinoNav />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            🎰 Lucky Fun Casino 🎰
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Welcome to the most exciting virtual casino experience!
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{formatCoins(coins)}</div>
                <div className="text-sm text-gray-400">Coins</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{gamesWon}</div>
                <div className="text-sm text-gray-400">Games Won</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{gamesPlayed}</div>
                <div className="text-sm text-gray-400">Games Played</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{winStreak}</div>
                <div className="text-sm text-gray-400">Win Streak</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Reward Banner */}
        {showDailyReward && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border-yellow-600/50">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">🎁 Daily Bonus Available!</h3>
              <p className="text-gray-300 mb-4">Claim your free daily coins to keep playing!</p>
              <Button 
                onClick={handleClaimDailyReward}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-8 py-3"
              >
                Claim Daily Reward
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Reward Claimed Message */}
        {rewardClaimed && (
          <Card className="mb-8 bg-gradient-to-r from-green-600/20 to-green-800/20 border-green-600/50">
            <CardContent className="p-4 text-center">
              <p className="text-green-400 font-bold">✅ Daily reward claimed successfully!</p>
            </CardContent>
          </Card>
        )}

        {/* Games Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Choose Your Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASINO_GAMES.map((game) => (
              <Card 
                key={game.id} 
                className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-2">{game.emoji}</div>
                  <CardTitle className="text-xl text-white group-hover:text-yellow-400 transition-colors">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet:</span>
                    <span className="text-yellow-400 font-bold">{formatCoins(game.minBet)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Max Win:</span>
                    <span className="text-green-400 font-bold">{formatCoins(game.maxWin)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Difficulty:</span>
                    <Badge className={cn("text-white", getDifficultyColor(game.difficulty))}>
                      {game.difficulty}
                    </Badge>
                  </div>
                  
                  <Link href={game.href} className="block">
                    <Button 
                      className={cn(
                        "w-full bg-gradient-to-r text-white font-bold py-3",
                        "hover:scale-105 transition-all duration-200",
                        game.color
                      )}
                      disabled={coins < game.minBet}
                    >
                      {coins >= game.minBet ? 'Play Now' : 'Insufficient Coins'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🏆 Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.slice(-4).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg"
                  >
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="font-bold text-yellow-400">{achievement.title}</div>
                      <div className="text-sm text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                🎲 <strong>Important:</strong> This game does not offer real money gambling or prizes. 
                All coins and winnings are virtual and for entertainment purposes only. 
                Please gamble responsibly in real life. 🎲
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
