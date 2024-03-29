import { harmonies } from './utils'

export type HarmonyColor = {
  hue: number
  saturation: number
  value: number
}

export type ColorWheelProps = {
  radius: number
  harmony: HarmonyType
  wheel: WheelType
  showBrightness: boolean
  color?: string
  defaultColor?: string
}

export type Harmony = {
  x: number
  y: number
  h: number
  s: number
  v: number
  rgb: string
}

export type HarmonyType = keyof typeof harmonies

export type WheelType = 'aurora' | 'spectrum'
