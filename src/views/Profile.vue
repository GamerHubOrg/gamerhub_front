<template>
  <div class="profile-container">
    <div class="flex justify-center">
      <div class="profile-pic bg-cover bg-no-repeat"
      :style="{backgroundImage: `url(${user.picture})`}">
      </div>
    </div>

    <form class="space-y-6"  @submit="handleChangeUser">
      <div class="flex justify-center items-center flex-col profile-container">
        <div class="min-w-64">
          <label for="username" class="block text-sm font-medium leading-6 text-white">Username</label>
          <div class="mt-2">
            <input v-model="user.username" id="username" name="username" type="text" autocomplete="username" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div class="min-w-64">
          <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
          <div class="mt-2">
            <input v-model="user.email" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <div class="min-w-64">
          <label for="imageUrl" class="block text-sm font-medium leading-6 text-white">Url de l'image</label>
            <div class="mt-2">
              <input v-model="user.picture" id="imageUrl" name="imageUrl" type="url" class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
            </div>
        </div>
        
      </div>

      <div class="flex justify-center">
        <button type="submit" :disabled="asChange" class="flex justify-center rounded-md bg-indigo-500 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
      </div>
    </form>

    <div class="flex justify-center mt-4"> 
      <button @click="showModal = true" class="flex justify-center rounded-md bg-indigo-500 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Change password</button>
    </div>


    <Modal :open="showModal" @close="showModal = false">
      <form  @submit="handleChangePassword">

        <div class="min-w-64">
          <label for="oldPassword" class="block text-sm font-medium leading-6 text-white">Old password</label>
          <div class="mt-2">
            <input v-model="passwords.oldPassword" id="oldPassword" name="oldPassword" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div class="min-w-64">
          <label for="newwPassword" class="block text-sm font-medium leading-6 text-white"> New password</label>
          <div class="mt-2">
            <input v-model="passwords.newPassword" id="newwPassword" name="newwPassword" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div class="min-w-64">
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-white">Confirm password</label>
          <div class="mt-2">
            <input v-model="passwords.newPasswordConfirm" id="confirmPassword" name="confirmPassword" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <button type="submit" class="flex justify-center rounded-md bg-indigo-500 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
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


const authStore = useAuthStore();
const currentUser = computed(() =>
  authStore.getCurrentUser
)

const showModal = ref(false);

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

const handleChangeUser = async (e: Event) => {
  try{
    e.preventDefault();
    await authStore.updateUser(user.value);
    toast('Modifications enregistrées', {
      autoClose: 3000,
      type:'success',
      theme: 'dark'
  });
  }catch(err) {
    console.error(err);
    toast('Erreur lors de l\'enregistrement', {
      autoClose: 3000,
      type:'error',
      theme: 'dark'
  });
  }
}

const handleChangePassword = async (e: Event) => {
  try{
    e.preventDefault();
    await authStore.updateUserPassword(passwords.value);
    passwords.value.oldPassword = '';
    passwords.value.newPassword = '';
    passwords.value.newPasswordConfirm = '';
    showModal.value = false;
    toast('Le mot de passe a bien été changé', {
      autoClose: 3000,
      type:'success',
      theme: 'dark'
  });
  }catch(err) {
    console.error(err);
    toast('Erreur lors de la modification', {
      autoClose: 3000,
      type:'error',
      theme: 'dark'
  });
  }
}

const asChange = computed(() => {
  let isDifferent = false
  if(user.value.picture !== currentUser.value?.picture){
    isDifferent = true;
  }
  if(user.value.username !== currentUser.value?.username){
    isDifferent = true;
  }
  if(user.value.email !== currentUser.value?.email){
    isDifferent = true;
  }
  return isDifferent
})

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