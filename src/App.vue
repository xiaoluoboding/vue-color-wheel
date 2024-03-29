<template>
  <div
    class="w-full h-full min-h-screen px-4 lg:px-0"
    id="app-wrapper"
    ref="wrapperRef"
  >
    <div class="gradient-bg -z-1">
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="point">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="point"
            />
            <feBlend in="SourceGraphic" in2="point" />
          </filter>
        </defs>
      </svg>
      <div class="gradients-container">
        <div class="g1"></div>
        <div class="g2"></div>
        <div class="g3"></div>
        <div class="g4"></div>
        <div class="g5"></div>
        <div class="interactive"></div>
      </div>
    </div>
    <div class="container mx-auto max-w-5xl relative">
      <nav class="h-20 py-4 flex-between text-primary">
        <div
          class="font-semibold text-xl font-serif flex-center gap-2"
          :class="isColorReadable ? 'text-neutral-900' : 'text-neutral-100'"
        >
          <Logo class="h-6 w-6" />
          Vue Color Wheel
        </div>
        <div class="flex-center gap-4">
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
          <span
            class="text-6xl font-serif"
            :class="isColorReadable ? 'text-neutral-900' : 'text-neutral-100'"
            >Vue Color Wheel</span
          >
          <div
            class="text-4xl font-sans"
            :class="isColorReadable ? 'text-neutral-900' : 'text-neutral-100'"
          >
            Create a color palette and effortlessly incorporate it into your
            projects.
          </div>
        </div>
        <div
          class="text-2xl font-500 py-4 font-sans"
          :class="isColorReadable ? 'text-neutral-800' : 'text-neutral-200'"
        >
          A Color Wheel Picker for Vue, craft by
          <a
            href="https://twitter.com/robert_shaw_x"
            target="_blank"
            class="underline"
            :class="
              isColorReadable
                ? 'hover:text-neutral-900/80'
                : 'hover:text-neutral-100/80'
            "
            >@robert_shaw_x</a
          >
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
        class="grid grid-cols-1 lg:grid-cols-4 gap-8 text-xs 2xl:text-sm bg-white rounded-2xl shadow-md"
      >
        <div class="w-full p-8 order-1">
          <div class="flex flex-col gap-8">
            <fieldset class="flex flex-col gap-4">
              <figcaption class="text-xl">Pick a color</figcaption>
              <figure>
                <div class="flex relative">
                  <input
                    id="color-input"
                    class="bg-transparent text-base py-2 pl-2 pr-6 border rounded-md w-full lg:w-45"
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
                <div class="relative flex flex-col gap-2">
                  <button
                    v-for="v in harmonyTypes"
                    :key="v.type"
                    :value="v.type"
                    @click.prevent="currentType = v.type"
                    class="text-primary border-1 py-2 px-6 focus:outline-none rounded-md text-sm w-full lg:w-45"
                    :class="{
                      'bg-neutral-950 text-white': currentType === v.type
                    }"
                  >
                    {{ v.label }}
                  </button>
                </div>
              </figure>
            </fieldset>
          </div>
        </div>
        <div class="lg:col-span-2 flex-center order-2 lg:p-0">
          <VueColorWheel
            wheel="aurora"
            :harmony="currentType"
            :radius="160"
            :defaultColor="wheelColor"
            :show-brightness="false"
            v-model:color="wheelColor"
            @change="handleChangeColors"
          />
        </div>
        <div
          class="w-full flex flex-col p-8 overflow-hidden cursor-copy order-3"
        >
          <div class="flex flex-col h-full">
            <div
              v-for="(color, i) in colorList"
              :key="i"
              class="w-full h-full flex flex-col justify-end p-4 text-xl first-rounded-tr-lg first-rounded-tl-lg last-rounded-bl-lg last-rounded-br-lg"
              :class="isColorReadable ? 'text-neutral-900' : 'text-neutral-100'"
              :style="{
                backgroundColor: `${color}`
              }"
              @click="() => handleCopy(color)"
            >
              {{ color }}
            </div>
          </div>

          <div class="w-full lg:flex lg:justify-end gap-2 mt-2">
            <button
              class="bg-transparent text-primary border-1 py-2 px-6 focus:outline-none rounded-md text-sm w-full lg:w-45"
              hover="bg-neutral-50/50"
              @click="() => handleCopy(colorList.join(','))"
            >
              Copy
            </button>
          </div>
        </div>
      </main>

      <footer
        class="py-16 w-full flex-center text-sm"
        :class="isColorReadable ? 'text-neutral-900' : 'text-neutral-100'"
      >
        <div class="copyright flex flex-col justify-center items-center">
          <p>
            Code with ❤ & ☕️ by
            <a href="https://github.com/xiaoluoboding"> @xiaoluoboding </a>
            <span> © {{ new Date().getFullYear() }}</span>
          </p>
          <p class="flex items-center space-x-1 flex-col lg:flex-row">
            <carbon:logo-twitter />
            <span>
              <a href="https://twitter.com/robert_shaw_x" target="_blank">
                Follow me on Twitter
              </a>
            </span>
            <span class="px-2">|</span>
            <carbon:cafe />
            <span>
              <a href="https://www.buymeacoffee.com/xlbd" target="_blank">
                Buy me a coffee
              </a>
            </span>
            <span class="px-2">|</span>
            <mdi:heart />
            <span>
              <a
                href="https://github.com/sponsors/xiaoluoboding"
                target="_blank"
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
  <Toaster position="top-center" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useDebounce, useClipboard } from '@vueuse/core'
import { colord, extend } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'
// import { gsap } from 'gsap'
import { Toaster, toast } from 'vue-sonner'

