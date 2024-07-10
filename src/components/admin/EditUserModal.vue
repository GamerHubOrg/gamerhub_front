<template>
  <Modal :open="open" @close="$emit('close')">
    <h6 class="font-medium mb-4">Edit {{ user._id }}</h6>
    <form @submit="handleEditUser" class="flex flex-col gap-4">
      <div>
        <label for="username" class="block text-xs font-medium text-gray-200">
          Username
        </label>

        <input
          v-model="userForm.username"
          type="text"
          id="username"
          placeholder="johndoe"
          class="mt-1 w-full rounded-md shadow-sm sm:text-sm border-dark5 bg-dark2 text-white"
        />
      </div>

      <div>
        <label for="email" class="block text-xs font-medium text-gray-200">
          Email
        </label>

        <input
          v-model="userForm.email"
          type="email"
          id="email"
          placeholder="john@doe.com"
          class="mt-1 w-full rounded-md shadow-sm sm:text-sm border-dark5 bg-dark2 text-white"
        />
      </div>

      <UserRolesSelect v-model="userForm.roles" :options="rolesOptions" />

      <div>
        <label for="subscribedAt" class="block text-xs font-medium text-gray-200">
          Subscribed At
        </label>

        <input
          v-model="userForm.subscribedAt"
          type="date"
          id="subscribedAt"
          class="mt-1 w-full rounded-md shadow-sm sm:text-sm border-dark5 bg-dark2 text-white"
        />
      </div>

      <div>
        <label for="picture" class="block text-xs font-medium text-gray-200">
          Picture
        </label>

        <input
          v-model="userForm.picture"
          type="text"
          id="picture"
          class="mt-1 w-full rounded-md shadow-sm sm:text-sm border-dark5 bg-dark2 text-white"
        />
      </div>

      <button 
        class="w-full bg-primary text-white rounded py-1 mt-4 text-sm disabled:bg-opacity-65" 
        :disabled="loading" 
        @click="handleEditUser">Update user</button>
    </form>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import UserRolesSelect from '@/components/admin/UserRolesSelect.vue';
import { useAdminStore } from "@/modules/admin/admin.store";
import { User } from "@/modules/auth/user";
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";

const emit = defineEmits(["close"]);
const props = defineProps<{
  open: boolean;
  user: User;
}>();


const adminStore = useAdminStore();
const userForm = ref();
const loading = ref(false);

const rolesOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
]

async function handleEditUser() {
  try {
    loading.value = true;
    await adminStore.updateUser(userForm.value);
    toast('Utilisateur is à jour', { type: 'success', autoClose: 3000 })
    emit('close');
  } catch(err) {
    toast('Impossible de mettre à jour cet utilisateur', { type: 'error', autoClose: 3000 })
  }
  loading.value = false;
}

watch(
  () => props.open,
  () => {
    if (props.open) {
      userForm.value = {
        ...props.user,
      }
    }
  }
)
</script>