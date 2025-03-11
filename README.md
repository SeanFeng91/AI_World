# 日本历史发展时间轴

这是一个交互式的日本历史时间轴网页应用，从远古时代到现代，全面展示日本历史的发展脉络。

## 功能特点

- **详尽的历史内容**：包含从绳文时代到令和时代的完整日本历史，每个时期都有详细介绍。
- **时期分类**：可按上古时代、古典时代、中世纪、江户时代、近现代和当代进行筛选。
- **搜索功能**：支持关键词搜索，快速找到感兴趣的历史事件。
- **分页浏览**：时间轴内容分页显示，避免信息过载。
- **详情查看**：点击"查看详情"可打开模态框，查看更详细的历史介绍、相关图片和外部链接。
- **响应式设计**：适配各种屏幕尺寸，从手机到桌面设备都有良好体验。
- **键盘导航**：支持使用键盘箭头键和ESC键进行导航和操作。
- **平滑动画**：时间轴项目加载和翻页时有平滑的动画效果。

## 使用方法

1. 打开`index.html`文件在浏览器中查看时间轴。
2. 使用顶部的筛选按钮选择特定历史时期。
3. 使用搜索框搜索特定的历史事件或关键词。
4. 点击时间轴项目上的"查看详情"按钮，查看更详细的历史信息。
5. 使用底部的翻页按钮浏览更多历史事件。

## 技术实现

- 纯原生JavaScript实现，无需任何框架
- CSS3动画和过渡效果
- 响应式设计，适配各种设备
- 模块化的代码结构，便于维护和扩展

## 数据来源

时间轴中的历史数据主要参考自维基百科和其他历史资料，图片来源于维基共享资源。

## 未来计划

- 添加更多历史事件和细节
- 增加时间轴可视化效果
- 支持多语言切换
- 添加更多互动元素和学习功能

## 许可证

MIT许可证

## 组件库使用指南

本项目现在提供了独立的Vue组件，可以单独引入使用，提高代码的复用性和可维护性。

### 组件列表

#### DetailModal - 详情模态框组件

用于显示历史事件的详细信息，包括描述、人物、图片、相关事件等。

```javascript
// 单独引入
import { DetailModal } from '@/src';

// 在Vue组件中使用
export default {
  components: {
    DetailModal
  }
}
```

示例：
```html
<detail-modal 
  :event="selectedEvent" 
  :visible="modalVisible"
  @close="closeModal"
  @open-lightbox="openLightbox"
></detail-modal>
```

Props:
- `event`: Object (必须) - 要显示的历史事件对象
- `visible`: Boolean - 控制模态框的显示/隐藏

事件:
- `close` - 当用户关闭模态框时触发
- `open-lightbox` - 当用户点击图片打开灯箱时触发，参数为图片索引

#### LightboxGallery - 图片灯箱组件

用于全屏展示图片，支持多图浏览和键盘导航。

```javascript
// 单独引入
import { LightboxGallery } from '@/src';

// 在Vue组件中使用
export default {
  components: {
    LightboxGallery
  }
}
```

示例：
```html
<lightbox-gallery 
  :images="lightboxImages"
  :current-index="currentLightboxIndex"
  :visible="showLightbox"
  @close="closeLightbox"
  @prev="prevImage"
  @next="nextImage"
  @select="selectImage"
></lightbox-gallery>
```

Props:
- `images`: Array - 图片数组，每个项目应包含 `url` 和 `caption` 属性
- `currentIndex`: Number - 当前显示的图片索引
- `visible`: Boolean - 控制灯箱的显示/隐藏

事件:
- `close` - 当用户关闭灯箱时触发
- `prev` - 当用户请求查看上一张图片时触发
- `next` - 当用户请求查看下一张图片时触发
- `select` - 当用户选择特定图片时触发，参数为图片索引

### 批量注册所有组件

如果你想一次性注册所有组件，可以使用插件模式：

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import JapanHistoryTimelineComponents from '@/src';

const app = createApp(App);
app.use(JapanHistoryTimelineComponents);
app.mount('#app');
``` 