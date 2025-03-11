<!-- 
  日本历史时间轴 - 详情模态框组件
  用于显示历史事件的详细信息，包括描述、人物、图片、相关事件等
-->

<template>
  <transition name="modal-fade">
    <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4" @click="closeModal">
      <div class="flex items-center justify-center min-h-full">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden" @click.stop>
          <!-- 关闭按钮 -->
          <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 focus:outline-none z-10 group">
            <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- 标题区域 -->
          <div class="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 z-10">
            <!-- 时代标签移到顶部 -->
            <div class="flex items-center justify-between mb-2">
              <span 
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-medium text-white',
                  getPeriodClass(event.period)
                ]"
              >
                {{ getPeriodName(event.period) }}
              </span>
              <span class="text-base text-gray-500 font-medium">{{ event.year }}</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">
              {{ event.title }}
            </h2>
          </div>

          <!-- 内容区域 -->
          <div class="overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
            <!-- 描述部分 -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {{ event.fullDescription || event.description }}
              </p>
            </div>

            <!-- 历史人物部分 - 减少高度 -->
            <div v-if="event.people && event.people.length > 0" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                历史人物
              </h3>
              <div class="flex overflow-x-auto pb-2 gap-3 custom-scrollbar">
                <div 
                  v-for="(person, index) in event.people" 
                  :key="index"
                  class="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex items-center hover:shadow transition-all duration-300 min-w-[250px] flex-shrink-0"
                >
                  <img 
                    :src="person.image" 
                    :alt="person.name"
                    class="w-12 h-12 rounded-full object-cover mr-3 border border-gray-100"
                    @error="handleImageError"
                  >
                  <div>
                    <h4 class="font-bold text-gray-800">{{ person.name }}</h4>
                    <p class="text-xs text-gray-600 line-clamp-2">{{ person.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 图片部分 - 水平切换 -->
            <div v-if="hasImages" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                历史图片
              </h3>
              <div class="relative">
                <!-- 当前图片 -->
                <div class="relative rounded-lg overflow-hidden shadow-sm h-64 cursor-pointer" @click="$emit('open-lightbox', currentImageIndex)">
                  <img 
                    :src="currentImageSrc" 
                    :alt="currentImageCaption || '历史图片'"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  >
                  <div v-if="currentImageCaption" class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                    {{ currentImageCaption }}
                  </div>
                </div>
                
                <!-- 左右切换按钮 -->
                <button 
                  v-if="hasMultipleImages" 
                  @click.stop="prevImage"
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-10"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  v-if="hasMultipleImages" 
                  @click.stop="nextImage"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-10"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
                
                <!-- 图片指示器 -->
                <div v-if="hasMultipleImages" class="flex justify-center mt-2 gap-1">
                  <button 
                    v-for="(_, index) in imageArray" 
                    :key="index"
                    @click="currentImageIndex = index"
                    :class="[
                      'w-2 h-2 rounded-full transition-all',
                      currentImageIndex === index ? 'bg-japan-red scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    ]"
                  ></button>
                </div>
              </div>
            </div>

            <!-- 详细内容部分 -->
            <div v-if="event.sections && event.sections.length > 0" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                详细内容
              </h3>
              <div class="space-y-4">
                <div 
                  v-for="(section, index) in event.sections"
                  :key="index"
                  class="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-all duration-300"
                >
                  <h4 class="font-bold text-gray-800 mb-2 pb-2 border-b border-gray-100">{{ section.title }}</h4>
                  <p class="text-gray-700 leading-relaxed">{{ section.content }}</p>
                </div>
              </div>
            </div>

            <!-- 重要事件部分 -->
            <div v-if="event.events && event.events.length > 0" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                重要事件
              </h3>
              <div class="space-y-3">
                <div 
                  v-for="(subEvent, index) in event.events"
                  :key="index"
                  class="flex border-l-3 border-blue-500 pl-3 py-2 hover:bg-gray-50 transition-colors duration-200 rounded-r"
                >
                  <div class="w-24 flex-shrink-0 font-medium text-gray-700">{{ subEvent.year }}</div>
                  <div>
                    <h4 class="font-bold text-gray-800">{{ subEvent.title }}</h4>
                    <p class="text-gray-600 text-sm mt-1">{{ subEvent.description }}</p>
                    <!-- 标签 -->
                    <div v-if="subEvent.tags && subEvent.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                      <span 
                        v-for="(tag, tagIndex) in subEvent.tags" 
                        :key="tagIndex"
                        class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 书籍推荐部分 -->
            <div v-if="event.recommendations?.books && event.recommendations.books.length > 0" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                推荐书籍
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  v-for="(book, index) in event.recommendations.books"
                  :key="index"
                  class="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-gray-800">{{ book.title }}</h4>
                    <a 
                      v-if="book.link"
                      :href="book.link"
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">作者：{{ book.author }}</p>
                  <p class="text-sm text-gray-700 mt-2 line-clamp-2">{{ book.description }}</p>
                </div>
              </div>
            </div>

            <!-- 电影推荐部分 -->
            <div v-if="event.recommendations?.movies && event.recommendations.movies.length > 0" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                推荐影视
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  v-for="(movie, index) in event.recommendations.movies"
                  :key="index"
                  class="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-gray-800">{{ movie.title }}</h4>
                    <a 
                      v-if="movie.link"
                      :href="movie.link"
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">导演：{{ movie.director }}</p>
                  <p class="text-sm text-gray-700 mt-2 line-clamp-2">{{ movie.description }}</p>
                </div>
              </div>
            </div>

            <!-- 相关链接部分 -->
            <div v-if="event.links && event.links.length > 0" class="bg-white">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <span class="w-1 h-5 bg-japan-red rounded-full mr-2"></span>
                相关链接
              </h3>
              <div class="flex flex-wrap gap-2">
                <a 
                  v-for="(link, index) in event.links"
                  :key="index"
                  :href="link.url"
                  target="_blank"
                  class="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg transition-all duration-200 text-sm flex items-center"
                >
                  <i class="fas fa-external-link-alt mr-2 text-xs"></i>
                  {{ link.text }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DetailModal',
  props: {
    event: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'open-lightbox'],
  data() {
    return {
      currentImageIndex: 0
    };
  },
  computed: {
    hasImages() {
      return (this.event.images && this.event.images.length > 0) || this.event.image;
    },
    hasMultipleImages() {
      return this.imageArray.length > 1;
    },
    imageArray() {
      if (this.event.images && this.event.images.length > 0) {
        return this.event.images;
      } else if (this.event.image) {
        return [{url: this.event.image, caption: this.event.title}];
      }
      return [];
    },
    currentImageSrc() {
      if (this.imageArray.length === 0) return '';
      return this.imageArray[this.currentImageIndex]?.url || '';
    },
    currentImageCaption() {
      if (this.imageArray.length === 0) return '';
      return this.imageArray[this.currentImageIndex]?.caption || '';
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
      // 组件内部已处理滚动，此处不需要重复处理
    },
    handleImageError(e) {
      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4=";
      e.target.classList.add('image-placeholder');
    },
    getPeriodName(period) {
      const periodMap = {
        'ancient': '上古时代',
        'classical': '古典时代',
        'medieval': '中世纪',
        'edo': '江户时代',
        'modern': '近现代',
        'contemporary': '当代'
      };
      return periodMap[period] || '未知时期';
    },
    getPeriodClass(period) {
      const classMap = {
        'ancient': 'bg-amber-600',
        'classical': 'bg-emerald-600',
        'medieval': 'bg-indigo-600',
        'edo': 'bg-purple-600',
        'modern': 'bg-blue-600',
        'contemporary': 'bg-rose-600'
      };
      return classMap[period] || 'bg-gray-600';
    },
    nextImage() {
      if (this.imageArray.length <= 1) return;
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imageArray.length;
    },
    prevImage() {
      if (this.imageArray.length <= 1) return;
      this.currentImageIndex = (this.currentImageIndex - 1 + this.imageArray.length) % this.imageArray.length;
    }
  },
  mounted() {
    // 监听ESC键关闭模态框
    this.handleEsc = (e) => {
      if (e.key === 'Escape' && this.visible) {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', this.handleEsc);
    
    // 禁止背景滚动
    if (this.visible) {
      document.body.classList.add('overflow-hidden');
      document.body.style.overflow = 'hidden';
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 模态框显示时禁止背景滚动
        document.body.classList.add('overflow-hidden');
        document.body.style.overflow = 'hidden';
      } else {
        // 模态框隐藏时恢复背景滚动
        document.body.classList.remove('overflow-hidden');
        document.body.style.overflow = 'auto';
      }
    }
  },
  beforeUnmount() {
    // 清理事件监听器和样式
    document.removeEventListener('keydown', this.handleEsc);
    document.body.classList.remove('overflow-hidden');
    document.body.style.overflow = 'auto';
  }
}
</script>

<style scoped>
/* 模态框动画 */
.modal-fade-enter-active, 
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-fade-enter-from, 
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9f9f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

/* 图片占位符样式 */
.image-placeholder {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  object-fit: contain !important;
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 边框宽度 */
.border-l-3 {
  border-left-width: 3px;
}
</style> 