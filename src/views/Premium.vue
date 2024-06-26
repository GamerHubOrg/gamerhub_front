<template>
  <div>
    <div>
      <h2 class="text-3xl font-bold tracki text-center mt-12 sm:text-5xl">
        Pricing
      </h2>
      <p class="max-w-3xl mx-auto mt-4 text-xl text-center">
        Get started on our free plan and upgrade when you are ready.
      </p>
    </div>
    <div
      class="mt-24 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8"
    >
      <div
        class="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col"
      >
        <div class="flex-1">
          <h3 class="text-xl font-semibold">Free</h3>
          <p class="mt-4 flex items-baseline">
            <span class="text-5xl font-extrabold tracking-tight">0€</span
            ><span class="ml-1 text-xl font-semibold">/month</span>
          </p>
          <p class="mt-6">You just want to discover</p>
          <ul role="list" class="mt-6 space-y-6">
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Access published games</span
              >
            </li>
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Play default gamemodes</span
              >
            </li>
            <li class="flex">
              <XMarkIcon class="flex-shrink-0 w-6 h-6 text-red-400" /><span
                class="ml-3"
                >Extensive customization of game settings</span
              >
            </li>
            <li class="flex">
              <XMarkIcon class="flex-shrink-0 w-6 h-6 text-red-400" /><span
                class="ml-3"
                >Beta access to new games</span
              >
            </li>
            <li class="flex">
              <XMarkIcon class="flex-shrink-0 w-6 h-6 text-red-400" /><span
                class="ml-3"
                >Publish configs to community</span
              >
            </li>
          </ul>
        </div>
        <button
          class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium cursor-not-allowed"
        >
          Default plan
        </button>
      </div>
      <div
        class="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col"
      >
        <div class="flex-1">
          <h3 class="text-xl font-semibold">Premium</h3>
          <p
            class="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide transform -translate-y-1/2"
          >
            Most popular
          </p>
          <p class="mt-4 flex items-baseline">
            <span class="text-5xl font-extrabold tracking-tight">99€</span
            ><span class="ml-1 text-xl font-semibold">/month</span>
          </p>
          <p class="mt-6">You want to have the full experience</p>
          <ul role="list" class="mt-6 space-y-6">
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Access published games</span
              >
            </li>
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Play default gamemodes</span
              >
            </li>
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Extensive customization of game settings</span
              >
            </li>
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Beta access to new games</span
              >
            </li>
            <li class="flex">
              <CheckIcon class="flex-shrink-0 w-6 h-6 text-primary" /><span
                class="ml-3"
                >Publish configs to community</span
              >
            </li>
          </ul>
        </div>
        <button
          class="bg-emerald-500 text-white hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="isAlreadySubscribed"
          @click="handleStartSubscription"
        >
          {{ !isAlreadySubscribed ? 'Choose this plan' : 'Already subscribed' }}
        </button>
      </div>
    </div>
  </div>
  <!-- <div v-if="currentUser">
    <button 
      v-if="!isAlreadySubscribed" 
      @click="handleStartSubscription"
    >
      subscribe
    </button>
    <button v-else disabled>already subscribed</button>
  </div>
  <span v-else>need to be connected</span> -->
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/modules/auth/auth.store";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { createCheckoutSession } from "../services/stripe";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const store = useAuthStore();
const router = useRouter();

const currentUser = computed(() => store.getCurrentUser);
const isAlreadySubscribed = computed(() => store.getIsAlreadySubscribed);

async function handleStartSubscription() {
  try {
    if (!currentUser.value) {
      router.push("/login");
      return;
    }

    const session = await createCheckoutSession(
      currentUser.value.stripe.customerId as string
    );

    window.location.replace(session.url as string);
  } catch (err) {
    router.push("/login");
  }
}
</script>