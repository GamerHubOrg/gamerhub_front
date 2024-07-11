import { defineStore } from "pinia";
import { User } from "../auth/user";
import api from "@/services/api";
import { IBanishment } from "./admin.types";

interface IUsersList {
  list: User[];
  total?: number;
}

interface IBanishmentsList {
  list: IBanishment[];
  total?: number;
}

type State = {
  users: IUsersList;
  banishments: IBanishmentsList;
  dashboardStats: any;
};

export const useAdminStore = defineStore("admin", {
  state: () =>
    ({
      banishments: { list: [], total: undefined },
      users: { list: [], total: undefined },
      dashboardStats: {},
    } as State),
  getters: {
    getUsers: (state) => state.users,
    getBanishments: (state) => state.banishments,
    getDashboardStats: (state) => state.dashboardStats,
  },
  actions: {
    setUsers(users: IUsersList) {
      this.users = users;
    },
    addUsers(users: IUsersList) {
      this.users.total = users.total;
      this.users.list = [
        ...this.users.list,
        ...users.list
      ]
    },
    setBanishments(banishments: IBanishmentsList) {
      this.banishments = banishments;
    },
    addBanishments(banishments: IBanishmentsList) {
      this.banishments.total = banishments.total;
      this.banishments.list = [
        ...this.banishments.list,
        ...banishments.list
      ]
    },
    async fetchUsers({ offset, limit }: { offset?: number, limit?: number }) {
      if (this.users.total && this.users.total === this.users.list?.length) return;

      const { data } = await api.get("/admin/users", {
        params: {
          offset,
          limit,
        },
      });
      this.addUsers(data);
    },
    async fetchBanishments({ offset, limit }: { offset?: number, limit?: number }) {
      if (this.banishments.total && this.banishments.total === this.banishments.list?.length) return;

      const { data } = await api.get("/admin/banishments", {
        params: {
          offset,
          limit,
        },
      });
      this.addBanishments(data);
    },
    async updateUser({ _id: userId, email, username, picture, roles, subscribedAt }: Partial<User>) {
        const { data: updatedUser } = await api.patch(`/admin/users/${userId}`, { email, username, picture, roles, subscribedAt });

        const userIndex = this.users.list.findIndex((u) => u._id === updatedUser._id);
        if (userIndex !== -1) {
            this.users.list[userIndex] = updatedUser;
        }
    },
    async fetchDashboardStats() {
        const { data } = await api.get('/admin/stats/dashboard');
        this.dashboardStats = data;
    },
    async putBanUser(userId: string, message: string) {
      await api.put(`/admin/users/${userId}/ban`, { message });
      this.users.list = this.users.list.filter((user) => user._id !== userId);
    },
    async deleteUnbanUser(banishmentId: string) {
      await api.delete(`/admin/banishments/${banishmentId}`);
      this.banishments.list = this.banishments.list.filter((banishment) => banishment._id !== banishmentId);
    }
  },
});
