'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { logError } from '@/lib/utils'

interface SoundContextType {
  playSound: (soundName: string) => void
  isLoaded: boolean
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

interface SoundManagerProps {
  children: React.ReactNode
  soundEnabled?: boolean
}

// Sound file mappings
const SOUND_FILES = {
  slot: '/sounds/slot.mp3',
  roulette: '/sounds/roulette.mp3',
  card: '/sounds/card.mp3',
  dice: '/sounds/dice.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  coin: '/sounds/coin.mp3',
  jackpot: '/sounds/jackpot.mp3'
} as const

type SoundName = keyof typeof SOUND_FILES

export function SoundManager({ children, soundEnabled = true }: SoundManagerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSoundEnabled, setSoundEnabled] = useState(soundEnabled)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map())
  const loadingPromisesRef = useRef<Map<string, Promise<AudioBuffer>>>(new Map())

  // Initialize Audio Context
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        // Create AudioContext with proper browser compatibility
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContextClass) {
          logError(new Error('Web Audio API not supported'), 'SoundManager.initAudioContext')
          return
        }

        audioContextRef.current = new AudioContextClass()
        
        // Resume context if it's suspended (required by some browsers)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume()
        }

        // Load all sound files
        await loadSounds()
        setIsLoaded(true)
      } catch (error) {
        logError(error as Error, 'SoundManager.initAudioContext')
        setIsLoaded(true) // Set loaded even on error to prevent blocking UI
      }
    }

    initAudioContext()

    // Cleanup
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(error => {
          logError(error as Error, 'SoundManager.cleanup')
        })
      }
    }
  }, [])

  // Load sound files into audio buffers
  const loadSounds = async () => {
    const loadPromises = Object.entries(SOUND_FILES).map(async ([name, url]) => {
      try {
        // Check if already loading
        if (loadingPromisesRef.current.has(name)) {
          return loadingPromisesRef.current.get(name)!
        }

        // Create loading promise
        const loadPromise = loadSoundFile(url)
        loadingPromisesRef.current.set(name, loadPromise)

        const buffer = await loadPromise
        audioBuffersRef.current.set(name, buffer)
        return buffer
      } catch (error) {
        logError(error as Error, `SoundManager.loadSounds - ${name}`)
        // Create a silent buffer as fallback
        if (audioContextRef.current) {
          const silentBuffer = audioContextRef.current.createBuffer(1, 1, 22050)
          audioBuffersRef.current.set(name, silentBuffer)
          return silentBuffer
        }
        throw error
      }
    })

    try {
      await Promise.allSettled(loadPromises)
    } catch (error) {
      logError(error as Error, 'SoundManager.loadSounds.Promise.allSettled')
    }
  }

  // Load individual sound file
  const loadSoundFile = async (url: string): Promise<AudioBuffer> => {
    if (!audioContextRef.current) {
      throw new Error('AudioContext not initialized')
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch sound file: ${url} (${response.status})`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      return audioBuffer
    } catch (error) {
      // If file doesn't exist, create a silent buffer
      if (audioContextRef.current) {
        console.warn(`Sound file not found: ${url}, using silent buffer`)
        return audioContextRef.current.createBuffer(1, 1, 22050)
      }
      throw error
    }
  }

  // Play sound function
  const playSound = (soundName: string) => {
    if (!currentSoundEnabled || !isLoaded || !audioContextRef.current) {
      return
    }

    try {
      const buffer = audioBuffersRef.current.get(soundName)
      if (!buffer) {
        console.warn(`Sound buffer not found: ${soundName}`)
        return
      }

      // Create and configure audio source
      const source = audioContextRef.current.createBufferSource()
      const gainNode = audioContextRef.current.createGain()
      
      source.buffer = buffer
      source.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      // Set volume (0.0 to 1.0)
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      
      // Play the sound
      source.start(0)
      
      // Clean up after sound finishes
      source.onended = () => {
        try {
          source.disconnect()
          gainNode.disconnect()
        } catch (error) {
          // Ignore disconnect errors
        }
      }
    } catch (error) {
      logError(error as Error, `SoundManager.playSound - ${soundName}`)
    }
  }

  // Handle user interaction to resume AudioContext (required by browsers)
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume()
        } catch (error) {
          logError(error as Error, 'SoundManager.handleUserInteraction')
        }
      }
    }

    // Add event listeners for user interaction
    const events = ['click', 'touchstart', 'keydown']
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [])

  const contextValue: SoundContextType = {
    playSound,
    isLoaded,
    soundEnabled: currentSoundEnabled,
    setSoundEnabled
  }

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  )
}

// Hook to use sound context
export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundManager')
  }
  return context
}

// Convenience hooks for specific sounds
export function useCasinoSounds() {
  const { playSound, soundEnabled } = useSound()

  return {
    playSlot: () => playSound('slot'),
    playRoulette: () => playSound('roulette'),
    playCard: () => playSound('card'),
    playDice: () => playSound('dice'),
    playWin: () => playSound('win'),
    playLose: () => playSound('lose'),
    playCoin: () => playSound('coin'),
    playJackpot: () => playSound('jackpot'),
    soundEnabled
  }
}
