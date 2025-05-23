<template>
  <div
    ref="wrapperRef"
    id="ColorWheel"
    class="vue-color-wheel"
    :style="{
      position: 'relative',
      width: `${radius * 2}px`,
      height: `${radius * 2}px`
    }"
  >
    <div
      class="wheel-ring-mask"
      :style="{
        position: 'absolute',
        borderRadius: '100%',
        background: '#ffffff',
        width: `${radius * 2 + 24}px`,
        height: `${radius * 2 + 24}px`,
        top: '-12px',
        left: '-12px',
        zIndex: '1'
      }"
    />
    <div
      v-if="showBrightness"
      class="wheel-ring-tracker"
      :style="{
        position: 'absolute',
        borderRadius: '100%',
        width: `${radius * 2 + 48}px`,
        height: `${radius * 2 + 48}px`,
        top: '-24px',
        left: '-24px',
        background: `${ringLinearGradient}`
      }"
      role="slider"
    >
      <div
        id="ringTrackerRef"
        class="wheel-ring-inner"
        :style="{
          position: 'relative',
          borderRadius: '100%',
          background: 'transparent',
          width: `${radius * 2 + 48}px`,
          height: `${radius * 2 + 48}px`,
          top: '0',
          left: '0',
          cursor: 'pointer'
        }"
      >
        <div
          id="ringHandleRef"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '50%',
            bottom: '-2px',
            width: '14px',
            height: '14px',
            borderRadius: '99px',
            border: '1px solid rgba(0, 0, 0, 0.24)',
            backgroundColor: `#ffffff`,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
            cursor: 'move',
            userSelect: 'none',
            transform: 'translateX(-50%)',
            zIndex: '10'
          }"
        />
      </div>
    </div>

    <canvas
      ref="canvasRef"
      v-if="wheel === 'spectrum'"
      :style="{
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: '50%',
        zIndex: '10'
      }"
    />

    <div
      ref="auroraWheelRef"
      id="auroraWheelRef"
      v-else
      class="aurora-wheel"
      :style="{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        zIndex: '10'
      }"
    ></div>

    <template v-for="(h, i) in harmonyPairs" :key="i">
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          width: '16px',
          height: '16px',
          borderRadius: '999px',
          border: '3px solid #ffffff',
          backgroundColor: `rgb(${h.rgb})`,
          transform: `translate(${h.x}px, ${h.y}px)`,
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
          zIndex: '10'
        }"
      />
    </template>

    <div
      id="handleRef"
      ref="handleRef"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '-12px',
        left: '-12px',
        width: '24px',
        height: '24px',
        borderRadius: '99px',
        border: '5px solid #ffffff',
        backgroundColor: `${rgb}`,
        transform: `translate(${position.x}px, ${position.y}px)`,
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        cursor: 'move',
        userSelect: 'none',
        zIndex: '10'
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs, onMounted } from 'vue'
import { colord, extend } from 'colord'
import Moveable from 'moveable'
import mixPlugin from 'colord/plugins/mix'
import { watchDebounced } from '@vueuse/core'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

import {
  harmonies,
  hex2hsv,
  hsv2rgb,
  hsv2xy,
  polar2xy,
  rad2deg,
  xy2polar,
  xy2rgb
} from './utils'
import { ColorWheelProps, Harmony } from './types'

extend([mixPlugin])
gsap.registerPlugin(Draggable)

defineOptions({
  name: 'VueColorWheel',
  inheritAttrs: false
})

const emit = defineEmits<{
  (e: 'update:color', color: string): void
  (e: 'change', colors: Harmony[]): void
}>()

const props = withDefaults(defineProps<ColorWheelProps>(), {
  radius: 120,
  harmony: 'analogous',
  wheel: 'spectrum',
  showBrightness: false,
  color: '#33ffee',
  defaultColor: '#33ffee'
})

const { defaultColor, radius, wheel, showBrightness } = toRefs(props)

