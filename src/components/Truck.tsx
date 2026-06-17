import { useState, useEffect } from 'react'
import type { Truck as TruckType } from '@/store/gameStore'
import { useGameStore } from '@/store/gameStore'
import { soundManager } from '@/utils/soundManager'

interface TruckProps {
  truck: TruckType
}

export default function Truck({ truck }: TruckProps) {
  const selectTruck = useGameStore((state) => state.selectTruck)
  const selectedTruckId = useGameStore((state) => state.selectedTruckId)
  const feedbackType = useGameStore((state) => state.feedbackType)
  const showFeedback = useGameStore((state) => state.showFeedback)

  const isSelected = selectedTruckId === truck.id
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const [animateError, setAnimateError] = useState(false)
  const [prevMatched, setPrevMatched] = useState(truck.matched)

  useEffect(() => {
    if (truck.matched && !prevMatched) {
      setAnimateSuccess(true)
      soundManager.playSuccessSound()
      const timer = setTimeout(() => setAnimateSuccess(false), 1500)
      return () => clearTimeout(timer)
    }
    setPrevMatched(truck.matched)
  }, [truck.matched, prevMatched])

  useEffect(() => {
    if (showFeedback && feedbackType === 'error' && isSelected) {
      setAnimateError(true)
      soundManager.playErrorSound()
      const timer = setTimeout(() => setAnimateError(false), 600)
      return () => clearTimeout(timer)
    }
  }, [showFeedback, feedbackType, isSelected])

  const handleClick = () => {
    if (!truck.matched) {
      selectTruck(truck.id)
      soundManager.playDeliverySound()
    }
  }

  const itemEmoji = truck.id === 1 ? '🍎' : truck.id === 2 ? '🥚' : '🍎🥚'

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer transition-all duration-300 ${
        truck.matched ? 'cursor-default' : ''
      } ${animateSuccess ? 'animate-bounce-hard' : ''}`}
    >
      <div
        className={`relative rounded-3xl p-4 md:p-5 transition-all duration-300 ${
          truck.matched
            ? 'animate-success-glow border-4 border-green-400'
            : isSelected
            ? 'animate-truck-selected border-4 border-yellow-400 scale-105'
            : animateError
            ? 'animate-error-shake animate-error-flash border-4 border-red-400'
            : 'border-4 border-transparent hover:scale-105 hover:shadow-2xl'
        }`}
        style={{
          background: truck.matched
            ? 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)'
            : `linear-gradient(135deg, ${truck.color}20 0%, ${truck.color}40 100%)`,
        }}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-black shadow-xl border-4 ${
              truck.matched
                ? 'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-300'
                : 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white border-yellow-200'
            }`}
            style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
          >
            {truck.target}
          </div>
        </div>

        <div className="mt-8 relative">
          <svg viewBox="0 0 240 140" className="w-full h-auto" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }}>
            <defs>
              <linearGradient id={`cargoGrad-${truck.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={truck.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={truck.color} stopOpacity="1" />
              </linearGradient>
              <linearGradient id={`cabGrad-${truck.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F44336" />
                <stop offset="100%" stopColor="#D32F2F" />
              </linearGradient>
            </defs>

            <rect x="10" y="25" width="140" height="75" rx="8" fill={`url(#cargoGrad-${truck.id})`} stroke="#000" strokeWidth="2" strokeOpacity="0.2" />
            
            {truck.matched && (
              <g>
                {Array.from({ length: truck.target }).map((_, i) => (
                  <text
                    key={i}
                    x={30 + i * 35}
                    y="68"
                    fontSize="28"
                    textAnchor="middle"
                  >
                    {truck.id === 1 ? '🍎' : truck.id === 2 ? '🥚' : (i % 2 === 0 ? '🍎' : '🥚')}
                  </text>
                ))}
              </g>
            )}

            {!truck.matched && (
              <text x="80" y="72" fontSize="40" textAnchor="middle" fill="white" fillOpacity="0.5">
                ?
              </text>
            )}

            <path d="M150 25 L200 25 Q220 25 225 45 L225 75 Q225 82 218 82 L150 82 Z" fill={`url(#cabGrad-${truck.id})`} stroke="#000" strokeWidth="2" strokeOpacity="0.2" />
            <rect x="160" y="38" width="40" height="28" rx="4" fill="#81D4FA" stroke="#0277BD" strokeWidth="1.5" />
            <line x1="180" y1="38" x2="180" y2="66" stroke="#0277BD" strokeWidth="1" />
            
            <circle cx="50" cy="108" r="18" fill="#424242" stroke="#212121" strokeWidth="3" />
            <circle cx="50" cy="108" r="9" fill="#9E9E9E" />
            <circle cx="50" cy="108" r="3" fill="#424242" />
            
            <circle cx="120" cy="108" r="18" fill="#424242" stroke="#212121" strokeWidth="3" />
            <circle cx="120" cy="108" r="9" fill="#9E9E9E" />
            <circle cx="120" cy="108" r="3" fill="#424242" />
            
            <circle cx="190" cy="108" r="18" fill="#424242" stroke="#212121" strokeWidth="3" />
            <circle cx="190" cy="108" r="9" fill="#9E9E9E" />
            <circle cx="190" cy="108" r="3" fill="#424242" />

            <circle cx="220" cy="55" r="4" fill="#FFEB3B" stroke="#F57F17" strokeWidth="1" />
          </svg>
        </div>

        <div className="mt-3 text-center">
          <div className={`text-sm md:text-base font-bold ${
            truck.matched ? 'text-green-700' : 'text-gray-700'
          }`}>
            {truck.matched ? (
              <span className="inline-flex items-center gap-1">
                <span className="text-lg">✅</span> 已完成
              </span>
            ) : (
              <span>需运送 {truck.target} 个{itemEmoji}</span>
            )}
          </div>
        </div>

        {truck.matched && (
          <div className="absolute top-2 right-2 text-2xl md:text-3xl animate-bounce-soft">
            ⭐
          </div>
        )}
      </div>
    </div>
  )
}
