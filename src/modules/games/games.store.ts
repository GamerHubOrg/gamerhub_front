import {defineStore} from 'pinia'
import api from '@/services/api'
import {Config} from './games.types'

type State = {
    isLobbyCollapsed: boolean,
    isGameRulesCollapsed: boolean,
    gameName: string,
    configs: {
        list: Config[],
        hasMore: boolean,
        total: number,
    }
}

export const useGamesStore = defineStore('games', {
    state: () => ({
        isLobbyCollapsed: true,
        isGameRulesCollapsed: true,
        gameName: '',
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
        addConfigs(configs: any) {
            this.configs.total = configs.total;
            this.configs.list = [
                ...this.configs.list,
                ...configs.list
            ]
        },
        async fetchConfigs({filters, sort, offset, limit}: { filters: any, sort: any, limit: number, offset: number, erase?: boolean }) {
            const {data} = await api.get('/configs', {params: {filters, sort, offset, limit}})
            if (offset === 0) {
                this.setConfigs(data);
            } else {
                this.addConfigs(data);
            }
        },
        async publishConfig({game, name, config}) {
            const {data} = await api.post('/configs', {game, name, config});
            this.setConfigs({
                ...this.configs,
                list: [
                    ...this.configs.list,
                    data,
                ],
                total: this.configs.total + 1,
            })
        },
        setIsGameRulesCollapsed(collapsed: boolean, gameName?: string) {
            this.gameName = gameName || '';
            this.isGameRulesCollapsed = collapsed;
        }
    }
})