import { VueColorWheel } from '@/index'
import type { HarmonyType, Harmony } from '@/index'
// import { isDark, toggleDarkmode } from '~/composables/useDarkmode'

extend([a11yPlugin])

const wheelColor = useDebounce(ref('#40ffff')) // { hue: 0, saturation: 0.68, value: 1 }
const colors = ref<Harmony[]>([])
const currentType = ref<HarmonyType>('analogous')
const isColorReadable = ref(false)
const wrapperRef = ref(null)

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

const { copy } = useClipboard()

const handleCopy = (str: string) => {
  copy(str)
  toast.success('Copied to clipboard!')
}

const handleChangeGradient = (harmonyColors: Harmony[]) => {
  const newColors = harmonyColors.map((color, i) => colord(color.rgb).toHex())

  const [base, secondary] = newColors

  const rootEl = document.documentElement

  harmonyColors.map((color, index) => {
    const { r, g, b } = colord(color.rgb).toRgb()
    rootEl.style.setProperty(`--color${index + 1}`, `${r}, ${g}, ${b}`)
  })
  const secondaryRgb = colord(secondary).toRgb()
  rootEl.style.setProperty(
    `--color-interactive`,
    `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`
  )
  if (newColors.length === 3) {
    const lightColor = colord(base).saturate(0.25).toRgb()
    const darkColor = colord(base).desaturate(0.25).toRgb()
    rootEl.style.setProperty(
      `--color4`,
      `${lightColor.r}, ${lightColor.g}, ${lightColor.b}`
    )
    rootEl.style.setProperty(
      `--color5`,
      `${darkColor.r}, ${darkColor.g}, ${darkColor.b}`
    )
  }

  const bg1 = newColors
    .map((item, index) => {
      return `linear-gradient(${
        45 * (index + 1)
      }deg var(--space), ${item}, rgba(${index === 0 ? 255 : 0}, ${
        index === 1 ? 255 : 0
      }, ${(index + 1) % 3 === 0 ? 255 : 0},0) 80%)`
    })
    .join(',')

  const bg2 = newColors
    .reverse()
    .map((item, index) => {
      return `linear-gradient(${
        70 * (index + 1)
      }deg var(--space), ${item}, rgba(${index === 0 ? 255 : 0}, ${
        index === 1 ? 255 : 0
      }, ${(index + 1) % 3 === 0 ? 255 : 0},0) 75%)`
    })
    .join(',')

  // gsap.fromTo(
  //   '.gradient-bg',
  //   { background: bg1 },
  //   { ease: 'none', duration: 5, background: bg2, repeat: -1, yoyo: true }
  // )

  isColorReadable.value = colord(base).isReadable('#000', { level: 'AAA' })
}

const handleChangeColors = (harmonyColors: Harmony[]) => {
  colors.value = harmonyColors
}

watch(
  () => colors.value,
  (newColors) => {
    handleChangeGradient(newColors)
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss">
:root {
  --space: ;
  @supports (background: linear-gradient(in oklab, #000, #fff)) {
    --space: in oklab;
  }
  --color-bg1: rgb(108, 0, 162);
  --color-bg2: rgb(0, 17, 82);
  --color1: 18, 113, 255;
  --color2: 221, 74, 255;
  --color3: 100, 220, 255;
  --color4: 200, 50, 50;
  --color5: 180, 180, 50;
  --color-interactive: 140, 100, 255;
  --circle-size: 80%;
  --blending: hard-light;
}
@import '~/assets/highlight.scss';
@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

.gradient-bg {
  width: 100vw;
  height: 100vh;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;

  svg {
    display: none;
  }

  .gradients-container {
    filter: url(#point) blur(40px);
    width: 100%;
    height: 100%;
  }

  .g1 {
    position: absolute;
    background: radial-gradient(
        circle at center,
        rgba(var(--color1), 0.8) 0,
        rgba(var(--color1), 0) 50%
      )
      no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: center center;
    animation: moveVertical 30s ease infinite;

    opacity: 1;
  }

  .g2 {
    position: absolute;
    background: radial-gradient(
        circle at center,
        rgba(var(--color2), 0.8) 0,
        rgba(var(--color2), 0) 50%
      )
      no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;

    opacity: 1;
  }

  .g3 {
    position: absolute;
    background: radial-gradient(
        circle at center,
        rgba(var(--color3), 0.8) 0,
        rgba(var(--color3), 0) 50%
      )
      no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2 + 200px);
    left: calc(50% - var(--circle-size) / 2 - 500px);

    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;

    opacity: 1;
  }

  .g4 {
    position: absolute;
    background: radial-gradient(
        circle at center,
        rgba(var(--color4), 0.8) 0,
        rgba(var(--color4), 0) 50%
      )
      no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;

    opacity: 0.7;
  }

  .g5 {
    position: absolute;
    background: radial-gradient(
        circle at center,
        rgba(var(--color5), 0.8) 0,
        rgba(var(--color5), 0) 50%
      )
      no-repeat;
    mix-blend-mode: var(--blending);

    width: calc(var(--circle-size) * 2);
    height: calc(var(--circle-size) * 2);
    top: calc(50% - var(--circle-size));
    left: calc(50% - var(--circle-size));

    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;

    opacity: 1;
  }

  .interactive {
    position: absolute;
    background: radial-gradient(
        circle at center,
        rgba(var(--color-interactive), 0.8) 0,
        rgba(var(--color-interactive), 0) 50%
      )
      no-repeat;
    mix-blend-mode: var(--blending);

    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;

    opacity: 0.7;
  }
}
</style>
