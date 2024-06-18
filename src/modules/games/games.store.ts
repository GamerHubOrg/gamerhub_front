import { defineStore } from 'pinia'
import api from '@/services/api'
import { Config } from './games.types'

type State = {
  isLobbyCollapsed: boolean,
  configs: {
    list: Config[],
    hasMore: boolean,
    total: number,
  }
}

export const useGamesStore = defineStore('games', {
  state: () => ({
    isLobbyCollapsed: true,
    configs: {
      list: [],
      hasMore: true,
      total: 0,
    },
  }) as State,
  getters: {
    getIsLobbyCollapsed: (state) => state.isLobbyCollapsed,
    getConfigs: (state) => state.configs,
  },
  actions: {
    setIsLobbyCollapsed(collapsed: boolean) {
      this.isLobbyCollapsed = collapsed;
    },
    setConfigs(configsData: any) {
      this.configs = configsData;
    },
    async fetchConfigs({ filters, sort, skip, limit }) {
      const { data } = await api.get('/configs', { params: { filters, sort, skip, limit } })
      this.setConfigs(data);
    },
    async publishConfig({ game, name, config }) {
      const { data } = await api.post('/configs', { game, name, config });
      this.setConfigs({
        ...this.configs,
        list: [
          ...this.configs.list,
          data,
        ],
        hasMore: true,
        total: this.configs.total + 1,
      })
    }
  }
})