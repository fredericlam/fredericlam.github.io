import { createApp } from 'vue'
import Router from './router'
import App from './App.vue'
import Store from './store'

const app = createApp(App)
	.use(Router)
	.use(Store)
	.mount('#app')
