<template>
  <div
    class="flex max-[800px]:flex-col w-full h-full min-[801px]:gap-5 relative after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:bg-primary"
    :class="{ 'after:bg-red-500': !hasWon }"
  >
    <div class="flex relative main">
      <div
        class="text-xs min-[801px]:text-base flex h-full justify-between py-2 px-6 max-[800px]:items-center max-[800px]:w-full max-[800px]:justify-between min-[801px]:flex-col min-[801px]:w-[200px]"
      >
        <div class="flex max-[800px]:gap-5 min-[801px]:flex-col">
          <p class="font-bold">Werewolves</p>
          <i>Il y a {{ timeAgo }}</i>
        </div>
        <hr class="max-[800px]:hidden opacity-30" />
        <p class="font-bold text-primary" v-if="hasWon">
          Victory : {{ capitalizeFirstLetter(currentCamp || "") }}
        </p>
        <p class="font-bold text-red-500" v-else>Defeat</p>
      </div>
      <span
        class="max-[800px]:hidden h-full min-w-[1px] w-[1px] bg-white opacity-30"
      ></span>
    </div>
    <div
      class="max-[800px]:text-xs h-full min-[801px]:text-base flex gap-5 max-[800px]:pl-5"
    >
      <div class="flex flex-col justify-center items-center min-w-[100px]">
        <img
          :src="`/images/werewolves/icons/${originalRole?.picture}.png`"
          class="h-16 w-16"
        />
        <p class="font-bold">
          {{ capitalizeFirstLetter(originalRole?.name || "") }}
        </p>
      </div>
      <span
        class="max-[550px]:hidden h-full min-w-[1px] w-[1px] bg-white opacity-30"
      ></span>
      <div
        class="max-[550px]:hidden text-xs flex flex-col justify-center min-w-[140px]"
      >
        <p>Nombre de morts : {{ deadCount }}</p>
      </div>
      <span class="h-full min-w-[1px] w-[1px] bg-white opacity-30"></span>
      <div class="py-2 text-xs">
        <p class="mb-1 whitespace-nowrap truncate">Composition :</p>
        <div class="flex flex-wrap gap-1 max-h-[34px] min-[801px]:max-h-[68px]">
          <div v-for="role in composition.slice(0, maxVisibleCharacters)">
            <img
              :src="`/images/werewolves/icons/${role}.png`"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div
            v-if="composition.length > maxVisibleCharacters"
            class="bg-white text-black font-bold w-8 h-8 rounded-full flex items-center justify-center"
          >
            +{{ composition.length - maxVisibleCharacters }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IWerewolvesRecord } from "@/modules/auth/gameRecords";
import { useAuthStore } from "@/modules/auth/auth.store";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { capitalizeFirstLetter } from "@/utils/functions";

const authStore = useAuthStore();
const props = defineProps<{ record: IWerewolvesRecord }>();
const record = computed<IWerewolvesRecord>(() => props.record);
const currentUser = computed(() => authStore.getCurrentUser);
const timeAgo = computed(() => getTimeAgo());
const aliveUsers = computed(() =>
  Object.entries(record.value.roles)
    .filter(([, { isAlive }]) => isAlive)
    .map(([playerId]) => playerId)
);
const deadCount = computed(
  () =>
    Object.entries(record.value.roles).filter(([, { isAlive }]) => !isAlive)
      .length
);
const originalRole = computed(() => {
  if (!currentUser.value) return undefined;
  const swappedRole = record.value.swapedRoles?.[currentUser.value._id];
  if (swappedRole) return swappedRole;
  return record.value.roles[currentUser.value._id];
});
const currentRole = computed(() => {
  if (!currentUser.value) return undefined;
  return record.value?.roles[currentUser.value?._id];
});
const currentCamp = computed(() => {
  if (!currentUser.value) return undefined;
  if (record.value.couple?.includes(currentUser.value._id)) return "couple";
  return currentRole.value?.camp;
});
const campWin = computed(() => {
  if (record.value.campWin === "solo") {
    const hasCoupleWon =
      aliveUsers.value.length === record.value.couple?.length;
    if (hasCoupleWon) return "couple";
  }

  return record.value.campWin;
});
const hasWon = computed(() => currentCamp.value === campWin.value);
const composition = computed(() => {
  const result = [];
  for (const [key, value] of Object.entries(record.value.config.composition)) {
    for (let i = 0; i < value; i++) {
      result.push(key);
    }
  }
  return result;
});
const maxVisibleCharacters = ref<number>(calculateMaxVisibleCharacters());

function calculateMaxVisibleCharacters(): number {
  const { innerWidth } = window;

  let baseNumberOfImages = 35;
  const imageSize = 32;
  const gap = 4;
  let baseWidth = 1267 + imageSize + gap;
  if (innerWidth > baseWidth) return baseNumberOfImages;
  let nbLines = 2;

  const bp1 = 800;

  if (innerWidth <= bp1) {
    baseWidth = 786 + imageSize + gap;
    baseNumberOfImages = 10;
    nbLines = 1;
  }

  const bp2 = 549;
  if (innerWidth <= bp2) {
    baseWidth = 517 + imageSize + gap;
    baseNumberOfImages = 7;
  }

  const difference = baseWidth - innerWidth;
  const charactersToRemove = Math.ceil(difference / (imageSize + gap)) - 1;
  return baseNumberOfImages - charactersToRemove * nbLines;
}

function handleResize() {
  maxVisibleCharacters.value = calculateMaxVisibleCharacters();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const getTimeAgo = () => {
  const { createdAt } = record.value;
  const now = new Date();

  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} jour${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
  }
};
</script>

<style scoped lang="scss">
.main {
  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../../../../assets/games/werewolves.webp");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: left;
    opacity: 0.15;
  }

  * {
    z-index: 0;
  }
}
</style>
