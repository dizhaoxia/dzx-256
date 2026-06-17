import { create } from 'zustand'

export interface Truck {
  id: number
  target: number
  matched: boolean
  color: string
}

type DeliveryType = 'apple' | 'egg' | null
type GameStatus = 'playing' | 'celebrating'

function createInitialTrucks(): Truck[] {
  return [
    { id: 1, target: 1, matched: false, color: '#E53935' },
    { id: 2, target: 2, matched: false, color: '#FFC107' },
    { id: 3, target: 3, matched: false, color: '#4CAF50' },
  ]
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

  pickApple: () => void
  pickEgg: () => void
  selectTruck: (truckId: number) => void
  selectDeliveryType: (type: DeliveryType) => void
  deliverToTruck: () => void
  startCelebrating: () => void
  resetGame: () => void
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

  _addTimeout: (id: ReturnType<typeof setTimeout>) => {
    set((state) => ({ _timeouts: [...state._timeouts, id] }))
  },

  _clearAllTimeouts: () => {
    const { _timeouts } = get()
    _timeouts.forEach((t) => clearTimeout(t))
    set({ _timeouts: [] })
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

  selectTruck: (truckId: number) => {
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

  selectDeliveryType: (type: DeliveryType) => {
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
        feedbackMessage: '太棒了！匹配成功！🎉',
        showFeedback: true,
        feedbackType: 'success',
      }

      if (selectedDeliveryType === 'apple') {
        newState.appleCount = 0
      } else {
        newState.eggCount = 0
      }

      set(newState)

      if (allMatched) {
        const t1 = setTimeout(() => get().startCelebrating(), 1500)
        _addTimeout(t1)
      }

      const t2 = setTimeout(() => get().clearFeedback(), 2000)
      _addTimeout(t2)
    } else {
      get().setFeedback(
        `数量不对哦！需要 ${truck.target} 个，当前有 ${count} 个～`,
        'error'
      )
      const t = setTimeout(() => get().clearFeedback(), 2500)
      _addTimeout(t)
    }
  },

  startCelebrating: () => {
    set({ gameStatus: 'celebrating' })
  },

  resetGame: () => {
    get()._clearAllTimeouts()
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
    })
  },

  setFeedback: (message: string, type: 'success' | 'error') => {
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
}))
