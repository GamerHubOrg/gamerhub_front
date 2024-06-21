<template>
  <div class="profile-container">
    <div class="flex justify-center">
      <div class="profile-pic bg-cover bg-no-repeat"
      :style="{backgroundImage: `url(${user.picture})`}">
      </div>
    </div>

    <form class="space-y-6">
      <div class="flex justify-center gap-4">
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
        <!-- <div class="min-w-64">
          <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
          <div class="mt-2">
            <input v-model="form.password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div class="min-w-64">
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-white">Confirm password</label>
          <div class="mt-2">
            <input v-model="form.confirmPassword" id="confirmPassword" name="confirmPassword" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div> -->
      </div>

      <div class="flex justify-center">
        <button type="submit" class="flex justify-center rounded-md bg-indigo-500 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
      </div>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User } from '@/modules/auth/user';

const user = ref<Partial<User>>({
  picture: 'https://wallpapers-clan.com/wp-content/uploads/2024/02/one-piece-roronoa-zoro-with-sword-turquoise-desktop-wallpaper-preview.jpg',
  username: 'JohnDoe',
  email: 'johndoe@example.com'
});

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