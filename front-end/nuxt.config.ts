import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify']
  },
  plugins: ['~/plugins/vuetify', '~/plugins/axios']
})