const defaultHsv = hex2hsv(defaultColor.value)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)
const handleRef = ref<HTMLDivElement | null>(null)
const position = ref(
  hsv2xy(defaultHsv.hue, defaultHsv.saturation, defaultHsv.value, radius.value)
)
const brightness = ref(0.8)
const ringLinearGradient = computed(() => {
  const tintColorList = colord(defaultColor.value)
    .tints(11)
    .map((c) => c.toRgbString())
  return `linear-gradient(rgb(0, 0, 0), ${tintColorList.slice(
    0,
    1
  )}, ${tintColorList.slice(9, 10)})`
})

const harmonyPosition = computed(() => harmonies[props.harmony])
const isMonochromatic = computed(() => props.harmony === 'monochromatic')
const lightness = computed(() => {
  return showBrightness.value ? brightness.value : 1
})
const rgb = computed(() => {
  const {
    r: red,
    g: green,
    b: blue
  } = xy2rgb(position.value.x, position.value.y, radius.value)
  return `rgb(${red}, ${green}, ${blue})`
})

const harmonyPairs = computed(() => {
  const x = position.value.x - radius.value
  const y = position.value.y - radius.value

  const [r, phi] = xy2polar(x, y)

  const hue = rad2deg(phi)
  const saturation = r / radius.value
  const value = lightness.value
  const rgbColor = hsv2rgb(hue, saturation, value)
  const currentColor = {
    x,
    y,
    h: hue,
    s: saturation,
    v: value,
    rgb: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
  }

  const monochromaticColors = harmonyPosition.value.map((harmonyHue) => {
    const rbgString =
      harmonyHue === 360
        ? colord(currentColor.rgb)
            .tints(5)
            .map((c) => c.toRgbString())[1]
        : colord(currentColor.rgb)
            .shades(5)
            .map((c) => c.toRgbString())[1]
    const hsvObj =
      harmonyHue === 360
        ? colord(currentColor.rgb)
            .tints(5)
            .map((c) => c.toHsv())[1]
        : colord(currentColor.rgb)
            .shades(5)
            .map((c) => c.toHsv())[1]
    return {
      x: position.value.x,
      y: position.value.y,
      h: hsvObj?.h,
      s: hsvObj?.s,
      v: hsvObj?.v,
      rgb: rbgString
    }
  })

  const combinationColors = harmonyPosition.value.map((harmonyHue) => {
    let newHue = (hue + harmonyHue) % 360
    newHue = newHue < 0 ? 360 + newHue : newHue

    const [x, y] = polar2xy(r, newHue * (Math.PI / 180))
    const rgbColor = hsv2rgb(newHue, saturation, value)

    return {
      x: -x + radius.value,
      y: -y + radius.value,
      h: newHue,
      s: saturation,
      v: value,
      rgb: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
    }
  })

  const colors = isMonochromatic.value ? monochromaticColors : combinationColors

  if (isMonochromatic.value) {
    emit('change', [
      ...monochromaticColors.slice(0, 1),
      currentColor,
      ...monochromaticColors.slice(1)
    ])
  } else {
    emit('change', [currentColor, ...combinationColors])
  }

  return colors
})

const drawCircle = (ctx: CanvasRenderingContext2D) => {
  let image = ctx.createImageData(2 * radius.value, 2 * radius.value)
  let data = image.data

  for (let x = -radius.value; x < radius.value; x++) {
    for (let y = -radius.value; y < radius.value; y++) {
      let [r, phi] = xy2polar(x, y)

      let deg = rad2deg(phi)

      // Figure out the starting index of this pixel in the image data array.
      let rowLength = 2 * radius.value
      let adjustedX = x + radius.value // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
      let adjustedY = y + radius.value // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
      let pixelWidth = 4 // each pixel requires 4 slots in the data array
      let index = (adjustedX + adjustedY * rowLength) * pixelWidth

      let hue = deg
      let saturation = r / radius.value
      let value = 1.0

      let { r: red, g: green, b: blue } = hsv2rgb(hue, saturation, value)
      let alpha = 255

      data[index] = red
      data[index + 1] = green
      data[index + 2] = blue
      data[index + 3] = alpha
    }
  }

  ctx.putImageData(image, 0, 0)
}

