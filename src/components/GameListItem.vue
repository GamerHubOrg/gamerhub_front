<template>
  <div class="h-full">
    <div>
      <div class="relative listGameWrapper" :style="{ backgroundImage: `url(${img})` }">
        <div class="absolute bottom-12 left-4 right-0 p-4 mb-5">
          <h2 class="text-white text-3xl font-bold">{{ name }}</h2>
        </div>

        <div class="flex absolute bottom-5 left-4 right-0 p-4 gap-9">
          <p class="gameInfosShadow">{{ nbPlayers }} players</p>
          <p class="gameInfosShadow">{{ time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  nbPlayers: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  routerLink: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: true
  }
});

</script>

<style scoped>
.gameInfosShadow {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 15px;
}

.listGameWrapper {
  min-height: 470px;
  background-size: cover;
  background-position: center;
  border-radius: 15px;
}
</style>
