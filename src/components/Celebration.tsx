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
  const continueToNextRound = useGameStore((state) => state.continueToNextRound)
  const completedRounds = useGameStore((state) => state.completedRounds)
  const difficulty = useGameStore((state) => state.difficulty)
  const bonusStars = useGameStore((state) => state.bonusStars)
  
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
          className="mb-6 animate-celebration"
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

        <div className="flex justify-center gap-3 md:gap-6 mb-6 flex-wrap">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border-2 border-indigo-300">
            <div className="text-xs md:text-sm text-indigo-500 font-bold">已完成</div>
            <div className="text-2xl md:text-3xl font-black text-indigo-700">
              {completedRounds} 轮
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border-2 border-amber-300">
            <div className="text-xs md:text-sm text-amber-600 font-bold">当前难度</div>
            <div className="text-2xl md:text-3xl font-black text-amber-700">
              {'⭐'.repeat(difficulty)}
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border-2 border-yellow-300">
            <div className="text-xs md:text-sm text-yellow-600 font-bold">奖励星星</div>
            <div className="text-2xl md:text-3xl font-black text-yellow-700">
              {bonusStars} ⭐
            </div>
          </div>
        </div>

        <div className="mb-8 px-4">
          <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl px-6 py-3 shadow-lg border-2 border-green-300 animate-bounce-soft">
            <div className="text-base md:text-xl font-bold text-green-800" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
              🎯 里程碑达成！下一轮难度将继续提升，准备好了吗？
            </div>
          </div>
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

        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-10">
          <div
            className="inline-block pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <button
              onClick={continueToNextRound}
              className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-3xl font-black text-xl md:text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 btn-3d animate-pulse-glow"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              <span className="flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl">🚀</span>
                <span>继续挑战</span>
                <span className="text-2xl md:text-3xl">�</span>
              </span>
            </button>
          </div>

          <div
            className="inline-block pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <button
              onClick={resetGame}
              className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white rounded-3xl font-black text-xl md:text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 btn-3d"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              <span className="flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl">🔄</span>
                <span>重新开始</span>
                <span className="text-2xl md:text-3xl">🎮</span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-lg md:text-2xl font-bold text-amber-800 animate-pop-in" style={{ animationDelay: '0.5s' }}>
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
