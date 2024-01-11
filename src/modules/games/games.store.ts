import { defineStore } from 'pinia'
import { Game } from './game';
import api from '../../services/api';

type State = {
  games: Game[],
}

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: [],
  }) as State,
  getters: {
    getGames: (state) => state.games,
  },
  actions: {
    setGames(games: Game[]) {
      this.games = games;
    },
    async fetchGames() {
      const { data } = await api.get('/games');
      this.setGames(data);
    }
  }
})