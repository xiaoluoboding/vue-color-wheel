import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetWebFonts
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetWebFonts({
      fonts: {
        sans: 'Plus Jakarta Sans',
        serif: 'Belanosima',
        mono: 'Space Mono'
      }
    })
  ],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'text-primary': 'text-neutral-900 dark:text-neutral-50',
      'text-neon':
        'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:to-emerald-300 '
    }
  ]
})
