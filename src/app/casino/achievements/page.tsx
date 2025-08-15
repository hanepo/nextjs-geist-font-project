'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CasinoNav } from '@/components/CasinoNav'
import { useCasinoStore } from '@/hooks/useCasinoStore'
import { formatCoins, formatTime } from '@/lib/utils'

interface AchievementProgress {
  id: string
  current: number
  target: number
  description: string
}

export default function AchievementsPage() {
  const { 
    achievements,
    coins,
    gamesPlayed,
    gamesWon,
    winStreak,
    highestWinStreak,
    totalWinnings,
    isLoaded
  } = useCasinoStore()

  // Calculate progress for achievements
  const getAchievementProgress = (): AchievementProgress[] => {
    return [
      {
        id: 'first_win',
        current: gamesWon > 0 ? 1 : 0,
        target: 1,
        description: 'Win your first game'
      },
      {
        id: 'three_in_row',
        current: Math.min(highestWinStreak, 3),
        target: 3,
        description: 'Win 3 games in a row'
      },
      {
        id: 'high_roller',
        current: Math.min(coins, 10000),
        target: 10000,
        description: 'Accumulate 10,000 coins'
      },
      {
        id: 'jackpot',
        current: achievements.find(a => a.id === 'jackpot')?.unlocked ? 1 : 0,
        target: 1,
        description: 'Hit a jackpot in slots'
      },
      {
        id: 'blackjack_21',
        current: achievements.find(a => a.id === 'blackjack_21')?.unlocked ? 1 : 0,
        target: 1,
        description: 'Get a natural blackjack'
      },
      {
        id: 'roulette_lucky',
        current: achievements.find(a => a.id === 'roulette_lucky')?.unlocked ? 1 : 0,
        target: 1,
        description: 'Win on a single number bet in roulette'
      }
    ]
  }

  const achievementProgress = getAchievementProgress()
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  const getAchievementEmoji = (id: string) => {
    switch (id) {
      case 'first_win': return '🎉'
      case 'three_in_row': return '🔥'
      case 'jackpot': return '💎'
      case 'high_roller': return '💰'
      case 'blackjack_21': return '🃏'
      case 'roulette_lucky': return '🎯'
      default: return '🏆'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-yellow-500'
    if (progress >= 50) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <div className="text-xl text-white">Loading Achievements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <CasinoNav compact />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              🏆 Achievements
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Track your progress and unlock rewards
            </p>
            
            {/* Overall Progress */}
            <Card className="bg-gray-800/50 border-gray-700 max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-yellow-400">
                    {unlockedCount} / {totalCount}
                  </div>
                  <div className="text-sm text-gray-400">Achievements Unlocked</div>
                  <Progress 
                    value={completionPercentage} 
                    className="w-full h-3"
                  />
                  <div className="text-sm text-gray-400">
                    {completionPercentage.toFixed(1)}% Complete
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{formatCoins(coins)}</div>
                <div className="text-sm text-gray-400">Current Coins</div>
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
                <div className="text-2xl font-bold text-purple-400">{highestWinStreak}</div>
                <div className="text-sm text-gray-400">Best Win Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{formatCoins(totalWinnings)}</div>
                <div className="text-sm text-gray-400">Total Winnings</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const progress = achievementProgress.find(p => p.id === achievement.id)
              const progressPercentage = progress ? (progress.current / progress.target) * 100 : 0
              const isCompleted = achievement.unlocked
              
              return (
                <Card 
                  key={achievement.id}
                  className={`
                    transition-all duration-300 hover:scale-105
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-600/50' 
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <CardHeader className="text-center pb-3">
                    <div className={`text-6xl mb-2 ${isCompleted ? 'animate-pulse' : 'grayscale'}`}>
                      {getAchievementEmoji(achievement.id)}
                    </div>
                    <CardTitle className={`text-lg ${isCompleted ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    {progress && !isCompleted && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-gray-300">
                            {progress.current} / {progress.target}
                          </span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className="w-full h-2"
                        />
                        <div className="text-xs text-gray-500 text-center">
                          {progressPercentage.toFixed(1)}% Complete
                        </div>
                      </div>
                    )}
                    
                    {/* Achievement Status */}
                    <div className="text-center">
                      {isCompleted ? (
                        <div className="space-y-2">
                          <Badge className="bg-green-600 text-white">
                            ✅ Unlocked
                          </Badge>
                          {achievement.unlockedAt && (
                            <div className="text-xs text-gray-400">
                              {formatTime(new Date(achievement.unlockedAt))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          🔒 Locked
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Achievement Tips */}
          <Card className="mt-8 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                💡 Achievement Tips
              </CardTitle>
              <CardDescription>
                How to unlock achievements faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-400">🎰 Slot Machine Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Play consistently to hit the jackpot achievement</li>
                    <li>• Higher bets increase jackpot chances</li>
                    <li>• Look for matching symbols across all reels</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-400">🃏 Card Game Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Learn basic blackjack strategy for more wins</li>
                    <li>• Natural blackjack (Ace + 10) unlocks achievement</li>
                    <li>• Practice makes perfect in poker</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-400">🎯 Roulette Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Single number bets have highest payouts</li>
                    <li>• Try different betting strategies</li>
                    <li>• Lucky number achievement requires single number win</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-400">💰 General Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Claim daily rewards to build coin balance</li>
                    <li>• Win streaks unlock special achievements</li>
                    <li>• Try all games to maximize achievement potential</li>
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
