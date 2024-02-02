import { defineConfig, UserConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import CleanCSS from 'clean-css'

const cleanCssInstance = new CleanCSS({})
function minify(code: string) {
  return cleanCssInstance.minify(code).styles
}

let cssCodeStr = ''

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let userConfig: UserConfig = {}

  const commonPlugins = [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: ''
        })
      ]
    }),
    Icons()
  ]

  if (mode === 'lib') {
    userConfig.build = {
      lib: {
        entry: resolve(__dirname, 'packages/index.ts'),
        name: 'VueLibraryStarter',
        fileName: 'vue-library-starter'
      },
      outDir: 'lib',
      emptyOutDir: true,
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        external: ['vue'],
        output: [
          {
            format: 'cjs',
            entryFileNames: `vue-library-starter.cjs`
          },
          {
            format: 'es',
            entryFileNames: `vue-library-starter.js`,
            preserveModules: false
          }
        ]
      }
    }
    userConfig.plugins = [
      ...commonPlugins,
      {
        name: 'inline-css',
        transform(code, id) {
          const isCSS = (path: string) => /\.css$/.test(path)
          if (!isCSS(id)) return

          const cssCode = minify(code)
          cssCodeStr = cssCode
          return {
            code: '',
            map: { mappings: '' }
          }
        },
        renderChunk(code, { isEntry }) {
          if (!isEntry) return

          return {
            code: `\
            function __insertCSSVueSonner(code) {
              if (!code || typeof document == 'undefined') return
              let head = document.head || document.getElementsByTagName('head')[0]
              let style = document.createElement('style')
              style.type = 'text/css'
              head.appendChild(style)
              ;style.styleSheet ? (style.styleSheet.cssText = code) : style.appendChild(document.createTextNode(code))
            }\n
            __insertCSSVueSonner(${JSON.stringify(cssCodeStr)})
            \n ${code}`,
            map: { mappings: '' }
          }
        }
      }
    ]
  }

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, '/packages'),
        '~': resolve(__dirname, '/src')
      }
    },
    plugins: [...commonPlugins],
    ...userConfig
  }
})
