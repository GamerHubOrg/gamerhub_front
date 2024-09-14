<template>
  <Modal :open="open" @close="$emit('close')">
    <form @submit="handleShareConfig">
      <div>
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark5"
        >
          <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <DialogTitle
            as="h3"
            class="text-base font-semibold leading-6 text-white"
            >{{ $t("config.shareModal.title") }}
          </DialogTitle>
          <div class="mt-10">
            <input
              v-model="shareConfigName"
              required
              type="text"
              class="block w-full p-1.5 rounded-md border-0 bg-dark5 shadow-sm ring-1 ring-inset ring-dark3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              :placeholder="$t('config.shareModal.placeholder')"
            />
          </div>
        </div>
      </div>
      <div
        class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
      >
        <button
          type="submit"
          class="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
        >
          {{ $t("shared.share") }}
        </button>
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          @click="$emit('close')"
          ref="cancelButtonRef"
        >
          {{ $t("shared.cancel") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify";
import Modal from "@/components/Modal.vue";
import { DialogTitle } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useGamesStore } from "@/modules/games/games.store";
import { IRoomConfig } from "@/types/interfaces";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const emit = defineEmits(["close"]);
const props = defineProps<{
  open: boolean;
  config: IRoomConfig;
  gameName?: string;
}>();
const gameStore = useGamesStore();

const shareConfigName = ref<string>("");
const handleShareConfig = async (e: Event) => {
  try {
    e.preventDefault();
    await gameStore.publishConfig({
      game: props.gameName,
      name: shareConfigName.value,
      config: props.config,
    });
    shareConfigName.value = "";
    emit("close");
    toast(t("config.shareModal.toastSuccess"), {
      autoClose: 1000,
      type: "success",
      theme: "dark",
    });
  } catch (err) {
    toast(t("config.shareModal.toastError"), {
      autoClose: 1000,
      type: "error",
      theme: "dark",
    });
    console.log(err);
  }
};
</script>

<style scoped lang="scss"></style>
