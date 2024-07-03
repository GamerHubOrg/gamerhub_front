import { defineStore } from "pinia";
import { User } from "./user";
import api from "@/services/api";
import { GameRecord } from "./gameRecords";

type State = {
  currentUser?: User;
  gameRecords?: GameRecord[];
  totalRecords?: number;
};

export const useAuthStore = defineStore("auth", {
  state: () =>
    ({
      currentUser: undefined,
      gameRecords: undefined,
      totalRecords: undefined,
    } as State),
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getIsAlreadySubscribed: (state) =>
      !!state.currentUser?.stripe?.subscriptionId ||
      state.currentUser?.roles?.includes("admin"),
    getGameRecords: (state) => state.gameRecords,
    getTotalRecords: (state) => state.totalRecords,
  },
  actions: {
    setCurrentUser(user?: User) {
      if (!user) {
        this.currentUser = user;
        return;
      }

      this.currentUser = {
        ...user,
        picture:
          user?.picture ||
          "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
      } as User;
    },
    async logout() {
      await api.post("users/logout");
      localStorage.removeItem("gamerhub_token");
      this.setCurrentUser(undefined);
    },
    async login({ email, password }: any) {
      await api.post("/users/login", { email, password });
    },
    async register({ username, email, password, confirmPassword }: any) {
      await api.post("/users/register", {
        username,
        email,
        password,
        confirmPassword,
      });
    },
    async getMe() {
      const { data } = await api.get("/users/me");
      this.setCurrentUser(data);
    },
    async fetchUser(userId: string) {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    async updateUser({username, email, picture}: any) {
      await api.put(`/users/${this.currentUser?._id}`, {username, email, picture})
    }, 
    async updateUserPassword({oldPassword, newPassword, newPasswordConfirm } : any) {
      await api.put(`/users/password/${this.currentUser?._id}`, {oldPassword, newPassword, newPasswordConfirm } )
    },
    async deleteUser({password} : any) {
      await api.post(`/users/delete/${this.currentUser?._id}`, {password} ).then(()=>{
        this.currentUser = undefined;
        this.authToken = undefined;
      })

    }
    async fetchGameRecords(offset: number, limit: number) {
      if(this.totalRecords && this.totalRecords === this.gameRecords?.length) return;
      await api
        .get(`/gameRecords/user/${this.currentUser?._id}`, {
          params: {
            offset,
            limit,
          },
        })
        .then((res) => {
          const { records, totalRecords } = res.data;
          this.totalRecords = totalRecords;
          this.gameRecords = [...(this.gameRecords || []), ...records];
        });
    },
  },
});