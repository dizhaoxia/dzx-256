import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { soundManager } from '@/utils/soundManager'

interface ApplePosition {
  id: number
  x: number
  y: number
  picked: boolean
  scale: number
}

const initialApples: ApplePosition[] = [
  { id: 1, x: 25, y: 28, picked: false, scale: 1 },
  { id: 2, x: 40, y: 18, picked: false, scale: 0.9 },
  { id: 3, x: 55, y: 25, picked: false, scale: 1.1 },
  { id: 4, x: 70, y: 32, picked: false, scale: 0.95 },
  { id: 5, x: 32, y: 42, picked: false, scale: 1 },
  { id: 6, x: 50, y: 45, picked: false, scale: 1.05 },
  { id: 7, x: 65, y: 48, picked: false, scale: 0.9 },
  { id: 8, x: 45, y: 35, picked: false, scale: 1 },
]

export default function AppleTree() {
  const requestPickApple = useGameStore((state) => state.requestPickApple)
  const pendingPickData = useGameStore((state) => state.pendingPickData)
  const mathChallenge = useGameStore((state) => state.mathChallenge)
  const appleCount = useGameStore((state) => state.appleCount)
  const maxApples = useGameStore((state) => state.maxApples)

  const [apples, setApples] = useState<ApplePosition[]>(initialApples)
  const [flyingApples, setFlyingApples] = useState<{ id: number; x: number; y: number }[]>([])
  const [justPickedId, setJustPickedId] = useState<number | null>(null)

  const prevPendingIdRef = useRef<number | null>(null)
  const prevPendingRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  const prevAppleCountRef = useRef(0)
  const prevMathChallengeRef = useRef(mathChallenge)

  useEffect(() => {
    if (pendingPickData && pendingPickData.type === 'apple') {
      prevPendingIdRef.current = pendingPickData.id
      prevPendingRectRef.current = pendingPickData.rect
    }
  }, [pendingPickData])

  useEffect(() => {
    if (prevMathChallengeRef.current && !mathChallenge && prevPendingIdRef.current !== null) {
      if (prevPendingRectRef.current && appleCount > prevAppleCountRef.current) {
        const appleId = prevPendingIdRef.current
        const rect = prevPendingRectRef.current
        const flyId = Date.now()
        const flyX = rect.left + rect.width / 2
        const flyY = rect.top + rect.height / 2

        setFlyingApples((prev) => [...prev, { id: flyId, x: flyX, y: flyY }])
        setApples((prev) => prev.map((a) => (a.id === appleId ? { ...a, picked: true } : a)))
        setJustPickedId(appleId)
        soundManager.playPickSound()
        setTimeout(() => setJustPickedId(null), 300)
        setTimeout(() => {
          setFlyingApples((prev) => prev.filter((f) => f.id !== flyId))
        }, 600)

        const unpickedCount = apples.filter((a) => !a.picked && a.id !== appleId).length
        if (unpickedCount === 0 && appleCount < maxApples) {
          setTimeout(() => {
            setApples(initialApples.map((a) => ({ ...a, picked: false })))
          }, 500)
        }
      }

      prevPendingIdRef.current = null
      prevPendingRectRef.current = null
    }
    prevAppleCountRef.current = appleCount
    prevMathChallengeRef.current = mathChallenge
  }, [mathChallenge, appleCount, apples, maxApples])

  const handleAppleClick = (apple: ApplePosition, e: React.MouseEvent) => {
    if (apple.picked) return
    if (appleCount >= maxApples) return
    if (mathChallenge) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    requestPickApple(apple.id, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    })
  }

  return (
    <div className="relative w-full h-full flex items-end justify-center select-none">
      <div className="relative w-[280px] h-[320px] md:w-[340px] md:h-[380px] animate-sway-slow">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] md:w-[75px] h-[120px] md:h-[140px]" style={{
          background: 'linear-gradient(90deg, #6D4C41 0%, #8D6E63 50%, #5D4037 100%)',
          borderRadius: '8px 8px 12px 12px',
          boxShadow: 'inset -8px 0 12px rgba(0,0,0,0.2)',
        }} />

        <div className="absolute bottom-[110px] md:bottom-[130px] left-1/2 -translate-x-1/2 w-[220px] md:w-[270px] h-[200px] md:h-[240px] rounded-full" style={{
          background: 'radial-gradient(ellipse at 30% 30%, #81C784 0%, #4CAF50 50%, #388E3C 100%)',
          boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.2)',
        }} />
        <div className="absolute bottom-[130px] md:bottom-[150px] left-[30px] md:left-[35px] w-[130px] md:w-[160px] h-[130px] md:h-[160px] rounded-full" style={{
          background: 'radial-gradient(ellipse at 40% 30%, #A5D6A7 0%, #66BB6A 60%, #43A047 100%)',
          boxShadow: 'inset -10px -10px 25px rgba(0,0,0,0.1)',
        }} />
        <div className="absolute bottom-[150px] md:bottom-[170px] right-[20px] md:right-[25px] w-[140px] md:w-[170px] h-[140px] md:h-[170px] rounded-full" style={{
          background: 'radial-gradient(ellipse at 40% 30%, #A5D6A7 0%, #66BB6A 60%, #43A047 100%)',
          boxShadow: 'inset -10px -10px 25px rgba(0,0,0,0.1)',
        }} />

        {apples.map((apple) => (
          !apple.picked && (
            <div
              key={apple.id}
              className={`absolute apple-clickable transition-all duration-150 ${
                justPickedId === apple.id ? 'animate-bounce-hard' : ''
              }`}
              style={{
                left: `${apple.x}%`,
                top: `${apple.y}%`,
                transform: `scale(${apple.scale})`,
                zIndex: 10,
              }}
              onClick={(e) => handleAppleClick(apple, e)}
              onTouchStart={(e) => {
                e.preventDefault()
                handleAppleClick(apple, e as unknown as React.MouseEvent)
              }}
            >
              <svg width="44" height="48" viewBox="0 0 44 48" className="md:w-[54px] md:h-[58px] drop-shadow-lg">
                <defs>
                  <radialGradient id={`appleGrad-${apple.id}`} cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#FF7043" />
                    <stop offset="40%" stopColor="#E53935" />
                    <stop offset="100%" stopColor="#B71C1C" />
                  </radialGradient>
                </defs>
                <path d="M22 10 Q18 5 14 6 Q12 7 14 11" stroke="#6D4C41" strokeWidth="3" fill="none" strokeLinecap="round" />
                <ellipse cx="14" cy="9" rx="6" ry="3" fill="#66BB6A" transform="rotate(-20 14 9)" />
                <path
                  d="M22 13 C10 13, 4 24, 6 34 C8 44, 18 47, 22 47 C26 47, 36 44, 38 34 C40 24, 34 13, 22 13 Z"
                  fill={`url(#appleGrad-${apple.id})`}
                />
                <ellipse cx="16" cy="22" rx="5" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-20 16 22)" />
              </svg>
            </div>
          )
        ))}
      </div>

      {flyingApples.map((fly) => (
        <div
          key={fly.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: fly.x - 22,
            top: fly.y - 24,
            animation: 'flyToStats 0.6s ease-in forwards',
            ['--fly-x' as string]: `calc(50vw - ${fly.x}px)`,
            ['--fly-y' as string]: `calc(120px - ${fly.y}px)`,
          }}
        >
          <svg width="44" height="48" viewBox="0 0 44 48">
            <defs>
              <radialGradient id="flyApple" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FF7043" />
                <stop offset="40%" stopColor="#E53935" />
                <stop offset="100%" stopColor="#B71C1C" />
              </radialGradient>
            </defs>
            <path d="M22 13 C10 13, 4 24, 6 34 C8 44, 18 47, 22 47 C26 47, 36 44, 38 34 C40 24, 34 13, 22 13 Z" fill="url(#flyApple)" />
          </svg>
        </div>
      ))}

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center w-full pb-2">
        <div className="inline-block px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-green-800 text-lg md:text-xl font-bold shadow-md border-2 border-green-400">
          🍎 苹果树
        </div>
      </div>
    </div>
  )
}
