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
                Type
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Email
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Ip
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Message
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-dark3">
            <tr v-for="banishment in banishments.list" :key="banishment._id">
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ new Date(banishment.createdAt).toLocaleDateString() }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 font-normal">
                <span class="bg-primary bg-opacity-30 border border-primary rounded px-1 text-primary">{{ banishment.type }}</span>
              </td>
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-300">
                {{ banishment.email }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ banishment.ip }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                {{ banishment.message }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-500 font-normal">
                <div class="flex flex-row items-center gap-2">
                  <button 
                    class="bg-red-400 text-white px-2 py-1 text-sm rounded hover:bg-red-500"
                    :disabled="loading"
                    @click="() => handleUnbanUser(banishment._id)"
                    >
                    Débannir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded-b-lg border-t border-dark3 px-4 py-2">
        <button
          v-if="banishments.total !== banishments.list.length"
          class="items-center justify-center rounded border border-dark3 bg-dark2 bg-opacity-20 text-white disabled:cursor-not-allowed px-2"
          @click="handleFetchBanishments"
        >
          <span class="text-xs">Load more</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAdminStore } from '@/modules/admin/admin.store';
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const adminStore = useAdminStore();
const banishments = computed(() => adminStore.getBanishments);

const loading = ref(false);

async function handleFetchBanishments() {
  try {
      loading.value = true;
      const offset = banishments.value.list.length || 0;
      await adminStore.fetchBanishments({ offset, limit: 20 });
  } catch(err) {
    toast('Impossible de récuperer les banissements', { type: 'error', autoClose: 3000 });
  }
  loading.value = false;
}

async function handleUnbanUser(banishmentId: string) {
  try {
    loading.value = true;
    await adminStore.deleteUnbanUser(banishmentId);
    toast('Utilisateur débanni avec succès', { type: 'success', autoClose: 3000 });
  } catch(err) {
    toast('Impossible de débannir cet utilisateur', { type: 'error', autoClose: 3000 });
  }
  loading.value = false;
}

onMounted(async () => {
    await handleFetchBanishments();
})
</script>