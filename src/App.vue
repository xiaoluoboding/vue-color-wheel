<template>
  <div
    class="w-full h-full min-h-screen bg-neutral-50 dark:bg-neutral-900"
    :style="{
      background: bgColor
    }"
  >
    <div class="container mx-auto max-w-5xl relative">
      <nav class="h-20 py-4 flex-between text-primary">
        <div class="font-semibold text-xl font-serif flex-center gap-2">
          <Logo class="h-6 w-6" />
          Vue Color Wheel
        </div>
        <div class="flex-center gap-4">
          <!-- <button
            class="!bg-transparent opacity-50 hover:opacity-100 transition"
            @click="(e) => toggleDarkmode()"
          >
            <carbon:moon class="w-6 h-6" v-if="isDark" />
            <carbon:sun class="w-6 h-6" v-else />
          </button> -->
          <a
            class="opacity-50 hover:opacity-100 transition"
            href="https://github.com/xiaoluoboding/vue-color-wheel"
          >
            <carbon:logo-github class="h-6 w-6" />
          </a>
        </div>
      </nav>
      <header class="py-16 flex flex-col gap-4">
        <div class="font-extrabold space-y-4">
          <span class="text-6xl text-primary font-serif">Vue Color Wheel</span>
          <div class="text-4xl text-primary font-sans">
            Create a color palette and effortlessly incorporate it into your
            projects.
          </div>
        </div>
        <div
          class="text-2xl font-500 text-neutral-800 py-4 dark:text-neutral-200 font-sans"
        >
          A Color Wheel Picker for Vue
        </div>
        <!-- <div class="flex gap-4 mt-8">
          <a
            class="bg-gray-200 hover:bg-gray-300 transition rounded-full text-lg font-semibold py-3 px-6 w-full sm:w-auto text-center"
            href="https://github.com/xiaoluoboding/vue-color-wheel"
            target="_blank"
          >
            <span>Documentation</span>
          </a>
          <a
            class="bg-emerald-400 hover:bg-emerald-500 flex items-center justify-center space-x-3 transition rounded-full text-white text-lg font-semibold py-3 px-6 w-full sm:w-auto cursor-pointer"
            href="https://github.com/new?template_name=vue-color-wheel&template_owner=xiaoluoboding"
            target="_blank"
          >
            <span>Use the template</span>
          </a>
        </div> -->
      </header>

      <main
        class="grid grid-cols-4 gap-8 text-xs 2xl:text-sm bg-white rounded-2xl shadow-md"
      >
        <div class="w-full flex items-center p-8">
          <div class="flex flex-col gap-8">
            <fieldset class="flex flex-col gap-4">
              <figcaption class="text-xl">Pick a color</figcaption>
              <figure>
                <div class="flex relative">
                  <input
                    id="color-input"
                    class="bg-transparent text-base py-2 pl-2 pr-6 border rounded-md w-45"
                    v-model="wheelColor"
                  />
                  <div
                    :style="{ backgroundColor: wheelColor }"
                    class="absolute top-3 right-2 w-4.5 h-4.5 rounded-full"
                  ></div>
                </div>
              </figure>
            </fieldset>
            <fieldset class="flex flex-col gap-4">
              <figcaption class="text-xl">Pick a palette type</figcaption>
              <figure>
                <div class="flex items-center gap-3">
                  <div class="relative flex flex-col gap-2">
                    <button
                      v-for="v in harmonyTypes"
                      :key="v.type"
                      :value="v.type"
                      @click.prevent="currentType = v.type"
                      class="text-primary border-1 py-2 px-6 focus:outline-none rounded-md text-sm w-45"
                      :class="{
                        'bg-neutral-950 text-white': currentType === v.type
                      }"
                    >
                      {{ v.label }}
                    </button>
                  </div>
                </div>
              </figure>
            </fieldset>
          </div>
        </div>
        <div class="col-span-2 flex-center">
          <VueColorWheel
            wheel="aurora"
            :harmony="currentType"
            :radius="160"
            :defaultColor="wheelColor"
            v-model:color="wheelColor"
            @change="handleChangeColors"
          />
        </div>
        <div class="w-full flex flex-col overflow-hidden">
          <div
            v-for="(color, i) in colorList"
            :key="i"
            class="w-full h-full flex flex-col justify-end p-4 text-xl first-rounded-tr-lg last-rounded-br-lg"
            :style="{
              backgroundColor: `${color}`
            }"
          >
            {{ color }}
          </div>
        </div>
      </main>

      <footer
        class="mt-16 w-full flex-center text-primary"
        text="neutral-900 dark:neutral-300 opacity-60 sm"
      >
        <div class="copyright flex flex-col justify-center items-center">
          <p>
            Code with ❤ & ☕️ by
            <a class="text-primary" href="https://github.com/xiaoluoboding">
              @xiaoluoboding
            </a>
            <span> © {{ new Date().getFullYear() }}</span>
          </p>
          <p class="flex items-center space-x-1">
            <carbon:logo-twitter class="text-primary" />
            <span>
              <a
                href="https://twitter.com/xiaoluoboding"
                class="text-primary"
                target="_blank"
              >
                Follow me on Twitter
              </a>
            </span>
            <span class="px-2 text-emerald-300">|</span>
            <carbon:cafe class="text-primary" />
            <span>
              <a
                href="https://www.buymeacoffee.com/xlbd"
                target="_blank"
                class="text-primary"
              >
                Buy me a coffee
              </a>
            </span>
            <span class="px-2 text-emerald-300">|</span>
            <mdi:heart class="text-primary" />
            <span>
              <a
                href="https://github.com/sponsors/xiaoluoboding"
                target="_blank"
                class="text-primary"
              >
                Sponsor me on GitHub
              </a>
            </span>
          </p>
        </div>
      </footer>

      <div class="w-full mx-auto"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDebounce } from '@vueuse/core'
import { colord } from 'colord'

import { VueColorWheel, HarmonyType, Harmony } from '@/index'
import { isDark, toggleDarkmode } from '~/composables/useDarkmode'

const wheelColor = useDebounce(ref('#ff5252')) // { hue: 0, saturation: 0.68, value: 1 }
const colors = ref<Harmony[]>([])
const currentType = ref<HarmonyType>('analogous')

const harmonyTypes: { type: HarmonyType; label: string }[] = [
  { type: 'monochromatic', label: 'Monochromatic' },
  { type: 'complementary', label: 'Complementary' },
  { type: 'analogous', label: 'Analogous' },
  { type: 'triad', label: 'Triad' },
  { type: 'split', label: 'Split' },
  { type: 'compound', label: 'Compound' },
  { type: 'tetradic', label: 'Tetradic' },
  { type: 'square', label: 'Square' },
  { type: 'doubleSplit', label: 'Double Split' }
]

const colorList = computed(() => {
  return colors.value.map((item) => colord(item.rgb).toHex())
})

const bgColor = computed(() => {
  return `linear-gradient(${colorList.value.join(',')})`
})

const handleChangeColors = (harmonyColors: Harmony[]) => {
  // console.log(colors)
  colors.value = harmonyColors
}
</script>

<style lang="scss">
@import '~/assets/highlight.scss';
</style>