const drawWheel = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')

  if (!ctx) return

  ctx.canvas.width = radius.value * 2
  ctx.canvas.height = radius.value * 2

  drawCircle(ctx)
}

const makeHandleDraggable = () => {
  const moveable = new Moveable(document.body, {
    target: document.getElementById('handleRef'),
    container: document.getElementById('ColorWheel'),
    draggable: true,
    origin: false,
    keepRatio: true,
    // Resize, Scale Events at edges.
    edge: false,
    throttleDrag: 0,
    throttleResize: 0,
    throttleScale: 0,
    throttleRotate: 0,
    bounds: { left: 0, top: 0, right: 0, bottom: 0, position: 'css' }
  })
  /* draggable */
  moveable.on('drag', ({ target, translate, transform }) => {
    // console.log('onDrag translate', translate)
    // console.log('onDrag transform', transform)
    const [dx, dy] = translate
    let [r, phi] = xy2polar(dx - radius.value, dy - radius.value)
    // Limit radial distance to radius
    r = Math.min(r, radius.value)
    const [x, y] = polar2xy(r, phi)
    const pos = { x: x + radius.value, y: y + radius.value }
    position.value = pos
    const {
      r: red,
      g: green,
      b: blue
    } = xy2rgb(pos.x, pos.y, radius.value, lightness.value)
    // brightness.value = 1
    emit('update:color', colord({ r: red, g: green, b: blue }).toHex())
    // target!.style.transform = transform
  })
}

const makeRingHandleDraggble = () => {
  // const rotationOffset = -180
  const rotationOffset = -90
  const RAD2DEG = 180 / Math.PI
  gsap.set('#ringTrackerRef', { transformOrigin: 'center center', rotate: 30 })
  // gsap.set('#ringTrackerRef', { rotation: 90 })
  const draggable = Draggable.create('#ringTrackerRef', {
    // trigger: '#ringHandleRef',
    type: 'rotation',
    // bounds: { minRotation: 0, maxRotation: 270 },
    // liveSnap: {
    //   rotation: function (value) {
    //     //snap to the closest increment of 10.
    //     return Math.round(value / 10) * 10
    //   }
    // },
    onPressInit: function () {
      if (!this.rotationOrigin) {
        return
      }
      //figure out the angle from the pointer to the rotational origin (in degrees)
      let rotation =
        Math.atan2(
          this.pointerY - this.rotationOrigin.y,
          this.pointerX - this.rotationOrigin.x
        ) *
          RAD2DEG +
        rotationOffset
      if (rotation < 0) {
        rotation += 360
      } else if (rotation > 270) {
        rotation -= 360
      }
      if (rotation) {
        // console.log(rotation)
        const angle = Math.abs(rotation) % 360
        const value = Math.abs(180 - angle) / 180
        brightness.value = value
        // emit('update:color', colord(rgb.value).toHex())
      }
      gsap.set(this.target, { rotation })
    },
    onDrag: function () {
      if (this.rotation) {
        // console.log(this.rotation)
        // const angle = Math.abs(this.rotation) % 360
        // const quarterValue = angle % 90
        // let value = 1
        // if (angle === 90) value = 0
        // if (angle === 180) value = 1
        // if (angle === 270) value = 1
        // if (angle === 0 || angle === 360) value = 0
        // value = Math.abs(90 - quarterValue) / 90
        // console.log(value)
        const angle = Math.abs(this.rotation) % 360
        const value = Math.abs(180 - angle) / 180
        brightness.value = value
        // emit('update:color', colord(rgb.value).toHex())
      }
    }
  })[0]
  // console.log(draggable)
}

