import { defineStore } from 'pinia'
import api from '@/services/api'

interface Config {

}

type State = {
  isLobbyCollapsed: boolean,
  configs: Config[]
}

export const useGamesStore = defineStore('games', {
  state: () => ({
    isLobbyCollapsed: true,
    configs: [],
  }) as State,
  getters: {
    getIsLobbyCollapsed: (state) => state.isLobbyCollapsed,
    getConfigs: (state) => state.configs,
  },
  actions: {
    setIsLobbyCollapsed(collapsed: boolean) {
      this.isLobbyCollapsed = collapsed;
    },
    setConfigs(configs: Config[]) {
      this.configs = configs;
    },
    async fetchConfigs({ filters, sort }): Promise<Config[]> {
      const { data } = await api.get('/configs', { params: { filters, sort } })

      return data;
    }
  }
})