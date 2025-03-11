// 日本历史时间轴组件库

// 导入组件
import DetailModal from './components/DetailModal.vue';
import LightboxGallery from './components/LightboxGallery.vue';

// 导出组件
export {
  DetailModal,
  LightboxGallery
};

// 批量安装插件
const JapanHistoryTimelineComponents = {
  install(app) {
    app.component('detail-modal', DetailModal);
    app.component('lightbox-gallery', LightboxGallery);
  }
};

export default JapanHistoryTimelineComponents; 