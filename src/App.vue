<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DetailModal from './components/DetailModal.vue'
import LightboxGallery from './components/LightboxGallery.vue'

// 状态
const timelineData = ref([])
const currentPeriod = ref('all')
const searchQuery = ref('')
const modalVisible = ref(false)
const selectedEvent = ref(null)
const showBackToTop = ref(false)
const showLightbox = ref(false)
const currentLightboxIndex = ref(0)
const currentLightboxImage = ref(null)
const lightboxImages = ref([])

// 时期选项
const periods = [
  { value: 'all', label: '全部时期' },
  { value: 'ancient', label: '上古时代' },
  { value: 'classical', label: '古典时代' },
  { value: 'medieval', label: '中世纪' },
  { value: 'edo', label: '江户时代' },
  { value: 'modern', label: '近现代' },
  { value: 'contemporary', label: '当代' }
]

// 筛选后的数据
const filteredEvents = computed(() => {
  let result = [...timelineData.value]
  
  // 按时期筛选
  if (currentPeriod.value !== 'all') {
    result = result.filter(item => item.period === currentPeriod.value)
  }
  
  // 按搜索词筛选
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.year.toLowerCase().includes(query) ||
      (item.fullDescription && item.fullDescription.toLowerCase().includes(query))
    )
  }
  
  return result
})

// 方法
const filterByPeriod = (period) => {
  currentPeriod.value = period
}

const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

const resetFilters = () => {
  currentPeriod.value = 'all'
  searchQuery.value = ''
}

const getPeriodName = (period) => {
  const periodMap = {
    'ancient': '上古时代',
    'classical': '古典时代',
    'medieval': '中世纪',
    'edo': '江户时代',
    'modern': '近现代',
    'contemporary': '当代'
  }
  return periodMap[period] || '未知时期'
}

const getPeriodClass = (period) => {
  const classMap = {
    'ancient': 'bg-amber-600',
    'classical': 'bg-emerald-600',
    'medieval': 'bg-indigo-600',
    'edo': 'bg-purple-600',
    'modern': 'bg-blue-600',
    'contemporary': 'bg-rose-600'
  }
  return classMap[period] || 'bg-gray-600'
}

const showModal = (item) => {
  selectedEvent.value = item
  modalVisible.value = true
  
  // 保存图片数组用于灯箱
  if (item.images && item.images.length > 0) {
    lightboxImages.value = item.images
  } else if (item.image) {
    // 兼容旧格式
    lightboxImages.value = [{url: item.image, caption: item.title}]
  }
}

const closeModal = () => {
  modalVisible.value = false
}

const handleImageError = (e) => {
  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4="
  e.target.classList.add('image-placeholder')
}

const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const openLightbox = (index) => {
  if (lightboxImages.value && lightboxImages.value.length > 0) {
    currentLightboxIndex.value = index
    currentLightboxImage.value = lightboxImages.value[index]
    showLightbox.value = true
  }
}

const closeLightbox = () => {
  showLightbox.value = false
}

