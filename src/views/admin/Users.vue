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
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ user.picture }}
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
                Actions
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded-b-lg border-t border-dark3 px-4 py-2">
        <ol class="flex justify-end gap-1 text-xs font-medium">
          <li>
            <a
              href="#"
              class="inline-flex size-8 items-center justify-center rounded border border-dark3 bg-dark2 bg-opacity-20 text-white"
            >
              <span class="sr-only">Prev Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>

          <li>
            <a
              href="#"
              class="inline-flex size-8 items-center justify-center rounded border border-dark3 bg-dark2 bg-opacity-20 text-white"
            >
              <span class="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ol>
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

const adminStore = useAdminStore();
const users = computed(() => adminStore.getUsers);

const editUserModalOpen = ref(false);
const selectedUser = ref();

async function handleFetchUsers() {
    try {
        const offset = users.value.total || 0;
        await adminStore.fetchUsers({ offset });
    } catch(err) {
        console.log(err);
    }
}

function handleOpenEditModal(user: User) {
    selectedUser.value = user;
    editUserModalOpen.value = true;
}

onMounted(async () => {
    await handleFetchUsers();
})
</script>