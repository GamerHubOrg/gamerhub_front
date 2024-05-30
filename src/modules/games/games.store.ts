import { defineStore } from 'pinia'

type State = {
  isLobbyCollapsed: boolean,
}

export const useGamesStore = defineStore('games', {
  state: () => ({
    isLobbyCollapsed: true,
  }) as State,
  getters: {
    getIsLobbyCollapsed: (state) => state.isLobbyCollapsed,
  },
  actions: {
    setIsLobbyCollapsed(collapsed: boolean) {
      this.isLobbyCollapsed = collapsed;
    }
  }
})