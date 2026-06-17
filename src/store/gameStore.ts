import { create } from 'zustand'

export interface Truck {
  id: number
  target: number
  matched: boolean
  color: string
}

type DeliveryType = 'apple' | 'egg' | null
type GameStatus = 'playing' | 'celebrating'

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

  pickApple: () => void
  pickEgg: () => void
  selectTruck: (truckId: number) => void
  selectDeliveryType: (type: DeliveryType) => void
  deliverToTruck: () => void
  startCelebrating: () => void
  resetGame: () => void
  setFeedback: (message: string, type: 'success' | 'error') => void
  clearFeedback: () => void
}

const initialTrucks: Truck[] = [
  { id: 1, target: 1, matched: false, color: '#E53935' },
  { id: 2, target: 2, matched: false, color: '#FFC107' },
  { id: 3, target: 3, matched: false, color: '#4CAF50' },
]

export const useGameStore = create<GameState>((set, get) => ({
  appleCount: 0,
  eggCount: 0,
  maxApples: 8,
  maxEggs: 8,
  trucks: JSON.parse(JSON.stringify(initialTrucks)),
  selectedTruckId: null,
  selectedDeliveryType: null,
  gameStatus: 'playing',
  feedbackMessage: '',
  showFeedback: false,
  feedbackType: null,

  pickApple: () => {
    const { appleCount, maxApples } = get()
    if (appleCount < maxApples) {
      set({ appleCount: appleCount + 1 })
    }
  },

  pickEgg: () => {
    const { eggCount, maxEggs } = get()
    if (eggCount < maxEggs) {
      set({ eggCount: eggCount + 1 })
    }
  },

  selectTruck: (truckId: number) => {
    const { trucks } = get()
    const truck = trucks.find(t => t.id === truckId)
    if (truck && !truck.matched) {
      set({ selectedTruckId: truckId })
    }
  },

  selectDeliveryType: (type: DeliveryType) => {
    set({ selectedDeliveryType: type })
  },

  deliverToTruck: () => {
    const { selectedTruckId, selectedDeliveryType, appleCount, eggCount, trucks } = get()
    
    if (selectedTruckId === null || selectedDeliveryType === null) {
      set({
        feedbackMessage: '请先选择要运送的物品和货车！',
        showFeedback: true,
        feedbackType: 'error',
      })
      setTimeout(() => get().clearFeedback(), 2000)
      return
    }

    const truck = trucks.find(t => t.id === selectedTruckId)
    if (!truck) return

    const count = selectedDeliveryType === 'apple' ? appleCount : eggCount

    if (count === 0) {
      set({
        feedbackMessage: selectedDeliveryType === 'apple' ? '还没有采摘苹果哦！' : '还没有采摘鸡蛋哦！',
        showFeedback: true,
        feedbackType: 'error',
      })
      setTimeout(() => get().clearFeedback(), 2000)
      return
    }

    if (count === truck.target) {
      const newTrucks = trucks.map(t =>
        t.id === truck.id ? { ...t, matched: true } : t
      )
      const allMatched = newTrucks.every(t => t.matched)
      
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
        setTimeout(() => get().startCelebrating(), 1500)
      }

      setTimeout(() => get().clearFeedback(), 2000)
    } else {
      set({
        feedbackMessage: `数量不对哦！需要 ${truck.target} 个，当前有 ${count} 个～`,
        showFeedback: true,
        feedbackType: 'error',
      })
      setTimeout(() => get().clearFeedback(), 2500)
    }
  },

  startCelebrating: () => {
    set({ gameStatus: 'celebrating' })
  },

  resetGame: () => {
    set({
      appleCount: 0,
      eggCount: 0,
      trucks: JSON.parse(JSON.stringify(initialTrucks)),
      selectedTruckId: null,
      selectedDeliveryType: null,
      gameStatus: 'playing',
      feedbackMessage: '',
      showFeedback: false,
      feedbackType: null,
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
