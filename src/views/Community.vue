<template>
  <div class="mt-10 flex flex-col gap-6 px-8">
    <h3 class="text-3xl font-bold">Configurations de la communauté</h3>

    <div class="flex flex-row items-center gap-2">
      <select :disabled="loading" class="border-dark5 bg-dark2 rounded-full text-sm cursor-pointer" @change="handleFilterGame">
        <option value="all" selected>Tous les jeux</option>
        <option value="undercover">Undercover</option>
        <option value="speedrundle">Speedrundle</option>
        <option value="werewolves">Werewolves</option>
      </select>
    </div>      

    <div class="configs-grid">
      <div 
        v-for="config in configs" 
        :key="config._id"
        class="flex flex-col gap-4 group"
      >
        <div class="aspect-square shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
            <span class="absolute left-2 top-2 border border-primary text-white bg-primary bg-opacity-70 rounded px-1.5 text-sm">{{ config.upvotes }}</span>
            <div class="absolute w-full flex flex-col gap-1 p-3 -bottom-full group-hover:bottom-0 transition-all duration-300">
              <button class="text-sm bg-dark3 rounded py-1" @click="() => handleDisplayConfigDetails(config)">Détails</button>
              <button class="text-sm bg-primary rounded py-1" @click="() => handlePlayWithConfig(config)">Jouer</button>
            </div>
          </div>
          <img :src="gamesImages[config.game]" class="object-cover h-full rounded-2xl" />
        </div>
        <div class="flex flex-col gap-0">
          <span class="font-medium text-xl truncate">{{ config.name }}</span>
          <span class="uppercase text-xs text-gray-500">{{ config.game }}</span>
        </div>
      </div>
    </div>
    <div v-if="configs.length !== totalConfigs" ref="loadMore" class="flex justify-center items-center">
      <Loader v-if="loading" />
      <span v-else>Charger plus</span>
    </div>

    <ConfigModal 
      :open="configDetailsModalOpen" 
      @close="configDetailsModalOpen = false" 
      :config="selectedConfig" 
      playable
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useGamesStore } from "@/modules/games/games.store";
import Loader from '@/components/Loader.vue';
import { Config } from "@/modules/games/games.types";
import speedrundleImage from '@/assets/games/speedrundle.webp';
import werewolvesImage from '@/assets/games/werewolves.webp';
import undercoverImage from '@/assets/games/undercover.webp';
import ConfigModal from '@/components/config/ConfigModal.vue';
import { toast } from "vue3-toastify";
import { useIntersectionObserver } from "@vueuse/core";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useSocketStore } from "@/modules/socket/socket.store";

const gamesStore = useGamesStore();
const store = useAuthStore();
const socketStore = useSocketStore();

const gamesImages = {
  speedrundle: speedrundleImage,
  werewolves: werewolvesImage,
  undercover: undercoverImage
};

const loading = ref(false);
const loadMore = ref();
const selectedConfig = ref();

const configDetailsModalOpen = ref(false);

const currentUser = computed(() => store.getCurrentUser);
const configs = computed<Config[]>(() => gamesStore.getConfigs.list || []);
const totalConfigs = computed<number>(() => gamesStore.getConfigs.total || 0);

async function handleFetchConfigs() {
  try {
    loading.value = true;
    const sort = { 'upvotes': -1 };
    const filters = {};
    const offset = configs.value.length || 0;

    await gamesStore.fetchConfigs({ filters, sort, offset });
  } catch (err) {
    toast('Impossible de récuperer les configs', { type: 'error', autoClose: 3000 });
  }
  loading.value = false;
}

async function handleFilterGame(e: Event) {
  const { value } = e.target;
  try {
    loading.value = true;
    const sort = { 'upvotes': -1 };
    const filters = value === 'all' ? {} : { game: value as string };
    const offset = 0;

    await gamesStore.fetchConfigs({ filters, sort, offset });
  } catch (err) {
    toast('Impossible de récuperer les configs', { type: 'error', autoClose: 3000 });
  }
  loading.value = false;
}

function handlePlayWithConfig(config: Config) {
  gamesStore.setIsLobbyCollapsed(false);
  if (!currentUser.value) return;
  if (socketStore.roomId) {
    const data = socketStore.getRoomData;
    const roomUsers = data.users;
    const isOwner = computed(() =>
      roomUsers?.some(
        ({ email, isOwner }) => email === currentUser.value?.email && !!isOwner
      )
    );
    if (!isOwner) return;
    socketStore.handleUpdateRoom(
      config.options,
      config.game !== data.gameName
        ? config.game
        : undefined
    );
  } else {
    socketStore.handleCreateRoom(
      currentUser.value,
      config.game,
      config.options
    );
  }
}

function handleDisplayConfigDetails(config: Config) {
  selectedConfig.value = {
    gameName: config.game,
    ...config.options,
  };
  configDetailsModalOpen.value = true;
}

useIntersectionObserver(
  loadMore,
  ([{ isIntersecting }]) => {
    if (isIntersecting && configs.value.length < totalConfigs.value) handleFetchConfigs()
  },
  { threshold: 1 }
)

onMounted(() => {
  handleFetchConfigs()
})
</script>

<style lang="scss" scoped>
.configs-grid {
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
}
</style>