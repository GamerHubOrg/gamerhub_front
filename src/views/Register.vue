<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <Navbar />
    <div class="sm:mx-auto sm:w-full sm:max-w-sm mt-16 sm:mt-8">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Create an account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div v-if="error" class="text-center bg-red-500 bg-opacity-15 border border-red-800 text-red-800 rounded-md p-3 text-sm mb-4">
        {{ error }}
      </div>

      <form class="space-y-6" @submit="handleRegister">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-white">Username</label>
          <div class="mt-2">
            <input v-model="form.username" id="username" name="username" type="text" autocomplete="username" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
          <div class="mt-2">
            <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
          <div class="mt-2">
            <input v-model="form.password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-white">Confirm password</label>
          <div class="mt-2">
            <input v-model="form.confirmPassword" id="confirmPassword" name="confirmPassword" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign up</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-400">
        Already have an account?
        {{ ' ' }}
        <router-link to="/login" class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">Sign in here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/modules/auth/auth.store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';

const store = useAuthStore();
const router = useRouter();

const form = ref({
  username: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
})

const error = ref(undefined);

async function handleRegister(e) {
  e.preventDefault();

  try {
    await store.register(form.value)
    router.push('/');
  } catch(err) {
    error.value = err.response.data
  }
}
</script>