import AppleTree from './AppleTree'
import ChickenCoop from './ChickenCoop'
import StatsPanel from './StatsPanel'
import TruckArea from './TruckArea'
import Celebration from './Celebration'
import MathModal from './MathModal'

export default function FarmScene() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="cloud absolute top-[8%] text-6xl md:text-8xl opacity-80"
          style={{ animationDuration: '45s', animationDelay: '0s' }}
        >
          ☁️
        </div>
        <div
          className="cloud absolute top-[15%] text-5xl md:text-7xl opacity-70"
          style={{ animationDuration: '60s', animationDelay: '-20s' }}
        >
          ☁️
        </div>
        <div
          className="cloud absolute top-[5%] text-4xl md:text-6xl opacity-60"
          style={{ animationDuration: '70s', animationDelay: '-40s' }}
        >
          ☁️
        </div>

        <div
          className="absolute top-[6%] right-[10%] text-6xl md:text-8xl animate-bounce-soft"
          style={{ filter: 'drop-shadow(0 0 30px rgba(255, 193, 7, 0.6))' }}
        >
          ☀️
        </div>

        <div className="absolute bottom-[28%] left-[3%] text-4xl md:text-6xl opacity-80 animate-bounce-soft" style={{ animationDelay: '0.3s' }}>
          🌻
        </div>
        <div className="absolute bottom-[26%] right-[4%] text-3xl md:text-5xl opacity-80 animate-bounce-soft" style={{ animationDelay: '0.6s' }}>
          🌷
        </div>
        <div className="absolute bottom-[30%] left-[15%] text-2xl md:text-4xl opacity-70 animate-bounce-soft" style={{ animationDelay: '0.9s' }}>
          🌼
        </div>
        <div className="absolute bottom-[27%] right-[18%] text-3xl md:text-5xl opacity-75 animate-bounce-soft" style={{ animationDelay: '1.2s' }}>
          🌸
        </div>

        <div className="absolute bottom-[25%] left-[40%] text-2xl md:text-3xl animate-bounce-soft" style={{ animationDelay: '0.5s' }}>
          🐛
        </div>
        <div className="absolute top-[35%] right-[8%] text-2xl md:text-3xl animate-bounce-soft" style={{ animationDelay: '1s' }}>
          🦋
        </div>
        <div className="absolute top-[28%] left-[8%] text-2xl md:text-3xl animate-bounce-soft" style={{ animationDelay: '1.5s' }}>
          🐝
        </div>
      </div>

      <header className="relative z-10 pt-4 md:pt-6 pb-2 md:pb-3">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-3"
            style={{
              fontFamily: "'ZCOOL KuaiLe', 'Ma Shan Zheng', sans-serif",
              background: 'linear-gradient(135deg, #E53935 0%, #FF9800 25%, #FFEB3B 50%, #4CAF50 75%, #2196F3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '4px 4px 0 rgba(255,255,255,0.5)',
              filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
            }}
          >
            🌾 农场算术大丰收 🌾
          </h1>
          <p className="text-base md:text-xl text-green-800 font-bold bg-white/60 backdrop-blur-sm inline-block px-5 py-2 rounded-full shadow-md border-2 border-green-300">
            算算术 🧮 摘果🥚🍎 凑答案 🚚 运货车 · 快乐学数学！
          </p>
        </div>
      </header>

      <section className="relative z-10 py-3 md:py-4">
        <StatsPanel />
      </section>

      <section className="relative z-10 py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-end">
            <div className="h-[340px] md:h-[420px] bg-gradient-to-b from-green-200/40 to-green-300/40 backdrop-blur-sm rounded-3xl border-4 border-green-400/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-white/70 rounded-full px-3 py-1 text-xs md:text-sm font-bold text-green-700 shadow">
                👆 点苹果 · 做加法
              </div>
              <AppleTree />
            </div>

            <div className="h-[340px] md:h-[420px] bg-gradient-to-b from-amber-200/40 to-orange-200/40 backdrop-blur-sm rounded-3xl border-4 border-amber-400/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-white/70 rounded-full px-3 py-1 text-xs md:text-sm font-bold text-amber-700 shadow">
                👆 点鸡蛋 · 做减法
              </div>
              <ChickenCoop />
            </div>
          </div>

          <div className="relative mt-6 md:mt-8">
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-10">
              <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white text-sm md:text-base flex items-center gap-2">
                <span className="text-xl">⬇️</span>
                道路
                <span className="text-xl">⬇️</span>
              </div>
            </div>
            <div
              className="h-6 md:h-8 w-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #5D4037 0%, #795548 20%, #8D6E63 50%, #795548 80%, #5D4037 100%)',
                boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-around">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 md:w-12 h-1.5 md:h-2 bg-yellow-300 rounded-sm"
                    style={{ opacity: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-8 md:pb-12">
        <TruckArea />
      </section>

      <Celebration />
      <MathModal />

      <footer className="relative z-10 pb-4 pt-2">
        <div className="text-center text-xs md:text-sm text-green-900/60 font-bold">
          🌱 数学启蒙 · 快乐学习 · 农场大冒险 🌱
        </div>
      </footer>
    </div>
  )
}
