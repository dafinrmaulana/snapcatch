<template>
  <button
    class="flex items-center justify-center gap-2 z-20 bg-primary px-4 h-8 rounded-full text-white disabled:text-white/50 hover:bg-red-600 duration-100 focus:ring-3 focus:ring-primary focus:ring-offset-1 text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>
