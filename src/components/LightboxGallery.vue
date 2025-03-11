<!-- 
  日本历史时间轴 - 图片灯箱组件
  用于全屏展示图片，支持多图浏览和键盘导航
-->

<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]" @click="$emit('close')">
      <!-- 关闭按钮 -->
      <button @click.stop="$emit('close')" class="absolute top-6 right-6 text-white hover:text-gray-300 text-2xl p-2 rounded-full transition-all duration-200 hover:bg-white/10 focus:outline-none z-10 group">
        <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
      </button>
      
      <!-- 上一张按钮 -->
      <button 
        @click.stop="$emit('prev')" 
        class="absolute left-6 text-white hover:text-gray-300 text-4xl p-4 rounded-full transition-all duration-200 hover:bg-white/10 focus:outline-none"
        :class="{'opacity-50 cursor-not-allowed': images.length <= 1}"
        :disabled="images.length <= 1"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <!-- 下一张按钮 -->
      <button 
        @click.stop="$emit('next')" 
        class="absolute right-6 text-white hover:text-gray-300 text-4xl p-4 rounded-full transition-all duration-200 hover:bg-white/10 focus:outline-none"
        :class="{'opacity-50 cursor-not-allowed': images.length <= 1}"
        :disabled="images.length <= 1"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
      
      <!-- 图片容器 -->
      <div class="transform transition-transform duration-300" :class="{'scale-95': isChanging}">
        <img 
          :src="currentImage ? currentImage.url : ''" 
          :alt="currentImage ? currentImage.caption : ''"
          class="max-w-[90%] max-h-[80vh] object-contain shadow-2xl"
          @load="isChanging = false"
        />
      </div>
      
      <!-- 图片信息 -->
      <div class="absolute bottom-8 left-0 right-0 text-center text-white px-6">
        <p class="text-lg font-medium mb-1">{{ currentImage ? currentImage.caption : '' }}</p>
        <p class="text-sm mt-2 opacity-80" v-if="currentImage && images.length > 1">
          {{ currentIndex + 1 }} / {{ images.length }}
        </p>
      </div>
      
      <!-- 缩略图导航 (可选) -->
      <div v-if="images.length > 1" class="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex justify-center space-x-2 overflow-x-auto">
        <button 
          v-for="(image, index) in images" 
          :key="index"
          @click.stop="$emit('select', index)"
          class="w-16 h-16 rounded-md overflow-hidden transition-all duration-200 focus:outline-none border-2 border-transparent"
          :class="{'border-white': currentIndex === index}"
        >
          <img 
            :src="image.url" 
            :alt="image.caption || ''"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LightboxGallery',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ['close', 'prev', 'next', 'select'],
  data() {
    return {
      isChanging: false
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || null;
    }
  },
  methods: {
    handleImageError(e) {
      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4=";
    }
  },
  watch: {
    currentIndex() {
      // 图片切换时添加过渡效果
      this.isChanging = true;
    },
    visible(newVal) {
      if (newVal) {
        // 当灯箱显示时，添加键盘事件监听
        this.handleKeydown = (e) => {
          if (e.key === 'Escape') {
            this.$emit('close');
          } else if (e.key === 'ArrowLeft') {
            this.$emit('prev');
          } else if (e.key === 'ArrowRight') {
            this.$emit('next');
          }
        };
        
        document.addEventListener('keydown', this.handleKeydown);
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
      } else {
        // 当灯箱隐藏时，移除键盘事件监听
        document.removeEventListener('keydown', this.handleKeydown);
        
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
      }
    }
  },
  beforeUnmount() {
    // 清理可能的键盘事件监听
    if (this.handleKeydown) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    
    // 确保恢复背景滚动
    document.body.style.overflow = 'auto';
  }
}
</script>

<style scoped>
.fade-enter-active, 
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, 
.fade-leave-to {
  opacity: 0;
}
</style> 