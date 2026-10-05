<script setup>
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
</script>

<template>
  <div class="relative">
    <button class="flex items-center gap-1.5">
      <img
        src="../assets/img/us flag.png"
        alt="american flag"
        class="size-6 rounded-full object-cover object-left"
      />
      <span class="font-medium uppercase text-sm">Eng</span>
      <ChevronDownIcon class="size-4" />
    </button>
    <div class="absolute top-full bg-white shadow-sm"></div>
  </div>
</template>
