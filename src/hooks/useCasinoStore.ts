'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  logError, 
  canClaimDailyReward, 
  getDailyRewardAmount,
  Achievement,
  ACHIEVEMENTS
} from '@/lib/utils'

export interface CasinoState {
  coins: number
  soundEnabled: boolean
  achievements: Achievement[]
  leaderboard: LeaderboardEntry[]
  lastDailyReward: string | null
  gamesPlayed: number
  gamesWon: number
  winStreak: number
  highestWinStreak: number
  totalWinnings: number
  settings: {
    soundEnabled: boolean
    highContrast: boolean
    largeText: boolean
  }
}

export interface LeaderboardEntry {
  name: string
  coins: number
  date: string
}

const INITIAL_STATE: CasinoState = {
  coins: 5000,
  soundEnabled: true,
  achievements: ACHIEVEMENTS.map(achievement => ({ ...achievement })),
  leaderboard: [],
  lastDailyReward: null,
  gamesPlayed: 0,
  gamesWon: 0,
  winStreak: 0,
  highestWinStreak: 0,
  totalWinnings: 0,
  settings: {
    soundEnabled: true,
    highContrast: false,
    largeText: false
  }
}

const STORAGE_KEY = 'lucky-fun-casino-state'
const SAVE_DEBOUNCE_MS = 1000 // Batch save after 1 second of inactivity

export function useCasinoStore() {
  const [state, setState] = useState<CasinoState>(INITIAL_STATE)
  const [isLoaded, setIsLoaded] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Debounced save function for performance
  const debouncedSave = useCallback((newState: CasinoState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const success = saveToLocalStorage(STORAGE_KEY, newState)
      if (!success) {
        logError(new Error('Failed to save casino state'), 'useCasinoStore.debouncedSave')
      }
    }, SAVE_DEBOUNCE_MS)
  }, [])

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = loadFromLocalStorage(STORAGE_KEY, INITIAL_STATE)
      
      // Merge with any new achievements that might have been added
      const mergedAchievements = ACHIEVEMENTS.map(defaultAchievement => {
        const savedAchievement = savedState.achievements?.find(a => a.id === defaultAchievement.id)
        return savedAchievement || { ...defaultAchievement }
      })
      
      setState({
        ...savedState,
        achievements: mergedAchievements
      })
      setIsLoaded(true)
    } catch (error) {
      logError(error as Error, 'useCasinoStore.loadState')
      setState(INITIAL_STATE)
      setIsLoaded(true)
    }
  }, [])

  // Save state whenever it changes (debounced)
  useEffect(() => {
    if (isLoaded) {
      debouncedSave(state)
    }
  }, [state, isLoaded, debouncedSave])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update coins and trigger achievement checks
  const updateCoins = useCallback((amount: number, isWin: boolean = false) => {
    setState(prevState => {
      const newCoins = Math.max(0, prevState.coins + amount)
      const newGamesPlayed = prevState.gamesPlayed + 1
      const newGamesWon = isWin ? prevState.gamesWon + 1 : prevState.gamesWon
      const newWinStreak = isWin ? prevState.winStreak + 1 : 0
      const newHighestWinStreak = Math.max(prevState.highestWinStreak, newWinStreak)
      const newTotalWinnings = isWin ? prevState.totalWinnings + Math.abs(amount) : prevState.totalWinnings

      // Check for achievements
      const updatedAchievements = [...prevState.achievements]
      const now = new Date().toISOString()

      // First win achievement
      if (isWin && newGamesWon === 1) {
        const achievement = updatedAchievements.find(a => a.id === 'first_win')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = now
        }
      }

      // Win streak achievement
      if (newWinStreak >= 3) {
        const achievement = updatedAchievements.find(a => a.id === 'three_in_row')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = now
        }
      }

      // High roller achievement
      if (newCoins >= 10000) {
        const achievement = updatedAchievements.find(a => a.id === 'high_roller')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = now
        }
      }

      return {
        ...prevState,
        coins: newCoins,
        gamesPlayed: newGamesPlayed,
        gamesWon: newGamesWon,
        winStreak: newWinStreak,
        highestWinStreak: newHighestWinStreak,
        totalWinnings: newTotalWinnings,
        achievements: updatedAchievements
      }
    })
  }, [])

  // Unlock specific achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prevState => {
      const updatedAchievements = [...prevState.achievements]
      const achievement = updatedAchievements.find(a => a.id === achievementId)
      
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date().toISOString()
      }

      return {
        ...prevState,
        achievements: updatedAchievements
      }
    })
  }, [])

  // Toggle sound setting
  const toggleSound = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      soundEnabled: !prevState.soundEnabled,
      settings: {
        ...prevState.settings,
        soundEnabled: !prevState.soundEnabled
      }
    }))
  }, [])

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<CasinoState['settings']>) => {
    setState(prevState => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        ...newSettings
      },
      soundEnabled: newSettings.soundEnabled ?? prevState.soundEnabled
    }))
  }, [])

  // Claim daily reward
  const claimDailyReward = useCallback(() => {
    if (!canClaimDailyReward(state.lastDailyReward)) {
      return { success: false, amount: 0, message: 'Daily reward already claimed today' }
    }

    const rewardAmount = getDailyRewardAmount()
    const now = new Date().toISOString()

    setState(prevState => ({
      ...prevState,
      coins: prevState.coins + rewardAmount,
      lastDailyReward: now
    }))

    return { 
      success: true, 
      amount: rewardAmount, 
      message: `You received ${rewardAmount} coins!` 
    }
  }, [state.lastDailyReward])

  // Add to leaderboard
  const addToLeaderboard = useCallback((name: string) => {
    setState(prevState => {
      const newEntry: LeaderboardEntry = {
        name,
        coins: prevState.coins,
        date: new Date().toISOString()
      }

      const updatedLeaderboard = [...prevState.leaderboard, newEntry]
        .sort((a, b) => b.coins - a.coins)
        .slice(0, 10) // Keep only top 10

      return {
        ...prevState,
        leaderboard: updatedLeaderboard
      }
    })
  }, [])

  // Reset all data (for testing or user request)
  const resetCasinoData = useCallback(() => {
    setState(INITIAL_STATE)
    saveToLocalStorage(STORAGE_KEY, INITIAL_STATE)
  }, [])

  // Force save (useful for critical moments)
  const forceSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    const success = saveToLocalStorage(STORAGE_KEY, state)
    if (!success) {
      logError(new Error('Failed to force save casino state'), 'useCasinoStore.forceSave')
    }
    return success
  }, [state])

  return {
    // State
    ...state,
    isLoaded,
    
    // Computed values
    canClaimDaily: canClaimDailyReward(state.lastDailyReward),
    unlockedAchievements: state.achievements.filter(a => a.unlocked),
    
    // Actions
    updateCoins,
    unlockAchievement,
    toggleSound,
    updateSettings,
    claimDailyReward,
    addToLeaderboard,
    resetCasinoData,
    forceSave
  }
}
