import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { soundManager } from '@/utils/soundManager'

interface EggPosition {
  id: number
  x: number
  y: number
  picked: boolean
  scale: number
  rotation: number
}

const initialEggs: EggPosition[] = [
  { id: 1, x: 20, y: 58, picked: false, scale: 1, rotation: -5 },
  { id: 2, x: 35, y: 62, picked: false, scale: 0.95, rotation: 3 },
  { id: 3, x: 50, y: 56, picked: false, scale: 1.05, rotation: -2 },
  { id: 4, x: 65, y: 63, picked: false, scale: 0.98, rotation: 5 },
  { id: 5, x: 80, y: 59, picked: false, scale: 1.02, rotation: -3 },
  { id: 6, x: 28, y: 50, picked: false, scale: 0.9, rotation: 2 },
  { id: 7, x: 58, y: 48, picked: false, scale: 1, rotation: -4 },
  { id: 8, x: 73, y: 51, picked: false, scale: 0.95, rotation: 4 },
]

export default function ChickenCoop() {
  const requestPickEgg = useGameStore((state) => state.requestPickEgg)
  const pendingPickData = useGameStore((state) => state.pendingPickData)
  const mathChallenge = useGameStore((state) => state.mathChallenge)
  const eggCount = useGameStore((state) => state.eggCount)
  const maxEggs = useGameStore((state) => state.maxEggs)

  const [eggs, setEggs] = useState<EggPosition[]>(initialEggs)
  const [flyingEggs, setFlyingEggs] = useState<{ id: number; x: number; y: number }[]>([])
  const [justPickedId, setJustPickedId] = useState<number | null>(null)

  const prevPendingIdRef = useRef<number | null>(null)
  const prevPendingRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  const prevEggCountRef = useRef(0)
  const prevMathChallengeRef = useRef(mathChallenge)

  useEffect(() => {
    if (pendingPickData && pendingPickData.type === 'egg') {
      prevPendingIdRef.current = pendingPickData.id
      prevPendingRectRef.current = pendingPickData.rect
    }
  }, [pendingPickData])

  useEffect(() => {
    if (prevMathChallengeRef.current && !mathChallenge && prevPendingIdRef.current !== null) {
      if (prevPendingRectRef.current && eggCount > prevEggCountRef.current) {
        const eggId = prevPendingIdRef.current
        const rect = prevPendingRectRef.current
        const flyId = Date.now()
        const flyX = rect.left + rect.width / 2
        const flyY = rect.top + rect.height / 2

        setFlyingEggs((prev) => [...prev, { id: flyId, x: flyX, y: flyY }])
        setEggs((prev) => prev.map((eg) => (eg.id === eggId ? { ...eg, picked: true } : eg)))
        setJustPickedId(eggId)
        soundManager.playPickSound()
        setTimeout(() => setJustPickedId(null), 300)
        setTimeout(() => {
          setFlyingEggs((prev) => prev.filter((f) => f.id !== flyId))
        }, 600)

        const unpickedCount = eggs.filter((e) => !e.picked && e.id !== eggId).length
        if (unpickedCount === 0 && eggCount < maxEggs) {
          setTimeout(() => {
            setEggs(initialEggs.map((e) => ({ ...e, picked: false })))
          }, 500)
        }
      }

      prevPendingIdRef.current = null
      prevPendingRectRef.current = null
    }
    prevEggCountRef.current = eggCount
    prevMathChallengeRef.current = mathChallenge
  }, [mathChallenge, eggCount, eggs, maxEggs])

  const handleEggClick = (egg: EggPosition, e: React.MouseEvent) => {
    if (egg.picked) return
    if (eggCount >= maxEggs) return
    if (mathChallenge) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    requestPickEgg(egg.id, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    })
  }

  return (
    <div className="relative w-full h-full flex items-end justify-center select-none">
      <div className="relative w-[300px] h-[280px] md:w-[360px] md:h-[320px]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] md:h-[230px]" style={{
          background: 'linear-gradient(180deg, #A1887F 0%, #8D6E63 50%, #6D4C41 100%)',
          borderRadius: '12px 12px 20px 20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25), inset 0 4px 10px rgba(255,255,255,0.1)',
        }} />

        <div className="hidden md:block absolute bottom-[180px] left-1/2 -translate-x-1/2 w-0 h-0" style={{
          borderLeft: '210px solid transparent',
          borderRight: '210px solid transparent',
          borderBottom: '105px solid #5D4037',
          filter: 'drop-shadow(0 -4px 10px rgba(0,0,0,0.2))',
        }} />
        <div className="md:hidden absolute bottom-[160px] left-1/2 -translate-x-1/2 w-0 h-0" style={{
          borderLeft: '180px solid transparent',
          borderRight: '180px solid transparent',
          borderBottom: '90px solid #5D4037',
          filter: 'drop-shadow(0 -4px 10px rgba(0,0,0,0.2))',
        }} />

        <div className="absolute bottom-[100px] md:bottom-[115px] left-1/2 -translate-x-1/2 w-[120px] h-[90px] md:w-[140px] md:h-[105px]" style={{
          background: 'linear-gradient(180deg, #2196F3 0%, #1976D2 100%)',
          borderRadius: '60px 60px 8px 8px',
          boxShadow: 'inset -8px -8px 16px rgba(0,0,0,0.2), inset 4px 4px 8px rgba(255,255,255,0.2)',
          border: '4px solid #FFC107',
        }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-2xl md:text-3xl">🐔</div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-[100px] md:h-[115px]" style={{
          background: 'linear-gradient(180deg, #D7CCC8 0%, #BCAAA4 100%)',
          borderRadius: '16px 16px 20px 20px',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {eggs.map((egg) => (
            !egg.picked && (
              <div
                key={egg.id}
                className={`absolute egg-clickable transition-all duration-150 ${
                  justPickedId === egg.id ? 'animate-bounce-hard' : 'animate-bounce-soft'
                }`}
                style={{
                  left: `${egg.x}%`,
                  top: `${egg.y - 45}%`,
                  transform: `scale(${egg.scale}) rotate(${egg.rotation}deg)`,
                  zIndex: 5,
                  animationDelay: `${egg.id * 0.15}s`,
                }}
                onClick={(e) => handleEggClick(egg, e)}
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleEggClick(egg, e as unknown as React.MouseEvent)
                }}
              >
                <svg width="40" height="52" viewBox="0 0 40 52" className="md:w-[48px] md:h-[62px] drop-shadow-lg">
                  <defs>
                    <radialGradient id={`eggGrad-${egg.id}`} cx="35%" cy="25%" r="70%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#FFFDE7" />
                      <stop offset="100%" stopColor="#FFF9C4" />
                    </radialGradient>
                  </defs>
                  <ellipse
                    cx="20"
                    cy="26"
                    rx="17"
                    ry="24"
                    fill={`url(#eggGrad-${egg.id})`}
                    stroke="#FFE082"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="14" cy="18" rx="4" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(-20 14 18)" />
                </svg>
              </div>
            )
          ))}
        </div>

        <div className="absolute -top-4 left-6 text-5xl md:text-6xl animate-bounce-soft" style={{ animationDelay: '0.5s' }}>
          🐓
        </div>
      </div>

      {flyingEggs.map((fly) => (
        <div
          key={fly.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: fly.x - 20,
            top: fly.y - 26,
            animation: 'flyToStats 0.6s ease-in forwards',
            ['--fly-x' as string]: `calc(50vw - ${fly.x}px)`,
            ['--fly-y' as string]: `calc(120px - ${fly.y}px)`,
          }}
        >
          <svg width="40" height="52" viewBox="0 0 40 52">
            <defs>
              <radialGradient id="flyEgg" cx="35%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FFFDE7" />
                <stop offset="100%" stopColor="#FFF9C4" />
              </radialGradient>
            </defs>
            <ellipse cx="20" cy="26" rx="17" ry="24" fill="url(#flyEgg)" stroke="#FFE082" strokeWidth="1.5" />
          </svg>
        </div>
      ))}

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center w-full pb-2">
        <div className="inline-block px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-amber-800 text-lg md:text-xl font-bold shadow-md border-2 border-amber-400">
          🥚 鸡窝
        </div>
      </div>
    </div>
  )
}
