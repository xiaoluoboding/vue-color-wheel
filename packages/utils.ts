import { colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'

extend([mixPlugin])

export const harmonies = {
  complementary: [180],
  analogous: [-30, 30],
  split: [-150, 150],
  triad: [120, 240],
  tetradic: [60, 180, 240],
  square: [90, 180, 270],
  compound: [30, 150, 180],
  // doubleAnalogous: [-60, -30, 30, 60]
  monochromatic: [360, 720],
  doubleSplit: [-150, -30, 30, 150]
} as const

export const xy2polar = (x: number, y: number): [number, number] => {
  let r = Math.sqrt(x * x + y * y)
  let phi = Math.atan2(y, x)
  return [r, phi]
}

export const polar2xy = (r: number, phi: number): [number, number] => {
  let x = r * Math.cos(phi)
  let y = r * Math.sin(phi)
  return [x, y]
}

export const rad2deg = (rad: number) => {
  return ((rad + Math.PI) / (2 * Math.PI)) * 360
}

export const deg2rad = (hue: number) => {
  return hue * (Math.PI / 180)
}

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
// See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
export const hsv2rgb = (hue: number, saturation: number, value: number) => {
  const hsv = {
    h: hue,
    s: saturation * 100,
    v: value * 100
  }

  return value === 1
    ? colord(hsv).toRgb()
    : colord(hsv).mix('#ffffff', value).toRgb()
}

export const hex2hsv = (color: string) => {
  const { h, s, v } = colord(color).toHsv()
  return {
    hue: h,
    saturation: s / 100,
    value: v / 100
  }
}

export const xy2rgb = (
  x: number,
  y: number,
  radius: number,
  brightness = 1
) => {
  x -= radius
  y -= radius

  const [r, phi] = xy2polar(x, y)

  const hue = rad2deg(phi)
  const saturation = (r / radius) * 100
  const value = brightness * 100

  const hsv = {
    h: hue,
    s: saturation,
    v: value
  }

  return colord(hsv).toRgb()
}

export const hsv2xy = (
  hue: number,
  saturation: number,
  value: number,
  radius: number
) => {
  const adjustedHue = hue - 180
  const [r, phi] = polar2xy(radius * saturation, deg2rad(adjustedHue))
  return {
    x: r + radius,
    y: phi + radius
  }
}
