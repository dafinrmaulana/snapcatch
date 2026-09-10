<script setup>
const props = defineProps({
  title: String,
  description: String,
  number: Number,
});
</script>

<template>
  <div
    class="size-7 grid place-items-center font-semibold border border-primary rounded-full flex-none text-primary bg-transparent transition-colors duration-200 group-hover:text-white group-hover:bg-primary"
  >
    {{ props.number }}
  </div>
  <div class="flex flex-col text-secondary dark:text-white">
    <h1 class="font-semibold">{{ props.title }}</h1>
    <p
      class="text-xs sm:text-sm dark:opacity-50 dark:font-extralight dark:tracking-wide"
    >
      {{ props.description }}
    </p>
  </div>
</template>
