import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { soundManager } from '@/utils/soundManager'

interface Confetti {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  rotation: number
  size: number
  shape: 'square' | 'circle' | 'triangle'
}

const confettiColors = [
  '#E53935',
  '#FF9800',
  '#FFEB3B',
  '#4CAF50',
  '#2196F3',
  '#9C27B0',
  '#FF4081',
  '#00BCD4',
  '#FFC107',
  '#8BC34A',
]

const celebrationMessages = [
  { emoji: '🎉', text: '丰 收 啦！' },
  { emoji: '🌟', text: '太 棒 了！' },
  { emoji: '🏆', text: '圆 满 完 成！' },
  { emoji: '🎊', text: '你 真 厉 害！' },
]

export default function Celebration() {
  const gameStatus = useGameStore((state) => state.gameStatus)
  const resetGame = useGameStore((state) => state.resetGame)
  
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [show, setShow] = useState(false)
  const [soundPlayed, setSoundPlayed] = useState(false)

  useEffect(() => {
    if (gameStatus === 'celebrating' && !show) {
      setShow(true)
      
      if (!soundPlayed) {
        soundManager.playCelebrationSound()
        setSoundPlayed(true)
      }

      const newConfetti: Confetti[] = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2.5 + Math.random() * 3,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 12,
        shape: (['square', 'circle', 'triangle'] as const)[Math.floor(Math.random() * 3)],
      }))
      setConfetti(newConfetti)

      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % celebrationMessages.length)
      }, 2000)

      return () => clearInterval(messageInterval)
    }
    
    if (gameStatus === 'playing') {
      setShow(false)
      setSoundPlayed(false)
      setConfetti([])
    }
  }, [gameStatus, show, soundPlayed])

  if (!show) return null

  const currentMessage = celebrationMessages[messageIndex]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.shape !== 'triangle' ? c.color : 'transparent',
            borderRadius: c.shape === 'circle' ? '50%' : c.shape === 'square' ? '2px' : '0',
            borderTop: c.shape === 'triangle' ? `${c.size}px solid ${c.color}` : 'none',
            borderLeft: c.shape === 'triangle' ? `${c.size / 2}px solid transparent` : 'none',
            borderRight: c.shape === 'triangle' ? `${c.size / 2}px solid transparent` : 'none',
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            transform: `rotate(${c.rotation}deg)`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/40 via-orange-200/30 to-pink-200/40 backdrop-blur-sm animate-pop-in" />

      <div className="relative z-10 text-center px-6">
        <div className="mb-8 animate-bounce-soft">
          <span className="text-7xl md:text-9xl block">{currentMessage.emoji}</span>
        </div>

        <div
          key={messageIndex}
          className="mb-8 animate-celebration"
        >
          <h1
            className="text-5xl md:text-8xl font-black tracking-wider animate-rainbow-text mb-2"
            style={{
              fontFamily: "'ZCOOL KuaiLe', 'Ma Shan Zheng', sans-serif",
              textShadow: '4px 4px 0 #fff, 8px 8px 0 rgba(0,0,0,0.1)',
            }}
          >
            {currentMessage.text}
          </h1>
        </div>

        <div className="flex justify-center gap-3 md:gap-5 mb-10">
          {['🍎', '🥚', '🌾', '🐔', '🌳', '🚜', '🍞', '🧺'].map((emoji, i) => (
            <span
              key={i}
              className="text-4xl md:text-6xl animate-bounce-soft"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div
          className="inline-block pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <button
            onClick={resetGame}
            className="px-10 py-5 md:px-16 md:py-6 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white rounded-3xl font-black text-2xl md:text-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 btn-3d animate-pulse-glow"
            style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
          >
            <span className="flex items-center gap-3 md:gap-4">
              <span className="text-3xl md:text-4xl">🔄</span>
              <span>再 玩 一 次</span>
              <span className="text-3xl md:text-4xl">🎮</span>
            </span>
          </button>
        </div>

        <div className="mt-8 text-lg md:text-2xl font-bold text-amber-800 animate-pop-in" style={{ animationDelay: '0.5s' }}>
          🌟 感谢你帮助农场完成了大丰收！🌟
        </div>
      </div>

      {[...Array(12)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute text-3xl md:text-5xl animate-bounce-soft"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        >
          {['⭐', '✨', '💫', '🌟'][i % 4]}
        </div>
      ))}
    </div>
  )
}
