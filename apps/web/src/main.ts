import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from './plugins/i18n';
import { router } from './router';
import 'element-plus/dist/index.css';
import './styles/main.css';

createApp(App).use(createPinia()).use(router).use(i18n).use(ElementPlus).mount('#app');
