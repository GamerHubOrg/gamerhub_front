import { defineStore } from "pinia";
import { User } from "../auth/user";
import api from "@/services/api";

interface IUsersList {
  list: User[];
  total?: number;
}

type State = {
  users: IUsersList;
  dashboardStats: any;
};

export const useAdminStore = defineStore("admin", {
  state: () =>
    ({
      users: { list: [], total: undefined },
      dashboardStats: {},
    } as State),
  getters: {
    getUsers: (state) => state.users,
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
    }
  },
});