const makeWheelDraggable = () => {
  const moveable = new Moveable(document.body, {
    target: document.getElementById('auroraWheelRef'),
    container: document.getElementById('ColorWheel'),
    draggable: true,
    origin: false,
    keepRatio: true,
    // Resize, Scale Events at edges.
    edge: false,
    throttleDrag: 0,
    throttleResize: 0,
    throttleScale: 0,
    throttleRotate: 0,
    bounds: { left: 0, top: 0, right: 0, bottom: 0, position: 'css' }
  })
  /* draggable */
  moveable.on('dragStart', ({ target }) => {
    let e = event as MouseEvent
    if (e?.target === target) {
      const dx = e?.offsetX
      const dy = e?.offsetY
      let [r, phi] = xy2polar(dx - radius.value, dy - radius.value)
      // Limit radial distance to radius
      r = Math.min(r, radius.value)
      const [x, y] = polar2xy(r, phi)
      const pos = { x: x + radius.value, y: y + radius.value }
      position.value = pos
      const {
        r: red,
        g: green,
        b: blue
      } = xy2rgb(pos.x, pos.y, radius.value, lightness.value)
      emit('update:color', colord({ r: red, g: green, b: blue }).toHex())
    }
  })
}

watchDebounced(
  () => [defaultColor.value, radius.value],
  () => {
    if (defaultColor.value) {
      const hsv = hex2hsv(defaultColor.value)
      position.value = hsv2xy(hsv.hue, hsv.saturation, hsv.value, radius.value)
    } else {
      position.value = hsv2xy(0, 1, 1, radius.value)
    }
  },
  {
    deep: true,
    immediate: true,
    debounce: 200
  }
)

onMounted(() => {
  drawWheel()
  makeHandleDraggable()
  makeRingHandleDraggble()
  makeWheelDraggable()
})
</script>

<style>
.moveable-control-box {
  visibility: hidden !important;
}

.vue-color-wheel .aurora-wheel {
  outline: none;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

.vue-color-wheel .aurora-wheel:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(270deg);
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background: radial-gradient(
      circle at 50% 0,
      red,
      rgba(242, 13, 13, 0.8) 10%,
      rgba(230, 26, 26, 0.6) 20%,
      rgba(204, 51, 51, 0.4) 30%,
      rgba(166, 89, 89, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 85.35533905932738% 14.644660940672622%,
      #ffbf00,
      rgba(242, 185, 13, 0.8) 10%,
      rgba(230, 179, 26, 0.6) 20%,
      rgba(204, 166, 51, 0.4) 30%,
      rgba(166, 147, 89, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 100% 50%,
      #80ff00,
      rgba(128, 242, 13, 0.8) 10%,
      rgba(128, 230, 26, 0.6) 20%,
      rgba(128, 204, 51, 0.4) 30%,
      rgba(128, 166, 89, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 85.35533905932738% 85.35533905932738%,
      #00ff40,
      rgba(13, 242, 70, 0.8) 10%,
      rgba(26, 230, 77, 0.6) 20%,
      rgba(51, 204, 89, 0.4) 30%,
      rgba(89, 166, 108, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 50.00000000000001% 100%,
      #0ff,
      rgba(13, 242, 242, 0.8) 10%,
      rgba(26, 230, 230, 0.6) 20%,
      rgba(51, 204, 204, 0.4) 30%,
      rgba(89, 166, 166, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 14.64466094067263% 85.35533905932738%,
      #0040ff,
      rgba(13, 70, 242, 0.8) 10%,
      rgba(26, 77, 230, 0.6) 20%,
      rgba(51, 89, 204, 0.4) 30%,
      rgba(89, 108, 166, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 0 50.00000000000001%,
      #7f00ff,
      rgba(128, 13, 242, 0.8) 10%,
      rgba(128, 26, 230, 0.6) 20%,
      rgba(128, 51, 204, 0.4) 30%,
      rgba(128, 89, 166, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 14.644660940672615% 14.64466094067263%,
      #ff00bf,
      rgba(242, 13, 185, 0.8) 10%,
      rgba(230, 26, 179, 0.6) 20%,
      rgba(204, 51, 166, 0.4) 30%,
      rgba(166, 89, 147, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    );
}
</style>
