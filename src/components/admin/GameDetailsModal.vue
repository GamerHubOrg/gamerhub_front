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
            Expulser
          </button>
          <button class="bg-[#E847471A] text-[#E84747] rounded-md px-3 py-1.5 text-sm"
            @click="handleBanUser(user._id, 'email')">
            Bannir le compte
          </button>
          <button class="bg-[#E847471A] text-[#E84747] rounded-md px-3 py-1.5 text-sm"
            @click="handleBanUser(user._id, 'ip')">
            Bannir IP
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import { useAdminStore } from "@/modules/admin/admin.store";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useSocketStore } from "@/modules/socket/socket.store";
import { computed } from "vue";
import { toast } from "vue3-toastify";

const emit = defineEmits(["close"]);
const props = defineProps<{
  open: boolean;
  game: any;
}>();

const store = useAuthStore();
const socketStore = useSocketStore();
const adminStore = useAdminStore();

const currentUser = computed(() => store.getCurrentUser);

const handleKickUser = (id: string) => {
  socketStore.handleKickUser(id, props.game.roomId);
  emit('close');
};

const handleBanUser = async (userId: string, type: string) => {
  socketStore.handleKickUser(userId, props.game.roomId);
  await adminStore.putBanUser({ userId, type, message: `Banned by ${currentUser.value?.username}` });
  emit('close')
  toast('Utilisateur bannis avec succes', { type: 'success', autoClose: 3000 });
};
</script>