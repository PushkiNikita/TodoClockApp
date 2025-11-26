export default defineNuxtConfig({
  devtools: { enabled: true },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})