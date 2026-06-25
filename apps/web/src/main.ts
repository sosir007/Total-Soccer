import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from './plugins/i18n';
import { router } from './router';
import 'element-plus/dist/index.css';
import './assets/iconfont/iconfont.css';
import './styles/main.scss';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app');
