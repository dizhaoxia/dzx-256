import { Truck } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import TruckComponent from './Truck'

export default function TruckArea() {
  const trucks = useGameStore((state) => state.trucks)
  const deliverToTruck = useGameStore((state) => state.deliverToTruck)
  const selectedTruckId = useGameStore((state) => state.selectedTruckId)
  const selectedDeliveryType = useGameStore((state) => state.selectedDeliveryType)
  const feedbackMessage = useGameStore((state) => state.feedbackMessage)
  const showFeedback = useGameStore((state) => state.showFeedback)
  const feedbackType = useGameStore((state) => state.feedbackType)

  const canDeliver = selectedTruckId !== null && selectedDeliveryType !== null
  const matchedCount = trucks.filter((t) => t.matched).length

  const handleDeliver = () => {
    if (canDeliver) {
      deliverToTruck()
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-gradient-to-b from-amber-100/80 to-orange-100/80 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-6 border-4 border-amber-400">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Truck className="w-7 h-7 md:w-9 md:h-9 text-amber-700" />
            <h2
              className="text-xl md:text-3xl font-black text-amber-800"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              🚛 货车装载区
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2 shadow-md">
            <span className="text-amber-700 font-bold text-sm md:text-base">进度：</span>
            <div className="flex gap-1">
              {trucks.map((t) => (
                <div
                  key={t.generationId}
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${
                    t.matched
                      ? 'bg-green-500 text-white scale-110 shadow-md'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {t.matched ? '✓' : t.id}
                </div>
              ))}
            </div>
            <span className="text-amber-800 font-black text-sm md:text-base ml-2">
              {matchedCount}/{trucks.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-5">
          {trucks.map((truck) => (
            <TruckComponent key={truck.generationId} truck={truck} />
          ))}
        </div>

        {showFeedback && (
          <div
            className={`mb-5 p-4 rounded-2xl text-center font-bold text-base md:text-xl animate-pop-in shadow-lg ${
              feedbackType === 'success'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-red-400 to-rose-500 text-white animate-error-shake'
            }`}
          >
            {feedbackMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <div className="text-xs md:text-sm text-gray-600 font-bold mb-1">操作提示</div>
              <div className="text-sm md:text-base text-gray-700">
                {selectedDeliveryType ? (
                  selectedTruckId ? (
                    <span className="text-green-700 font-bold">✅ 已选择物品和货车，点击运送按钮！</span>
                  ) : (
                    <span className="text-amber-700">👆 已选物品，请点击上方一辆货车</span>
                  )
                ) : selectedTruckId ? (
                  <span className="text-amber-700">👆 已选货车，请先在上方选择苹果或鸡蛋</span>
                ) : (
                  <span>请先选择运送的物品（🍎/🥚），再选择目标货车</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleDeliver}
            disabled={!canDeliver}
            className={`relative px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black text-lg md:text-2xl shadow-xl transition-all duration-200 overflow-hidden ${
              canDeliver
                ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white hover:scale-105 active:scale-95 btn-3d animate-pulse-glow cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
            }`}
            style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
          >
            <span className="relative z-10 flex items-center gap-2 md:gap-3">
              <span className="text-2xl md:text-3xl">🚚</span>
              <span>运 送</span>
              <span className="text-2xl md:text-3xl">✨</span>
            </span>
          </button>
        </div>

        <div className="mt-5 relative h-4 md:h-5 w-full overflow-hidden rounded-full bg-gradient-to-r from-gray-300 to-gray-400">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-700 ease-out rounded-full shadow-lg"
            style={{ width: `${(matchedCount / trucks.length) * 100}%` }}
          >
            <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white drop-shadow-md">
            完成度 {Math.round((matchedCount / trucks.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
