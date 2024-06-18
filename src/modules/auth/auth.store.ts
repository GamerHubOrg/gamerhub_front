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
  }) as State,
  getters: {
    getCurrentUser: (state) => state.currentUser,
  },
  actions: {
    setCurrentUser(user?: User) {
      this.currentUser = user;
    },
    async logout() {
      await api.post('users/logout')
      localStorage.removeItem('gamerhub_token')
      this.setCurrentUser(undefined);
    },
    async login({ email, password }: any) {
      await api.post('/users/login', { email, password })
    },
    async register({ username, email, password, confirmPassword }: any) {
      await api.post('/users/register', { username, email, password, confirmPassword })
    },
    async getMe() {
      const { data } = await api.get('/users/me')
      this.setCurrentUser({
        ...data,
        picture: data.picture || "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
      });
    },
    async fetchUser(userId: string) {
      const { data } = await api.get(`/users/${userId}`)
      return data;
    }
  }
})