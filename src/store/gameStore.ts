import { create } from 'zustand'

export type MathOperation = 'add' | 'subtract'

export interface Truck {
  id: number
  target: number
  expression: string
  operand1: number
  operand2: number
  operation: MathOperation
  matched: boolean
  color: string
}

export type MathModalType = 'pickApple' | 'pickEgg' | 'deliver' | null

export interface MathChallenge {
  type: MathModalType
  operand1: number
  operand2: number
  operation: MathOperation
  correctAnswer: number
  sceneText: string
  showErrorSteps: boolean
  attemptCount: number
  isCountdownActive: boolean
  countdownSeconds: number
  countdownIntervalId: ReturnType<typeof setInterval> | null
}

type DeliveryType = 'apple' | 'egg' | null
type GameStatus = 'playing' | 'celebrating'

function getDifficultyLevel(completedRounds: number): 1 | 2 | 3 {
  if (completedRounds < 3) return 1
  if (completedRounds < 6) return 2
  return 3
}

function getMaxNumber(difficulty: 1 | 2 | 3): number {
  if (difficulty === 1) return 5
  if (difficulty === 2) return 10
  return 15
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateAddition(maxNum: number): { operand1: number; operand2: number; answer: number } {
  const operand1 = randomInt(1, maxNum - 1)
  const operand2 = randomInt(1, maxNum - operand1)
  return { operand1, operand2, answer: operand1 + operand2 }
}

function generateSubtraction(maxNum: number): { operand1: number; operand2: number; answer: number } {
  const operand1 = randomInt(2, maxNum)
  const operand2 = randomInt(1, operand1 - 1)
  return { operand1, operand2, answer: operand1 - operand2 }
}

function generateTruckMath(
  id: number,
  difficulty: 1 | 2 | 3
): {
  target: number
  expression: string
  operand1: number
  operand2: number
  operation: MathOperation
} {
  const maxNum = getMaxNumber(difficulty)
  let data: { operand1: number; operand2: number; answer: number }
  let operation: MathOperation

  if (id === 1) {
    data = generateAddition(maxNum)
    operation = 'add'
  } else if (id === 2) {
    data = generateSubtraction(maxNum)
    operation = 'subtract'
  } else {
    if (Math.random() > 0.5) {
      data = generateAddition(maxNum)
      operation = 'add'
    } else {
      data = generateSubtraction(maxNum)
      operation = 'subtract'
    }
  }

  const expression = `${data.operand1} ${operation === 'add' ? '+' : '-'} ${data.operand2}`
  return {
    target: data.answer,
    expression,
    operand1: data.operand1,
    operand2: data.operand2,
    operation,
  }
}

function createInitialTrucks(): Truck[] {
  const colors = ['#E53935', '#FFC107', '#4CAF50']
  return [1, 2, 3].map((id) => ({
    id,
    matched: false,
    color: colors[id - 1],
    ...generateTruckMath(id, 1),
  }))
}

function generateRegenerationTrucks(completedRounds: number): Truck[] {
  const difficulty = getDifficultyLevel(completedRounds)
  const colors = ['#E53935', '#FFC107', '#4CAF50']
  return [1, 2, 3].map((id) => ({
    id,
    matched: false,
    color: colors[id - 1],
    ...generateTruckMath(id, difficulty),
  }))
}

function createPickAppleMath(completedRounds: number, currentApples: number): MathChallenge {
  const difficulty = getDifficultyLevel(completedRounds)
  const maxNum = getMaxNumber(difficulty)
  const existing = Math.min(currentApples, maxNum - 1)
  const { operand2 } = generateAddition(maxNum)
  const sceneText = `已有 ${existing} 个🍎，再摘 ${operand2} 个，一共几个？`
  const isCountdownActive = difficulty >= 2

  return {
    type: 'pickApple',
    operand1: existing,
    operand2,
    operation: 'add',
    correctAnswer: existing + operand2,
    sceneText,
    showErrorSteps: false,
    attemptCount: 0,
    isCountdownActive,
    countdownSeconds: isCountdownActive ? (difficulty === 2 ? 30 : 20) : 0,
    countdownIntervalId: null,
  }
}

function createPickEggMath(completedRounds: number, currentEggs: number): MathChallenge {
  const difficulty = getDifficultyLevel(completedRounds)
  const maxNum = getMaxNumber(difficulty)
  const baseTotal = Math.max(2, Math.min(currentEggs + 3, maxNum))
  const feedCount = randomInt(1, baseTotal - 1)
  const remaining = baseTotal - feedCount
  const sceneText = `有 ${baseTotal} 个🥚，喂给母鸡吃了 ${feedCount} 个，还剩几个？`
  const isCountdownActive = difficulty >= 2

  return {
    type: 'pickEgg',
    operand1: baseTotal,
    operand2: feedCount,
    operation: 'subtract',
    correctAnswer: remaining,
    sceneText,
    showErrorSteps: false,
    attemptCount: 0,
    isCountdownActive,
    countdownSeconds: isCountdownActive ? (difficulty === 2 ? 30 : 20) : 0,
    countdownIntervalId: null,
  }
}

interface GameState {
  appleCount: number
  eggCount: number
  maxApples: number
  maxEggs: number
  trucks: Truck[]
  selectedTruckId: number | null
  selectedDeliveryType: DeliveryType
  gameStatus: GameStatus
  feedbackMessage: string
  showFeedback: boolean
  feedbackType: 'success' | 'error' | null
  _timeouts: ReturnType<typeof setTimeout>[]

  completedRounds: number
  difficulty: 1 | 2 | 3
  bonusStars: number
  mathChallenge: MathChallenge | null
  pendingPickData: { type: 'apple' | 'egg'; id: number | null; rect: { left: number; top: number; width: number; height: number } | null } | null

  openMathChallenge: (challenge: MathChallenge) => void
  closeMathChallenge: () => void
  submitMathAnswer: (answer: number) => { success: boolean }
  showMathErrorSteps: () => void
  setCountdownInterval: (id: ReturnType<typeof setInterval> | null) => void
  tickCountdown: () => void
  incrementBonusStars: (amount: number) => void

  requestPickApple: (id: number, rect: { left: number; top: number; width: number; height: number }) => void
  requestPickEgg: (id: number, rect: { left: number; top: number; width: number; height: number }) => void
  confirmPickApple: () => void
  confirmPickEgg: () => void
  cancelPick: () => void

  pickApple: () => void
  pickEgg: () => void
  selectTruck: (truckId: number) => void
  selectDeliveryType: (type: DeliveryType) => void
  deliverToTruck: () => void
  startCelebrating: () => void
  resetGame: () => void
  regenerateTrucks: () => void
  setFeedback: (message: string, type: 'success' | 'error') => void
  clearFeedback: () => void
  _addTimeout: (id: ReturnType<typeof setTimeout>) => void
  _clearAllTimeouts: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  appleCount: 0,
  eggCount: 0,
  maxApples: 8,
  maxEggs: 8,
  trucks: createInitialTrucks(),
  selectedTruckId: null,
  selectedDeliveryType: null,
  gameStatus: 'playing',
  feedbackMessage: '',
  showFeedback: false,
  feedbackType: null,
  _timeouts: [],

  completedRounds: 0,
  difficulty: 1,
  bonusStars: 0,
  mathChallenge: null,
  pendingPickData: null,

  openMathChallenge: (challenge) => {
    set({ mathChallenge: challenge })
  },

  closeMathChallenge: () => {
    const { mathChallenge } = get()
    if (mathChallenge?.countdownIntervalId) {
      clearInterval(mathChallenge.countdownIntervalId)
    }
    set({ mathChallenge: null, pendingPickData: null })
  },

  submitMathAnswer: (answer) => {
    const state = get()
    if (!state.mathChallenge) return { success: false }

    const isCorrect = answer === state.mathChallenge.correctAnswer
    const newAttempt = state.mathChallenge.attemptCount + 1

    if (isCorrect) {
      if (state.mathChallenge.countdownIntervalId) {
        clearInterval(state.mathChallenge.countdownIntervalId)
      }
      if (
        state.mathChallenge.isCountdownActive &&
        state.mathChallenge.countdownSeconds > (state.difficulty === 2 ? 15 : 10)
      ) {
        get().incrementBonusStars(1)
      }

      const challengeType = state.mathChallenge.type
      if (challengeType === 'pickApple') {
        set({ mathChallenge: null })
        get().confirmPickApple()
      } else if (challengeType === 'pickEgg') {
        set({ mathChallenge: null })
        get().confirmPickEgg()
      }
      return { success: true }
    } else {
      set({
        mathChallenge: {
          ...state.mathChallenge,
          attemptCount: newAttempt,
          showErrorSteps: true,
        },
      })
      return { success: false }
    }
  },

  showMathErrorSteps: () => {
    const state = get()
    if (!state.mathChallenge) return
    set({ mathChallenge: { ...state.mathChallenge, showErrorSteps: true } })
  },

  setCountdownInterval: (id) => {
    const state = get()
    if (!state.mathChallenge) return
    set({ mathChallenge: { ...state.mathChallenge, countdownIntervalId: id } })
  },

  tickCountdown: () => {
    const state = get()
    if (!state.mathChallenge || !state.mathChallenge.isCountdownActive) return
    if (state.mathChallenge.countdownSeconds <= 0) return

    const newSeconds = state.mathChallenge.countdownSeconds - 1
    if (newSeconds <= 0 && state.mathChallenge.countdownIntervalId) {
      clearInterval(state.mathChallenge.countdownIntervalId)
    }
    set({
      mathChallenge: {
        ...state.mathChallenge,
        countdownSeconds: newSeconds,
      },
    })
  },

  incrementBonusStars: (amount) => {
    set((s) => ({ bonusStars: s.bonusStars + amount }))
  },

  requestPickApple: (id, rect) => {
    const { appleCount, maxApples, gameStatus, completedRounds } = get()
    if (gameStatus !== 'playing') return
    if (appleCount >= maxApples) return

    const challenge = createPickAppleMath(completedRounds, appleCount)
    set({ pendingPickData: { type: 'apple', id, rect } })
    get().openMathChallenge(challenge)
  },

  requestPickEgg: (id, rect) => {
    const { eggCount, maxEggs, gameStatus, completedRounds } = get()
    if (gameStatus !== 'playing') return
    if (eggCount >= maxEggs) return

    const challenge = createPickEggMath(completedRounds, eggCount)
    set({ pendingPickData: { type: 'egg', id, rect } })
    get().openMathChallenge(challenge)
  },

  confirmPickApple: () => {
    const state = get()
    const pending = state.pendingPickData
    if (!pending || pending.type !== 'apple') return
    if (!pending.rect) return

    set((s) => ({
      appleCount: Math.min(s.appleCount + 1, s.maxApples),
      pendingPickData: null,
    }))

    const t1 = setTimeout(() => {
      get()._clearAllTimeouts()
    }, 1000)
    get()._addTimeout(t1)
  },

  confirmPickEgg: () => {
    const state = get()
    const pending = state.pendingPickData
    if (!pending || pending.type !== 'egg') return

    set((s) => ({
      eggCount: Math.min(s.eggCount + 1, s.maxEggs),
      pendingPickData: null,
    }))
  },

  cancelPick: () => {
    const { mathChallenge } = get()
    if (mathChallenge?.countdownIntervalId) {
      clearInterval(mathChallenge.countdownIntervalId)
    }
    set({ mathChallenge: null, pendingPickData: null })
  },

  pickApple: () => {
    const { appleCount, maxApples, gameStatus } = get()
    if (gameStatus !== 'playing') return
    if (appleCount < maxApples) {
      set({ appleCount: appleCount + 1 })
    }
  },

  pickEgg: () => {
    const { eggCount, maxEggs, gameStatus } = get()
    if (gameStatus !== 'playing') return
    if (eggCount < maxEggs) {
      set({ eggCount: eggCount + 1 })
    }
  },

  selectTruck: (truckId) => {
    const { trucks, selectedTruckId, gameStatus } = get()
    if (gameStatus !== 'playing') return

    const truck = trucks.find((t) => t.id === truckId)
    if (!truck || truck.matched) return

    if (selectedTruckId === truckId) {
      set({ selectedTruckId: null })
    } else {
      set({ selectedTruckId: truckId })
    }
  },

  selectDeliveryType: (type) => {
    const { selectedDeliveryType, gameStatus } = get()
    if (gameStatus !== 'playing') return

    if (selectedDeliveryType === type) {
      set({ selectedDeliveryType: null })
    } else {
      set({ selectedDeliveryType: type })
    }
  },

  deliverToTruck: () => {
    const {
      selectedTruckId,
      selectedDeliveryType,
      appleCount,
      eggCount,
      trucks,
      gameStatus,
      _addTimeout,
      completedRounds,
    } = get()

    if (gameStatus !== 'playing') return

    if (selectedTruckId === null || selectedDeliveryType === null) {
      get().setFeedback('请先选择要运送的物品和货车！', 'error')
      const t = setTimeout(() => get().clearFeedback(), 2000)
      _addTimeout(t)
      return
    }

    const truck = trucks.find((t) => t.id === selectedTruckId)
    if (!truck || truck.matched) {
      get().setFeedback('请选择一个有效的货车！', 'error')
      const t = setTimeout(() => get().clearFeedback(), 2000)
      _addTimeout(t)
      return
    }

    const count = selectedDeliveryType === 'apple' ? appleCount : eggCount

    if (count === 0) {
      get().setFeedback(
        selectedDeliveryType === 'apple' ? '还没有采摘苹果哦！' : '还没有采摘鸡蛋哦！',
        'error'
      )
      const t = setTimeout(() => get().clearFeedback(), 2000)
      _addTimeout(t)
      return
    }

    if (count === truck.target) {
      const newTrucks = trucks.map((t) =>
        t.id === truck.id ? { ...t, matched: true } : t
      )
      const allMatched = newTrucks.every((t) => t.matched)

      const newState: Partial<GameState> = {
        trucks: newTrucks,
        selectedTruckId: null,
        selectedDeliveryType: null,
        feedbackMessage: `太棒了！${truck.expression}=${truck.target} 匹配成功！🎉`,
        showFeedback: true,
        feedbackType: 'success',
      }

      if (selectedDeliveryType === 'apple') {
        newState.appleCount = 0
      } else {
        newState.eggCount = 0
      }

      if (allMatched) {
        newState.completedRounds = completedRounds + 1
        newState.difficulty = getDifficultyLevel(completedRounds + 1)
      }

      set(newState)

      if (allMatched) {
        const t1 = setTimeout(() => get().startCelebrating(), 1500)
        _addTimeout(t1)
      }

      const t2 = setTimeout(() => get().clearFeedback(), 2000)
      _addTimeout(t2)
    } else {
      const diff = count - truck.target
      const diffText = diff > 0 ? `多了${diff}个` : `还差${Math.abs(diff)}个`
      get().setFeedback(
        `算式 ${truck.expression}=${truck.target}\n需要 ${truck.target} 个，当前有 ${count} 个（${diffText}）～`,
        'error'
      )
      const t = setTimeout(() => get().clearFeedback(), 3500)
      _addTimeout(t)
    }
  },

  startCelebrating: () => {
    set({ gameStatus: 'celebrating' })
  },

  regenerateTrucks: () => {
    const { completedRounds } = get()
    set({ trucks: generateRegenerationTrucks(completedRounds) })
  },

  resetGame: () => {
    get()._clearAllTimeouts()
    const { mathChallenge } = get()
    if (mathChallenge?.countdownIntervalId) {
      clearInterval(mathChallenge.countdownIntervalId)
    }
    set({
      appleCount: 0,
      eggCount: 0,
      trucks: createInitialTrucks(),
      selectedTruckId: null,
      selectedDeliveryType: null,
      gameStatus: 'playing',
      feedbackMessage: '',
      showFeedback: false,
      feedbackType: null,
      _timeouts: [],
      completedRounds: 0,
      difficulty: 1,
      bonusStars: 0,
      mathChallenge: null,
      pendingPickData: null,
    })
  },

  setFeedback: (message, type) => {
    set({
      feedbackMessage: message,
      showFeedback: true,
      feedbackType: type,
    })
  },

  clearFeedback: () => {
    set({
      feedbackMessage: '',
      showFeedback: false,
      feedbackType: null,
    })
  },

  _addTimeout: (id) => {
    set((state) => ({ _timeouts: [...state._timeouts, id] }))
  },

  _clearAllTimeouts: () => {
    const { _timeouts } = get()
    _timeouts.forEach((t) => clearTimeout(t))
    set({ _timeouts: [] })
  },
}))

export { getDifficultyLevel, getMaxNumber, generateAddition, generateSubtraction }
