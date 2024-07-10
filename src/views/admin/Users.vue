<template>
  <div class="mt-10 flex flex-col gap-5">
    <div class="rounded-lg border border-dark3 shadow-2xl">
      <div class="overflow-x-auto rounded-t-lg">
        <table
          class="min-w-full divide-y-2 divide-dark3 bg-dark2 bg-opacity-20 text-sm"
        >
          <thead class="text-left">
            <tr>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Created
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Username
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Email
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Roles
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Subscribed
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Picture
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Updated
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Customer Id
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Subscription Id
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-dark3">
            <tr v-for="user in users.list" :key="user._id">
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-300 cursor-pointer underline" @click="() => handleOpenEditModal(user)">
                {{ user.username }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ user.email }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                <div class="flex flex-row gap-1 justify-center items-center">
                    <span 
                        v-for="role in user.roles" 
                        :key="role" 
                        class="bg-black bg-opacity-40 border border-black px-2 py-1 rounded-md leading-none text-xs font-light"
                    >
                        {{ role }}
                    </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                <span v-if="user.subscribedAt">{{ new Date(user.subscribedAt).toLocaleDateString() }}</span>
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal max-w-80 overflow-hidden">
                <span class="truncate">{{ user.picture }}</span>
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ new Date(user.updatedAt).toLocaleDateString() }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ user.stripe?.customerId }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ user.stripe?.subscriptionId }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                <div class="flex flex-row items-center gap-2">
                  <button 
                    v-if="!user.bannedAt"
                    class="bg-red-400 text-white px-2 py-1 text-sm rounded hover:bg-red-500"
                    :disabled="loading"
                    @click="() => handleBanUser(user._id)"
                    >
                    Bannir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded-b-lg border-t border-dark3 px-4 py-2">
        <button
          v-if="users.total !== users.list.length"
          class="items-center justify-center rounded border border-dark3 bg-dark2 bg-opacity-20 text-white disabled:cursor-not-allowed px-2"
          @click="handleFetchUsers"
        >
          <span class="text-xs">Load more</span>
        </button>
      </div>
    </div>

    <EditUserModal 
        :open="editUserModalOpen" 
        :user="selectedUser" 
        @close="editUserModalOpen = false" 
    />
  </div>
</template>

<script lang="ts" setup>
import { useAdminStore } from '@/modules/admin/admin.store';
import { User } from '@/modules/auth/user';
import EditUserModal from '@/components/admin/EditUserModal.vue';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/modules/auth/auth.store';
import { toast } from 'vue3-toastify';

const store = useAuthStore();
const adminStore = useAdminStore();
const users = computed(() => adminStore.getUsers);
const currentUser = computed(() => store.getCurrentUser);

const editUserModalOpen = ref(false);
const selectedUser = ref();
const loading = ref(false);

async function handleFetchUsers() {
    try {
        loading.value = true;
        const offset = users.value.list.length || 0;
        await adminStore.fetchUsers({ offset, limit: 20 });
    } catch(err) {
        console.log(err);
    }
    loading.value = false;
}

function handleOpenEditModal(user: User) {
    selectedUser.value = user;
    editUserModalOpen.value = true;
}

const handleBanUser = async (id: string) => {
  await adminStore.putBanUser(id, `Banned by ${currentUser.value?.username}`);
  toast('Utilisateur bannis avec succes', { type: 'success', autoClose: 3000 });
};

onMounted(async () => {
    await handleFetchUsers();
})
</script>