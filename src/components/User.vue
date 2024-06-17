<template>
  <slot :user="user" :loading="loading" />
</template>

<script setup>
import { useAuthStore } from '@/modules/auth/auth.store';
import { ref, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const store = useAuthStore();

const loading = ref(false);
const user = ref(undefined);

async function fetchUser() {
  try {
    if (!props.id) return;
    loading.value = true;
    user.value = await store.fetchUser(props.id);
  } catch(err) {
    console.error(err);
  }
  loading.value = false;
}

watch(
  () => props.id,
  () => fetchUser(),
  { immediate: true }
)
</script>