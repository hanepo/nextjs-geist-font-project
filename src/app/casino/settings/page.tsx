'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CasinoNav } from '@/components/CasinoNav'
import { useCasinoStore } from '@/hooks/useCasinoStore'
import { useSound } from '@/components/SoundManager'
import { formatCoins } from '@/lib/utils'

export default function SettingsPage() {
  const { 
    coins,
    settings,
    updateSettings,
    resetCasinoData,
    forceSave,
    gamesPlayed,
    gamesWon,
    totalWinnings,
    highestWinStreak,
    isLoaded
  } = useCasinoStore()
  
  const { soundEnabled, setSoundEnabled } = useSound()

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled)
    updateSettings({ soundEnabled: enabled })
  }

  const handleHighContrastToggle = (enabled: boolean) => {
    updateSettings({ highContrast: enabled })
    // Apply high contrast class to document
    if (enabled) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  const handleLargeTextToggle = (enabled: boolean) => {
    updateSettings({ largeText: enabled })
    // Apply large text class to document
    if (enabled) {
      document.documentElement.classList.add('large-text')
    } else {
      document.documentElement.classList.remove('large-text')
    }
  }

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all casino data? This action cannot be undone.')) {
      resetCasinoData()
      window.location.reload()
    }
  }

  const handleForceSave = () => {
    const success = forceSave()
    if (success) {
      alert('Data saved successfully!')
    } else {
      alert('Failed to save data. Please try again.')
    }
  }

  const winRate = gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(1) : '0.0'

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <div className="text-xl text-white">Loading Settings...</div>
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
              ⚙️ Casino Settings
            </h1>
            <p className="text-xl text-gray-300">
              Customize your casino experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Game Settings */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🎮 Game Settings
                </CardTitle>
                <CardDescription>
                  Configure your gaming preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sound Settings */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium text-white">Sound Effects</div>
                    <div className="text-sm text-gray-400">
                      Enable or disable game sound effects
                    </div>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={handleSoundToggle}
                  />
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium text-white">High Contrast Mode</div>
                    <div className="text-sm text-gray-400">
                      Increase contrast for better visibility
                    </div>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={handleHighContrastToggle}
                  />
                </div>

                {/* Large Text */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium text-white">Large Text</div>
                    <div className="text-sm text-gray-400">
                      Increase text size for better readability
                    </div>
                  </div>
                  <Switch
                    checked={settings.largeText}
                    onCheckedChange={handleLargeTextToggle}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  📊 Your Statistics
                </CardTitle>
                <CardDescription>
                  Track your casino performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{formatCoins(coins)}</div>
                    <div className="text-sm text-gray-400">Current Coins</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{winRate}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{gamesPlayed}</div>
                    <div className="text-sm text-gray-400">Games Played</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{highestWinStreak}</div>
                    <div className="text-sm text-gray-400">Best Streak</div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{formatCoins(totalWinnings)}</div>
                  <div className="text-sm text-gray-400">Total Winnings</div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  💾 Data Management
                </CardTitle>
                <CardDescription>
                  Manage your casino data and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    Your progress is automatically saved to your browser's local storage.
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Auto-Save Enabled
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Offline Mode
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleForceSave}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    💾 Force Save Data
                  </Button>
                  
                  <Button 
                    onClick={handleResetData}
                    variant="destructive"
                    className="w-full"
                  >
                    🗑️ Reset All Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  ℹ️ About Lucky Fun Casino
                </CardTitle>
                <CardDescription>
                  Information about this casino app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <p>
                    <strong className="text-yellow-400">Version:</strong> 1.0.0
                  </p>
                  <p>
                    <strong className="text-yellow-400">Built with:</strong> Next.js, TypeScript, Tailwind CSS
                  </p>
                  <p>
                    <strong className="text-yellow-400">Features:</strong> 5 Casino Games, Achievements, Daily Rewards
                  </p>
                </div>
                
                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                  <p className="text-sm text-red-300">
                    <strong>⚠️ Important Disclaimer:</strong> This is a virtual casino for entertainment only. 
                    No real money is involved. All coins and prizes are virtual.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-2">🎰</div>
                  <div className="text-sm text-gray-400">
                    Enjoy responsibly and have fun!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
