import { defineStore } from 'pinia'
import { User } from './user';

type State = {
  currentUser?: User
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: undefined
  }) as State,
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user;
    }
  }
})