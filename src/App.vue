<script setup>
import { Switch } from "@headlessui/vue";
import {
  ChevronDownIcon,
  CloudArrowDownIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  MoonIcon,
  SunIcon,
  ClipboardIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import { computed, ref } from "vue";
import Accordion from "./components/Accordion.vue";
import Button from "./components/Button.vue";
import CardVideo from "./components/CardVideo.vue";
import CardWhyChooseUs from "./components/CardWhyChooseUs.vue";
import HowToItem from "./components/HowToItem.vue";
import Spinner from "./components/Spinner.vue";
import { useApi } from "./composables/useApi";
import { useDarkMode } from "./composables/useDarkMode";
import { useClipboard } from "./composables/useClipboard";
import { faqs, howTos } from "./constants";

const apiBase = import.meta.env.VITE_API_URL;
const SUPPORTED_HOSTS = ["youtube.com", "youtu.be", "tiktok.com"];

const { enabled } = useDarkMode();
const query = ref("");
const { isLoading, error, data, getData } = useApi();
const { pasteFromClipboard } = useClipboard();

// selectedRes holds the chosen format's relative download_url, or "" when unset.
const selectedRes = ref("");

const isYoutube = computed(
  () => query.value.includes("youtube.com") || query.value.includes("youtu.be"),
);
const isSupported = computed(() =>
  SUPPORTED_HOSTS.some((host) => query.value.includes(host)),
);

const handleChangeQuery = (e) => {
  query.value = e.target.value;
  data.value = null;
};

const handleGetData = () => {
  if (!isSupported.value) return;
  selectedRes.value = "";
  getData("/api/info", { url: query.value });
};

const handleDownload = () => {
  if (!selectedRes.value) return;
  // download_url is a relative path like "/download?url=..." served by the API.
  window.location.href = apiBase + selectedRes.value;
};

const formatLabel = (f) => {
  const size = f.filesize ? ` · ${(f.filesize / 1048576).toFixed(0)} MB` : "";
  return `${f.ext.toUpperCase()} ${f.resolution}${size}`;
};

const handlePasteFromClipboard = async (e) => {
  e.preventDefault();
  let text = await pasteFromClipboard();
  let acceptedText = (text.includes("youtube.com") || text.includes("youtu.be") || text.includes("tiktok.com")) ? text : '';
  query.value = acceptedText;
};

const handleClearInput = () => {
  query.value = "";
};
</script>

<template>
  <header class="h-16 w-full sm:max-w-3xl my-1 px-2 mx-auto">
    <nav class="size-full flex justify-between items-center">
      <h1 class="font-bold text-xl text-primary">SnapCatch</h1>

      <div class="py-16">
        <Switch
          v-model="enabled"
          :class="!enabled ? 'bg-primary' : 'bg-primary-700'"
          class="relative inline-flex items-center h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <span class="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            :class="enabled ? 'translate-x-[30px]' : 'translate-x-[2px]'"
            class="pointer-events-none size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out grid place-items-center"
          >
            <component :is="!enabled ? SunIcon : MoonIcon" class="size-3" />
          </span>
        </Switch>
      </div>
    </nav>
  </header>
  <main class="p-2 sm:max-w-3xl mx-auto pb-10">
    <form
      @submit.prevent="handleGetData"
      class="flex flex-col justify-center items-center min-h-80 rounded-[2rem] bg-slate-100 dark:bg-stone-600 px-2 text-center relative z-20 py-10"
    >
      <img
        src="./assets/img/hero-section.webp"
        alt="a group of people watching phone"
        class="absolute size-full inset-0 object-cover rounded-[2rem] z-10 opacity-30 grayscale"
      />
      <h3
        class="relative z-20 text-xl text-secondary dark:text-secondary-dark font-medium"
      >
        Youtube and tiktok
      </h3>
      <h1 class="relative z-20 font-bold text-3xl text-primary drop-shadow-lg">
        Video Downloader
      </h1>
      <p
        class="relative z-20 text-sm mt-5 px-5 text-secondary dark:text-secondary-dark font-medium max-w-md"
      >
        Download any video from youtube and tiktok fast, easy and HD quality.
        Start by paste your tiktok or youtube link below.
      </p>
      <div
        class="relative z-20 bg-slate-200 dark:bg-[#3B3A38] border-4 border-white dark:border-secondary flex items-center gap-1 px-3 sm:pr-2 sm:pl-3 w-full h-10 sm:h-auto py-1 rounded-full mt-5 max-w-sm sm:max-w-md sm:mt-10"
      >
        <input
          type="url"
          class="bg-transparent border-none focus-within:outline-none flex-1 text-ellipsis text-sm text-center sm:text-start dark:text-white dark:placeholder:text-secondary-dark/50"
          placeholder="Insert your link here"
          v-model="query"
          @change="(e) => handleChangeQuery(e)"
          required
        />
        <button class="sm:flex ml-1" :class="{ 'text-white': enabled, 'text-black': !enabled }">
            <ClipboardIcon class="h-5 w-5 mr-2" v-if="!query" @click="handlePasteFromClipboard"/>
            <XMarkIcon class="h-5 w-5 mr-2" v-else @click="handleClearInput"/>
        </button>
        <Button type="submit" class="hidden sm:flex" :disabled="isLoading">
          <template v-if="!isLoading"> Search </template>
          <template v-else>
            <Spinner class="border-white" /> Searching ...
          </template>
        </Button>
      </div>

      <Button
        type="submit"
        class="sm:hidden absolute z-20 bottom-0 translate-y-1/2 left-1/2 transform -translate-x-1/2"
        :disabled="isLoading"
      >
        <template v-if="!isLoading"> Search </template>
        <template v-else>
          <Spinner class="border-white" /> Searching ...
        </template>
      </Button>
    </form>

    <!-- videos -->
    <section
      class="bg-secondary w-full pb-6 pt-16 rounded-b-[2rem] -translate-y-8 relative z-10 text-center text-white"
    >
      <h1 v-if="!isLoading && !error && !data">Try to paste now!</h1>

      <CardVideo
        v-if="!isLoading && !error && data"
        :title="data.title"
        :source-url="query"
        :is-youtube="isYoutube"
      >
        <template #thumbnail>
          <img
            v-if="data.thumbnail"
            :src="data.thumbnail"
            :alt="data.title"
            class="absolute inset-0 size-full rounded-lg object-cover"
          />
        </template>
        <template #resolutions>
          <form @submit.prevent="handleDownload" class="flex flex-col">
            <div class="flex flex-col justify-start mt-2">
              <label for="resolution" class="text-sm mb-1">Resolutions</label>
              <div
                class="overflow-hidden rounded-md p-2 relative flex items-center h-9 focus-within:ring focus-within:ring-primary duration-150"
              >
                <select
                  name="resolution"
                  id="resolution"
                  class="bg-secondary-700 focus:outline-none text-sm appearance-none flex-1 absolute size-full inset-0 z-10 px-3"
                  v-model="selectedRes"
                >
                  <option value="" disabled>Choose One</option>
                  <option
                    v-for="format in data.formats"
                    :key="format.download_url"
                    :value="format.download_url"
                  >
                    {{ formatLabel(format) }}
                  </option>
                </select>

                <ChevronDownIcon
                  class="size-4 absolute right-2 z-20 opacity-50"
                />
              </div>
            </div>

            <Button type="submit" class="w-full flex items-center gap-2 mt-2">
              <CloudArrowDownIcon class="size-5" /> Download
            </Button>
          </form>
        </template>
      </CardVideo>

      <div
        v-if="isLoading"
        class="w-full flex items-center justify-center gap-2 text-sn"
      >
        <Spinner class="border-primary" />
        <h1>Searching ...</h1>
      </div>

      <div
        v-if="error"
        class="w-full flex items-center justify-center gap-2 text-sn"
      >
        <ExclamationTriangleIcon class="size-5 text-red-500" />
        <h1>Something went wrong ...</h1>
      </div>
    </section>

    <!-- how to section -->
    <section class="mt-5">
      <h1
        class="text-xl text-center text-secondary dark:text-secondary-dark font-semibold"
      >
        How to use <span class="font-bold text-primary">SnapCatch?</span>
      </h1>
      <ul class="flex flex-col gap-5 mt-7">
        <li class="group flex items-start gap-2" v-for="how in howTos">
          <HowToItem
            :title="how.title"
            :description="how.description"
            :number="how.number"
          />
        </li>
      </ul>
    </section>

    <!-- why choose us section -->
    <section class="mt-5 text-center sm:flex sm:*:flex-1">
      <CardWhyChooseUs
        class="why-choose-us mt-5 sm:mt-0 bg-secondary p-5 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none before:bg-white dark:before:bg-body-dark after:z-10 before:z-10"
        title="Support All Devices"
      >
        <template #description>
          <span class="font-bold">SnapCatch</span> Is A Website-Based And Online
          Platform That You Can Use Any Operating System, Including Windows,
          Linux, IPhone, And Android.
        </template>
      </CardWhyChooseUs>
      <CardWhyChooseUs
        class="why-choose-us bg-secondary/80 p-5 before:bg-white dark:before:bg-body-dark"
        title="Fast Downloading"
      >
        <template #description>
          Using <span class="font-bold">SnapCatch</span>, Quickly Download Your
          Desired Videos From YouTube or TikTok With Just A Few Simple Clicks
          Without Wasting Any Time Or Paying Extra Fees.
        </template>
      </CardWhyChooseUs>
      <CardWhyChooseUs
        class="flex flex-col bg-secondary p-5 text-white rounded-b-xl sm:rounded-r-xl border-dashed"
        title="Unlimited Download"
      >
        <template #description>
          Through This Platform, You Can Download The Videos You Want At Any
          Time And Without Limiting The Number Of Downloads. You Can Download
          Your Favorite Videos And Save Them.
        </template>
      </CardWhyChooseUs>
    </section>

    <section class="mt-10">
      <h1 class="text-xl font-semibold text-center dark:text-white">
        Most Asked
        <span class="bg-primary font-bold text-white px-2 py-1 rounded-md">
          Questions
        </span>
      </h1>

      <div class="mt-5 overflow-y-hidden rounded-lg space-y-1">
        <Accordion
          v-for="faq in faqs"
          :key="faq.question"
          :title="faq.question"
          :description="faq.answer"
        />
      </div>
    </section>
  </main>

  <footer
    class="bg-secondary rounded-t-xl px-3 py-4 mt-10 w-full sm:max-w-3xl mx-auto text-center"
  >
    <div class="text-white flex items-center justify-center gap-2 text-sm">
      <span class="flex items-center gap-1">
        Made with <HeartIcon class="size-4 text-primary" /> by
      </span>
      <a
        href="https://github.com/dafinrmaulana"
        target="_blank"
        class="underline font-medium"
      >
        Dafi N Maulana
      </a>
    </div>
  </footer>
</template>

<style scoped lang="postcss">
.fade-slide-y-enter-active,
.fade-slide-y-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-y-enter-from,
.fade-slide-y-leave-to {
  margin-top: -10%;
  opacity: 0;
}

.why-choose-us {
  @apply flex flex-col text-white border-b sm:border-b-0 sm:border-r border-white/50 border-dashed relative after:w-3.5 after:h-7 after:sm:size-7 after:sm:rounded-full after:sm:translate-x-1/2 after:absolute after:right-0 before:rounded-full before:bottom-0 before:sm:top-0 before:sm:right-0 before:sm:left-auto before:sm:translate-x-1/2 before:sm:bottom-auto before:translate-y-1/2 before:sm:-translate-y-1/2 after:bg-white dark:after:bg-body-dark after:rounded-l-full after:bottom-0 after:translate-y-1/2 before:size-7 before:absolute before:left-0 before:-translate-x-1/2;
}
</style>
