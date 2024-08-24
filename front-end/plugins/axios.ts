import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
    axios.defaults.baseURL = 'http://localhost:3000/api'
    nuxtApp.provide('axios', axios)
})
