// 日本历史时间轴主应用

import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';

// 检查数据是否加载
if (!window.timelineData || !Array.isArray(window.timelineData)) {
    console.warn('警告: timelineData未正确加载或为空');
}

const app = createApp(App);
app.mount('#app'); 