const prevImage = () => {
  if (lightboxImages.value && lightboxImages.value.length > 0) {
    currentLightboxIndex.value = (currentLightboxIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length
    currentLightboxImage.value = lightboxImages.value[currentLightboxIndex.value]
  }
}

const nextImage = () => {
  if (lightboxImages.value && lightboxImages.value.length > 0) {
    currentLightboxIndex.value = (currentLightboxIndex.value + 1) % lightboxImages.value.length
    currentLightboxImage.value = lightboxImages.value[currentLightboxIndex.value]
  }
}

// 生命周期
onMounted(() => {
  // 加载数据
  if (window.timelineData && Array.isArray(window.timelineData)) {
    timelineData.value = window.timelineData
    console.log('数据加载成功，共加载 ' + timelineData.value.length + ' 条历史记录')
  } else {
    console.error('错误: timelineData未正确加载或为空')
  }
  
  // 监听滚动事件
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页眉 -->
    <header class="bg-gradient-to-r from-japan-red to-japan-dark-red text-white py-12 shadow-lg">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-3">日本历史发展时间轴</h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">从远古时代到现代的日本历史演变</p>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- 筛选器 -->
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold mb-4">按时期筛选</h2>
        <div class="flex flex-wrap justify-center gap-2">
          <button 
            v-for="period in periods" 
            :key="period.value"
            @click="filterByPeriod(period.value)"
            :class="[
              'px-4 py-2 rounded-full transition-all duration-200 font-medium',
              currentPeriod === period.value 
                ? 'bg-japan-red text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="flex justify-center mb-8">
        <div class="relative w-full max-w-md">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="搜索历史事件..." 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-japan-red focus:border-transparent shadow-sm"
          >
          <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-japan-red">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- 时间轴 -->
      <div class="relative py-8">
        <!-- 时间轴中心线 -->
        <div class="timeline-line"></div>
        
        <!-- 时间轴项目 -->
        <div v-if="filteredEvents.length > 0" class="relative">
          <div 
            v-for="(item, index) in filteredEvents" 
            :key="item.id"
            class="relative mb-6"
            :style="{
              'margin-top': index > 0 ? '-2rem' : '0'
            }"
          >
            <div 
              :class="[
                'flex items-center relative',
                index % 2 === 0 ? 'justify-start' : 'justify-end',
                'md:px-4'
              ]"
            >
              <!-- 时间轴点 -->
              <div 
                class="timeline-dot"
                :class="getPeriodClass(item.period)"
              ></div>
              
              <!-- 内容卡片 -->
              <div 
                class="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-[calc(50%-2rem)] cursor-pointer hover:shadow-lg transition-shadow duration-300"
                :class="[
                  index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto',
                  'animate-slide-in-' + (index % 2 === 0 ? 'left' : 'right')
                ]"
                @click="showModal(item)"
              >
                <!-- 卡片内容 -->
                <div class="p-4">
                  <div class="flex items-start justify-between mb-2">
                    <span 
                      :class="[
                        'inline-block px-2 py-1 rounded-full text-xs font-medium text-white',
                        getPeriodClass(item.period)
                      ]"
                    >
                      {{ getPeriodName(item.period) }}
                    </span>
                    <span class="text-sm text-gray-500">{{ item.year }}</span>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 mb-2">{{ item.title }}</h3>
                  <p class="text-gray-600 text-sm line-clamp-2">{{ item.description }}</p>
                  
                  <!-- 预览图片 -->
                  <div v-if="item.image || (item.images && item.images.length > 0)" class="mt-3">
                    <img 
                      :src="item.image || item.images[0].url" 
                      :alt="item.title"
                      class="w-full h-48 object-cover rounded-md"
                      @error="handleImageError"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 无数据提示 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">没有找到匹配的历史事件</p>
          <button 
            @click="resetFilters"
            class="mt-4 px-4 py-2 bg-japan-red text-white rounded-lg hover:bg-japan-dark-red transition-colors duration-200"
          >
            重置筛选器
          </button>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <transition name="fade">
      <button 
        v-show="showBackToTop"
        @click="scrollToTop"
        class="back-to-top"
      >
        <i class="fas fa-arrow-up"></i>
      </button>
    </transition>

    <!-- 详情模态框 -->
    <DetailModal 
      :event="selectedEvent"
      :visible="modalVisible"
      @close="closeModal"
      @open-lightbox="openLightbox"
    />

    <!-- 灯箱画廊 -->
    <LightboxGallery
      :visible="showLightbox"
      :images="lightboxImages"
      :current-index="currentLightboxIndex"
      @close="closeLightbox"
      @prev="prevImage"
      @next="nextImage"
    />
  </div>
</template>

<style>
/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 时间轴线 */
.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  background: linear-gradient(to bottom, #D70040, #8B0000);
  height: 100%;
  z-index: 1;
}
@media (max-width: 768px) {
  .timeline-line {
    left: 30px;
  }
}

/* 时间轴点装饰 */
.timeline-dot {
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  z-index: 2;
}
.timeline-dot::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: currentColor;
}
.timeline-dot::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.3;
}
@media (max-width: 768px) {
  .timeline-dot {
    left: 30px;
    margin-left: -10px;
  }
}

/* 返回顶部按钮 */
.back-to-top {
  @apply fixed bottom-6 right-6 bg-japan-red text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 z-30;
}
.back-to-top:hover {
  @apply bg-japan-dark-red transform -translate-y-1;
}

/* 时间轴卡片动画 */
@keyframes slide-in-left {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-right {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}
.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}
</style> 