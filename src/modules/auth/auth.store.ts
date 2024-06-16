import { defineStore } from 'pinia'
import { User } from './user';
import api from '@/services/api'

type State = {
  currentUser?: User,
  authToken?: string,
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: undefined,
    authToken: undefined,
  }) as State,
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getAuthToken: (state) => state.authToken,
  },
  actions: {
    setCurrentUser(user?: User) {
      this.currentUser = user;
    },
    setAuthToken(token?: string) {
      this.authToken = token;
    },
    async getUserInfo(userId?: string) {
      const { data } = await api.get(`/users/${userId}`)

      return data;
    }
  }
})