import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { soundManager } from '@/utils/soundManager'
import type { MathChallenge } from '@/store/gameStore'

function getEmojiForType(type: MathChallenge['type']) {
  if (type === 'pickApple') return '🍎'
  if (type === 'pickEgg') return '🥚'
  return '❓'
}

function getTitleForType(type: MathChallenge['type']) {
  if (type === 'pickApple') return '采摘苹果挑战'
  if (type === 'pickEgg') return '喂食母鸡挑战'
  return '算术挑战'
}

function getBgGradientForType(type: MathChallenge['type']) {
  if (type === 'pickApple') return 'from-red-400 via-rose-500 to-pink-500'
  if (type === 'pickEgg') return 'from-amber-400 via-orange-500 to-yellow-500'
  return 'from-blue-400 via-indigo-500 to-purple-500'
}

export default function MathModal() {
  const mathChallenge = useGameStore((s) => s.mathChallenge)
  const submitMathAnswer = useGameStore((s) => s.submitMathAnswer)
  const cancelPick = useGameStore((s) => s.cancelPick)
  const tickCountdown = useGameStore((s) => s.tickCountdown)
  const setCountdownInterval = useGameStore((s) => s.setCountdownInterval)
  const difficulty = useGameStore((s) => s.difficulty)
  const bonusStars = useGameStore((s) => s.bonusStars)

  const [inputValue, setInputValue] = useState('')
  const [animateShake, setAnimateShake] = useState(false)
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevAttemptRef = useRef(0)

  useEffect(() => {
    if (mathChallenge) {
      setInputValue('')
      setShowHint(false)
      setAnimateShake(false)
      setAnimateSuccess(false)
      prevAttemptRef.current = 0
      setTimeout(() => inputRef.current?.focus(), 100)

      if (mathChallenge.isCountdownActive && !mathChallenge.countdownIntervalId) {
        const id = setInterval(() => {
          tickCountdown()
        }, 1000)
        setCountdownInterval(id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mathChallenge])

  useEffect(() => {
    if (!mathChallenge) return
    if (mathChallenge.attemptCount > prevAttemptRef.current) {
      prevAttemptRef.current = mathChallenge.attemptCount
      setAnimateShake(true)
      soundManager.playErrorSound()
      setTimeout(() => setAnimateShake(false), 500)
    }
  }, [mathChallenge?.attemptCount, mathChallenge])

  if (!mathChallenge) return null

  const { operand1, operand2, operation, correctAnswer, sceneText, showErrorSteps, attemptCount, isCountdownActive, countdownSeconds, type } = mathChallenge
  const emoji = getEmojiForType(type)
  const title = getTitleForType(type)
  const bgGradient = getBgGradientForType(type)
  const opSymbol = operation === 'add' ? '+' : '-'

  const handleSubmit = () => {
    if (inputValue === '') return
    const num = parseInt(inputValue, 10)
    if (isNaN(num)) {
      setAnimateShake(true)
      setTimeout(() => setAnimateShake(false), 500)
      return
    }

    const result = submitMathAnswer(num)
    if (result.success) {
      setAnimateSuccess(true)
      soundManager.playSuccessSound()
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const renderNumberPad = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    return (
      <div className="grid grid-cols-5 gap-2 md:gap-3 w-full max-w-sm mx-auto">
        {digits.map((d) => (
          <button
            key={d}
            onClick={() => setInputValue((v) => v + d)}
            className="aspect-square rounded-2xl bg-white text-gray-800 font-black text-2xl md:text-3xl shadow-lg hover:scale-105 active:scale-95 transition-all btn-3d"
            style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
          >
            {d}
          </button>
        ))}
      </div>
    )
  }

  const countdownPercent = isCountdownActive
    ? Math.max(0, (countdownSeconds / (difficulty === 2 ? 30 : 20)) * 100)
    : 0

  const countdownColor =
    countdownSeconds <= 5
      ? 'bg-gradient-to-r from-red-500 to-rose-600'
      : countdownSeconds <= 10
      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
      : 'bg-gradient-to-r from-green-400 to-emerald-500'

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-pop-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={cancelPick}
      />
      <div
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white animate-pop-in ${
          animateShake ? 'animate-error-shake' : ''
        } ${animateSuccess ? 'animate-bounce-hard' : ''}`}
      >
        <div className={`bg-gradient-to-r ${bgGradient} p-5 md:p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-2 right-2 text-6xl md:text-8xl opacity-20">
            {emoji}
          </div>

          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl animate-bounce-soft">{emoji}</span>
              <h2
                className="text-2xl md:text-3xl font-black"
                style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
              >
                {title}
              </h2>
            </div>

            {difficulty >= 2 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-xl">⭐</span>
                <span className="font-black text-lg">{bonusStars}</span>
              </div>
            )}
          </div>

          <div className="relative z-10 inline-block px-3 py-1 bg-white/25 rounded-full text-sm md:text-base font-bold mb-2">
            难度：{'⭐'.repeat(difficulty)} {difficulty === 1 ? '入门' : difficulty === 2 ? '进阶' : '挑战'}
          </div>

          {isCountdownActive && (
            <div className="relative z-10 mt-3">
              <div className="flex items-center justify-between mb-1 text-sm md:text-base font-bold">
                <span className="flex items-center gap-1">
                  <span className={`text-lg ${countdownSeconds <= 5 ? 'animate-bounce-soft' : ''}`}>⏱️</span>
                  <span>倒计时</span>
                </span>
                <span className={`text-2xl md:text-3xl font-black ${countdownSeconds <= 5 ? 'text-yellow-200 animate-bounce-hard' : ''}`}>
                  {countdownSeconds}s
                </span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full ${countdownColor} transition-all duration-1000 ease-linear rounded-full`}
                  style={{ width: `${countdownPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-5 md:p-6">
          <div className="bg-gradient-to-b from-yellow-50 to-amber-50 rounded-2xl p-4 md:p-5 mb-5 border-2 border-amber-200 shadow-inner">
            <p
              className="text-lg md:text-2xl text-amber-900 font-bold text-center leading-relaxed"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              {sceneText}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-5 mb-5">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-blue-700 shadow-md border-2 border-blue-300">
              {operand1}
            </div>
            <div className="text-4xl md:text-5xl font-black text-gray-600" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
              {opSymbol}
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-purple-700 shadow-md border-2 border-purple-300">
              {operand2}
            </div>
            <div className="text-4xl md:text-5xl font-black text-gray-600" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
              =
            </div>
            <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-emerald-700 shadow-md border-4 ${
              animateSuccess ? 'border-green-500 animate-bounce-hard' : 'border-emerald-300 border-dashed'
            }`}>
              {animateSuccess ? correctAnswer : inputValue || '?'}
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={handleKey}
                placeholder="输入答案"
                className={`flex-1 px-5 py-3 md:py-4 text-2xl md:text-3xl text-center font-black rounded-2xl border-4 outline-none transition-all ${
                  animateShake
                    ? 'border-red-400 bg-red-50 animate-error-shake'
                    : animateSuccess
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 focus:border-yellow-400 focus:bg-yellow-50'
                }`}
                style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
                readOnly={animateSuccess}
              />
            </div>

            {renderNumberPad()}
          </div>

          {showErrorSteps && attemptCount > 0 && !animateSuccess && (
            <div className="mb-5 p-4 md:p-5 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border-2 border-red-300 animate-pop-in">
              <div className="flex items-start gap-3">
                <span className="text-3xl md:text-4xl animate-bounce-soft">💡</span>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-black text-red-700 mb-3" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                    别灰心！让我们一步步来算：
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 md:p-4 space-y-2">
                    {operation === 'add' ? (
                      <>
                        <div className="flex items-center gap-2 text-base md:text-lg text-gray-700">
                          <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-black flex-shrink-0">
                            1
                          </span>
                          <span>先拿出 <span className="font-black text-blue-600">{operand1}</span> 个{emoji}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base md:text-lg text-gray-700">
                          <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-400 text-white flex items-center justify-center font-black flex-shrink-0">
                            2
                          </span>
                          <span>再拿来 <span className="font-black text-purple-600">{operand2}</span> 个{emoji}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base md:text-lg text-gray-700">
                          <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-black flex-shrink-0">
                            3
                          </span>
                          <span>
                            数一数：{Array.from({ length: operand1 }).map((_, i) => (
                              <span key={`e1-${i}`}>{emoji}</span>
                            ))}
                            {Array.from({ length: operand2 }).map((_, i) => (
                              <span key={`e2-${i}`}>{emoji}</span>
                            ))}
                            {' '}= <span className="font-black text-green-600 text-xl md:text-2xl">{correctAnswer}</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-base md:text-lg text-gray-700">
                          <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-black flex-shrink-0">
                            1
                          </span>
                          <span>先数出 <span className="font-black text-blue-600">{operand1}</span> 个{emoji}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base md:text-lg text-gray-700">
                          <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-400 text-white flex items-center justify-center font-black flex-shrink-0">
                            2
                          </span>
                          <span>吃掉 <span className="font-black text-purple-600">{operand2}</span> 个{emoji}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base md:text-lg text-gray-700">
                          <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-black flex-shrink-0">
                            3
                          </span>
                          <span>
                            划掉吃掉的：
                            {Array.from({ length: operand1 }).map((_, i) => (
                              <span
                                key={`eall-${i}`}
                                className={`relative inline-block ${i < operand2 ? 'line-through text-red-400' : ''}`}
                              >
                                {emoji}
                              </span>
                            ))}
                            {' '}剩下 <span className="font-black text-green-600 text-xl md:text-2xl">{correctAnswer}</span> 个
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-3 text-sm md:text-base text-red-600 font-bold text-center">
                    提示：正确答案是 <span className="text-lg md:text-xl font-black">{correctAnswer}</span>，再试一次吧！
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showHint && attemptCount >= 2 && !animateSuccess && (
            <button
              onClick={() => setShowHint(true)}
              className="mb-4 w-full py-2 md:py-3 text-base md:text-lg font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border-2 border-blue-200 border-dashed"
            >
              🤔 需要提示吗？点击查看步骤
            </button>
          )}

          {showHint && !animateSuccess && (
            <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-xl border-2 border-blue-200 animate-pop-in">
              <div className="text-sm md:text-base text-blue-700 font-bold text-center">
                🧮 算式：<span className="text-xl md:text-2xl font-black text-blue-800">{operand1} {opSymbol} {operand2} = ?</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 md:gap-4">
            <button
              onClick={cancelPick}
              disabled={animateSuccess}
              className="flex-1 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all btn-3d disabled:opacity-50"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              取消
            </button>
            <button
              onClick={() => {
                setInputValue('')
                inputRef.current?.focus()
              }}
              disabled={animateSuccess || !inputValue}
              className="flex-1 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all btn-3d disabled:opacity-50"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              清除
            </button>
            <button
              onClick={handleSubmit}
              disabled={animateSuccess || inputValue === ''}
              className="flex-[1.5] py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all btn-3d disabled:opacity-50 animate-pulse-glow"
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
            >
              ✅ 确认答案
            </button>
          </div>

          <div className="mt-4 text-center text-xs md:text-sm text-gray-500">
            尝试次数：<span className="font-bold text-gray-700">{attemptCount}</span> 次
            {isCountdownActive && countdownSeconds > (difficulty === 2 ? 15 : 10) && (
              <span className="ml-2 text-amber-600 font-bold">
                ✨ 快速答题可获得⭐奖励
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
