'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CasinoNav } from '@/components/CasinoNav'
import { useCasinoStore } from '@/hooks/useCasinoStore'
import { formatCoins, formatTime } from '@/lib/utils'

export default function LeaderboardPage() {
  const { 
    coins,
    leaderboard,
    addToLeaderboard,
    gamesWon,
    winStreak,
    highestWinStreak,
    isLoaded
  } = useCasinoStore()
  
  const [playerName, setPlayerName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddToLeaderboard = () => {
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim())
      setPlayerName('')
      setShowAddForm(false)
    }
  }

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return '🏅'
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400'
      case 1: return 'text-gray-300'
      case 2: return 'text-amber-600'
      default: return 'text-gray-400'
    }
  }

  const currentPlayerRank = leaderboard.findIndex(entry => entry.coins <= coins) + 1
  const wouldBeRank = currentPlayerRank === 0 ? leaderboard.length + 1 : currentPlayerRank

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <div className="text-xl text-white">Loading Leaderboard...</div>
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
              🏆 Leaderboard
            </h1>
            <p className="text-xl text-gray-300">
              Top players in Lucky Fun Casino
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Player Stats */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/50 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    👤 Your Stats
                  </CardTitle>
                  <CardDescription>
                    Your current performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400">{formatCoins(coins)}</div>
                    <div className="text-sm text-gray-400">Current Coins</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                      <div className="text-xl font-bold text-green-400">{gamesWon}</div>
                      <div className="text-xs text-gray-400">Games Won</div>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                      <div className="text-xl font-bold text-purple-400">{highestWinStreak}</div>
                      <div className="text-xs text-gray-400">Best Streak</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">
                      {wouldBeRank === 1 ? '1st' : wouldBeRank === 2 ? '2nd' : wouldBeRank === 3 ? '3rd' : `${wouldBeRank}th`}
                    </div>
                    <div className="text-xs text-gray-400">Potential Rank</div>
                  </div>
                  
                  {!showAddForm ? (
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                    >
                      Add to Leaderboard
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        maxLength={20}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleAddToLeaderboard}
                          disabled={!playerName.trim()}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Submit
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowAddForm(false)
                            setPlayerName('')
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    🏆 Top Players
                  </CardTitle>
                  <CardDescription>
                    {leaderboard.length > 0 
                      ? `Showing top ${leaderboard.length} players`
                      : 'No players on the leaderboard yet'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎰</div>
                      <div className="text-xl text-gray-400 mb-2">No entries yet!</div>
                      <div className="text-gray-500">
                        Be the first to add your score to the leaderboard.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <div 
                          key={`${entry.name}-${entry.date}`}
                          className={`
                            flex items-center justify-between p-4 rounded-lg border transition-all duration-200
                            ${index < 3 
                              ? 'bg-gradient-to-r from-yellow-600/10 to-yellow-800/10 border-yellow-600/30' 
                              : 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">
                              {getRankEmoji(index)}
                            </div>
                            <div>
                              <div className={`font-bold text-lg ${getRankColor(index)}`}>
                                {entry.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {formatTime(new Date(entry.date))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`${getRankColor(index)} border-current`}
                              >
                                #{index + 1}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400 mt-1">
                              {formatCoins(entry.coins)}
                            </div>
                            <div className="text-xs text-gray-400">coins</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leaderboard Info */}
          <Card className="mt-8 bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-yellow-400">🎯 How Rankings Work</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Rankings are based on your current coin balance</p>
                  <p>• Only the top 10 players are displayed</p>
                  <p>• Your progress is saved locally on this device</p>
                  <p>• Play games to earn more coins and climb the ranks!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
