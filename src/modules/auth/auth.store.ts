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
      localStorage.setItem('gamerhub_token', token)
      this.authToken = token;
    },
    async logout() {
      await api.post('users/logout')
    },
    async login({ email, password }) {
      const { data } = await api.post('/users/login', { email, password })
      this.setAuthToken(data);
    },
    async register({ username, email, password, confirmPassword }) {
      const { data } = await api.post('/users/register', { username, email, password, confirmPassword })
      this.setAuthToken(data);
    },
    async getMe() {
      const { data } = await api.get('/users/me')
      this.setCurrentUser(data);
    }
  }
})