import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { soundManager } from '@/utils/soundManager'

export default function StatsPanel() {
  const appleCount = useGameStore((state) => state.appleCount)
  const eggCount = useGameStore((state) => state.eggCount)
  const selectedDeliveryType = useGameStore((state) => state.selectedDeliveryType)
  const selectDeliveryType = useGameStore((state) => state.selectDeliveryType)
  const resetGame = useGameStore((state) => state.resetGame)
  const completedRounds = useGameStore((state) => state.completedRounds)
  const difficulty = useGameStore((state) => state.difficulty)
  const bonusStars = useGameStore((state) => state.bonusStars)

  const [appleBounce, setAppleBounce] = useState(false)
  const [eggBounce, setEggBounce] = useState(false)
  const [prevAppleCount, setPrevAppleCount] = useState(0)
  const [prevEggCount, setPrevEggCount] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (appleCount !== prevAppleCount) {
      setAppleBounce(true)
      setPrevAppleCount(appleCount)
      const timer = setTimeout(() => setAppleBounce(false), 500)
      return () => clearTimeout(timer)
    }
  }, [appleCount, prevAppleCount])

  useEffect(() => {
    if (eggCount !== prevEggCount) {
      setEggBounce(true)
      setPrevEggCount(eggCount)
      const timer = setTimeout(() => setEggBounce(false), 500)
      return () => clearTimeout(timer)
    }
  }, [eggCount, prevEggCount])

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute()
    setIsMuted(muted)
  }

  const handleReset = () => {
    if (confirm('确定要重新开始游戏吗？')) {
      resetGame()
    }
  }

  const difficultyLabel =
    difficulty === 1 ? '入门 · 5以内' : difficulty === 2 ? '进阶 · 10以内' : '挑战 · 15以内'

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-6 border-4 border-yellow-400">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 rounded-full border-2 border-indigo-200 shadow-sm">
              <span className="text-sm md:text-base">🏆</span>
              <span className="text-xs md:text-sm font-bold text-indigo-700">
                第 {completedRounds + 1} 轮
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 shadow-sm transition-all ${
                difficulty === 1
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200'
                  : difficulty === 2
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200'
                  : 'bg-gradient-to-r from-rose-100 to-red-100 border-rose-200 animate-pulse-glow'
              }`}
            >
              <span className="text-sm md:text-base">{'⭐'.repeat(difficulty)}</span>
              <span
                className={`text-xs md:text-sm font-bold ${
                  difficulty === 1
                    ? 'text-green-700'
                    : difficulty === 2
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {difficultyLabel}
              </span>
            </div>
            {bonusStars > 0 && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1.5 rounded-full border-2 border-yellow-300 shadow-sm animate-bounce-soft">
                <span className="text-sm md:text-base">✨</span>
                <span className="text-xs md:text-sm font-black text-amber-700">
                  {bonusStars} ⭐
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform btn-3d"
              title={isMuted ? '开启音效' : '关闭音效'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={handleReset}
              className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform btn-3d"
              title="重新开始"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center md:justify-start">
            <div
              className={`flex items-center gap-2 md:gap-3 px-5 md:px-7 py-2 md:py-3 rounded-2xl cursor-pointer transition-all duration-200 border-4 ${
                selectedDeliveryType === 'apple'
                  ? 'bg-red-100 border-red-500 scale-105 shadow-lg ring-4 ring-red-300'
                  : 'bg-red-50 border-red-200 hover:border-red-300 hover:scale-102'
              }`}
              onClick={() =>
                selectDeliveryType(selectedDeliveryType === 'apple' ? null : 'apple')
              }
            >
              <div
                className="text-4xl md:text-5xl animate-bounce-soft"
                style={{ animationDelay: '0.1s' }}
              >
                🍎
              </div>
              <div className="flex flex-col">
                <span className="text-red-400 text-xs md:text-sm font-bold">苹果</span>
                <span
                  className={`text-3xl md:text-5xl font-black text-red-600 ${
                    appleBounce ? 'animate-count-bounce' : ''
                  }`}
                  style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
                >
                  {appleCount}
                </span>
              </div>
            </div>

            <div className="text-3xl md:text-4xl text-amber-500 font-black">VS</div>

            <div
              className={`flex items-center gap-2 md:gap-3 px-5 md:px-7 py-2 md:py-3 rounded-2xl cursor-pointer transition-all duration-200 border-4 ${
                selectedDeliveryType === 'egg'
                  ? 'bg-amber-100 border-amber-500 scale-105 shadow-lg ring-4 ring-amber-300'
                  : 'bg-amber-50 border-amber-200 hover:border-amber-300 hover:scale-102'
              }`}
              onClick={() => selectDeliveryType(selectedDeliveryType === 'egg' ? null : 'egg')}
            >
              <div
                className="text-4xl md:text-5xl animate-bounce-soft"
                style={{ animationDelay: '0.3s' }}
              >
                🥚
              </div>
              <div className="flex flex-col">
                <span className="text-amber-400 text-xs md:text-sm font-bold">鸡蛋</span>
                <span
                  className={`text-3xl md:text-5xl font-black text-amber-600 ${
                    eggBounce ? 'animate-count-bounce' : ''
                  }`}
                  style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
                >
                  {eggCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {selectedDeliveryType && (
          <div className="mt-4 text-center animate-pop-in">
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-bold text-base md:text-lg shadow-lg">
              ✨ 已选择运送：{selectedDeliveryType === 'apple' ? '🍎 苹果' : '🥚 鸡蛋'}，请选择下方货车
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
