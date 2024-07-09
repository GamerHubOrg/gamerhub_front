<template>
  <Tabs :tabs="tabs" :selected="selectedTab" @change="(val) => selectedTab = val" />

  <ProfileHistory v-if="selectedTab === 'history'" />

  <div v-else-if="selectedTab === 'profile'" class="profile-container">
    <div class="flex justify-center">
      <div class="profile-pic bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${user.picture})` }">
      </div>
    </div>

    <form class="space-y-6" @submit="handleChangeUser">
      <div class="flex justify-center items-center flex-col profile-container">
        <div class="min-w-64">
          <label for="username" class="block text-sm font-medium leading-6 text-white">Username</label>
          <div class="mt-2">
            <input v-model="user.username" id="username" name="username" type="text" autocomplete="username" required
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div class="min-w-64">
          <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
          <div class="mt-2">
            <input v-model="user.email" id="email" name="email" type="email" autocomplete="email" required
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <div class="min-w-64">
          <label for="imageUrl" class="block text-sm font-medium leading-6 text-white">Url de l'image</label>
          <div class="mt-2">
            <input v-model="user.picture" id="imageUrl" name="imageUrl" type="url"
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <Button type="submit" color="primary">Save</button>
      </div>
    </form>

    <div class="flex justify-center mt-4">
      <Button @click="showModalUpdatePassword = true" color="primary">Change password</Button>
    </div>

    <div class="flex justify-center mt-4">
      <Button @click="showModalDeleteUser = true" color="danger">Delete account</Button>
    </div>


    <Modal :open="showModalUpdatePassword" @close="showModalUpdatePassword = false">
      <form @submit="handleChangePassword">
        <div class="min-w-64">
          <label for="oldPassword" class="block text-sm font-medium leading-6 text-white">Old password</label>
          <div class="mt-2">
            <input v-model="passwords.oldPassword" id="oldPassword" name="oldPassword" type="password"
              autocomplete="current-password" required
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div class="min-w-64">
          <label for="newwPassword" class="block text-sm font-medium leading-6 text-white"> New password</label>
          <div class="mt-2">
            <input v-model="passwords.newPassword" id="newwPassword" name="newwPassword" type="password"
              autocomplete="current-password" required
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div class="min-w-64">
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-white">Confirm password</label>
          <div class="mt-2">
            <input v-model="passwords.newPasswordConfirm" id="confirmPassword" name="confirmPassword" type="password"
              autocomplete="current-password" required
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <Button type="submit" color="primary">Save</button>
        </div>
      </form>

    </Modal>

    <Modal :open="showModalDeleteUser" @close="showModalDeleteUser = false">
      <form @submit="handleDeleteUser">
        <h3 class="mb-3">Are you sure you want to delete your account ?</h3>
        <div class="min-w-64">
          <label for="oldPassword" class="block text-sm font-medium leading-6 text-white">password</label>
          <div class="mt-2">
            <input v-model="deletePasswordData" id="oldPassword" name="oldPassword" type="password"
              autocomplete="current-password" required
              class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <Button type="submit" color="danger">Delete my account</Button>
        </div>
      </form>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { User } from '@/modules/auth/user';
import { useAuthStore } from '@/modules/auth/auth.store';
import { toast } from 'vue3-toastify';
import Modal from '../components/Modal.vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue';
import Tabs from '@/components/Tabs.vue';
import ProfileHistory from '@/components/profile/history/ProfileHistory.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const currentUser = computed(() =>
  authStore.getCurrentUser
)

const showModalUpdatePassword = ref(false);
const showModalDeleteUser = ref(false);
const deletePasswordData = ref("");

const user = computed<Partial<User>>(() => ({
  picture: currentUser.value?.picture,
  username: currentUser.value?.username,
  email: currentUser.value?.email
}));

const passwords = computed<any>(() => ({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
}));

const tabs = ref([
  { name: "Profil", value: "profile" },
  { name: "Historique", value: "history" }
])
const selectedTab = ref<string>("profile");


const handleChangeUser = async (e: Event) => {
  try {
    e.preventDefault();
    await authStore.updateUser(user.value);
    toast('Modifications enregistrées', {
      autoClose: 3000,
      type: 'success',
      theme: 'dark'
    });
  } catch (err) {
    console.error(err);
    toast('Erreur lors de l\'enregistrement', {
      autoClose: 3000,
      type: 'error',
      theme: 'dark'
    });
  }
}

const handleChangePassword = async (e: Event) => {
  try {
    e.preventDefault();
    await authStore.updateUserPassword(passwords.value);
    passwords.value.oldPassword = '';
    passwords.value.newPassword = '';
    passwords.value.newPasswordConfirm = '';
    showModalUpdatePassword.value = false;
    toast('Le mot de passe a bien été changé', {
      autoClose: 3000,
      type: 'success',
      theme: 'dark'
    });
  } catch (err) {
    console.error(err);
    toast('Erreur lors de la modification', {
      autoClose: 3000,
      type: 'error',
      theme: 'dark'
    });
  }
}

const handleDeleteUser = async (e: Event) => {
  try {
    e.preventDefault();
    await authStore.deleteUser({ "password": deletePasswordData.value });
    showModalDeleteUser.value = false;
    toast('L\'utilisateur à bien été supprimé', {
      autoClose: 3000,
      type: 'success',
      theme: 'dark'
    });
    router.replace('login');
  } catch (err) {
    console.error(err);
    toast('Erreur lors de la supression', {
      type: 'error',
      theme: 'dark'
    });
  }
}
</script>

<style>
.profile-container {
  text-align: center;
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 20px;
}
</style>