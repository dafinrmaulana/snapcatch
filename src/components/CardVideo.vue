<script setup>
import { ArrowUpRightIcon } from "@heroicons/vue/20/solid";
import YoutubeIcon from "./Icons/YoutubeIcon.vue";
import TiktokIcon from "./Icons/TiktokIcon.vue";

const props = defineProps({
  title: String,
  thumbnailUrl: String,
  sourceUrl: String,
  isYoutube: Boolean,
});
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center px-5 gap-4">
    <!-- thumbnail -->
    <div class="w-full max-w-full h-full min-h-52 flex-1 relative">
      <slot name="thumbnail" />

      <a
        :href="props.sourceUrl"
        target="_blank"
        class="py-1 px-2 rounded-full absolute flex left-1 bottom-2 items-center gap-1 shadow-sm"
        :class="{
          'bg-white text-black': props.isYoutube,
          'bg-black text-white': !props.isYoutube,
        }"
      >
        <component
          :is="props.isYoutube ? YoutubeIcon : TiktokIcon"
          :class="{
            'text-red-600 size-5': props.isYoutube,
            'text-white size-4': !props.isYoutube,
          }"
        />
        <span class="font-semibold text-xs">
          {{ props.isYoutube ? "Youtube" : "Tiktok" }}
        </span>
        <ArrowUpRightIcon class="size-4 rotate-6" />
      </a>
    </div>

    <!-- title and download -->
    <div class="text-start flex flex-col flex-1">
      <h1 class="text-base sm:text-lg font-medium">
        {{ props.title }}
      </h1>
      <slot name="resolutions" />
    </div>
  </div>
</template>
