import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteImagemin from "vite-plugin-imagemin";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 需要放在 uni() 之前
    Components({
      // 自动加载组件的目录配置,默认的为 'src/components'
      dirs: ["src/components/**"],
      extensions: ["vue"], // 组件的有效文件扩展名
      // 自定义组件的解析器
      // 生成`components.d.ts`文件，全局组件的ts的全局声明,
      // 也接受自定义文件名的路径
      // 如果安装了typescript包default: true
      dts: "components.d.ts",
    }),
    uni(),
    AutoImport({
      dts: "auto-imports.d.ts",
      include: [
        /\.[tj]sx?$/, // ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ["vue", "pinia"], // 自动导入vue、vue-router、pinia 内的部分api
    }),
  ],
  build: {
    // 生产环境去除 console
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 构建输出目录
    outDir: "dist/build/h5",
    // 静态资源目录
    assetsDir: "static",
    // 打包时生成 sourcemap
    sourcemap: false,
    // 自定义 rollup 配置
    rollupOptions: {
      output: {
        // 确保每个 chunk 都有一个唯一的文件名
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
    //assetsInlineLimit: 4096 * 1024, // 将小于 4MB 的图片转换成 Base64
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style/variables.scss" as vars;`,
      },
    },
  },
  server: {
    proxy: {
      // 配置代理规则
      "/api/": {
        // 目标服务器地址，需替换为实际的后端接口地址
        target: "https://ktapp.kangtetuina.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
