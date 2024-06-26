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
    getIsAlreadySubscribed: (state) => !!state.currentUser?.stripe?.subscriptionId || state.currentUser?.roles?.includes('admin'),
  },
  actions: {
    setCurrentUser(user?: User) {
      this.currentUser = {
        ...user,
        picture: user?.picture || "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
      } as User;
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
      this.setCurrentUser(data);
    },
    async fetchUser(userId: string) {
      const { data } = await api.get(`/users/${userId}`)
      return data;
    }
  }
})