<template>
  <Modal :open="open" @close="$emit('close')">
    <h6 class="font-medium mb-4">Room {{ game.roomId }} <span class="italic text-xs font-normal">({{ game.gameName }})</span></h6>
    <div class="flex flex-col gap-2">
      <div 
        v-for="user in game.users" 
        :key="user._id"
        class="border-dark5 bg-dark2 rounded-md p-3 flex flex-row items-center justify-between gap-1"
      >
        <span>{{ user.username }}</span>
        <div class="flex flex-row items-center gap-2">
          <button class="bg-[#E8B9141A] text-[#E8B914] rounded-md px-3 py-1.5 text-sm"
            @click="handleKickUser(user._id)">
            Kick
          </button>
          <button class="bg-[#E847471A] text-[#E84747] rounded-md px-3 py-1.5 text-sm"
            @click="handleBanUser(user._id)">
            Ban
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import { useSocketStore } from "@/modules/socket/socket.store";

const emit = defineEmits(["close"]);
const props = defineProps<{
  open: boolean;
  game: any;
}>();

const socketStore = useSocketStore();

const handleKickUser = (id: string) => {
  socketStore.handleKickUser(id, props.game.roomId);
};

const handleBanUser = (id: string) => {
  socketStore.handleKickUser(id, props.game.roomId);
};
</script>