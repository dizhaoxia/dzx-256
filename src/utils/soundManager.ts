class SoundManager {
  private audioContext: AudioContext | null = null
  private isMuted = false

  private initAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      } catch {
        console.warn('Web Audio API not supported')
        return null
      }
    }
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    return this.audioContext
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (this.isMuted) return
    
    const ctx = this.initAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }

  playPickSound() {
    this.playTone(660, 0.1, 'sine', 0.25)
    setTimeout(() => this.playTone(880, 0.08, 'sine', 0.2), 50)
  }

  playSuccessSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.3), i * 120)
    })
  }

  playErrorSound() {
    this.playTone(200, 0.15, 'sawtooth', 0.2)
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.15), 100)
  }

  playCelebrationSound() {
    const melody = [
      { freq: 523.25, dur: 0.15 },
      { freq: 659.25, dur: 0.15 },
      { freq: 783.99, dur: 0.15 },
      { freq: 659.25, dur: 0.15 },
      { freq: 523.25, dur: 0.15 },
      { freq: 659.25, dur: 0.3 },
      { freq: 880, dur: 0.3 },
      { freq: 783.99, dur: 0.3 },
      { freq: 659.25, dur: 0.2 },
      { freq: 587.33, dur: 0.2 },
      { freq: 523.25, dur: 0.4 },
    ]
    
    let time = 0
    melody.forEach(({ freq, dur }) => {
      setTimeout(() => this.playTone(freq, dur, 'triangle', 0.35), time)
      time += dur * 1000 * 0.85
    })
  }

  playDeliverySound() {
    this.playTone(440, 0.1, 'square', 0.15)
    setTimeout(() => this.playTone(550, 0.1, 'square', 0.15), 80)
    setTimeout(() => this.playTone(660, 0.15, 'square', 0.15), 160)
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  getMuted() {
    return this.isMuted
  }
}

export const soundManager = new SoundManager()
