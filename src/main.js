// 日本历史时间轴主应用

import { createApp, ref, computed, onMounted, onUnmounted } from 'vue';
import DetailModal from './components/DetailModal.vue';
import LightboxGallery from './components/LightboxGallery.vue';

// 确保数据加载
if (typeof window.timelineData === 'undefined') {
    console.error('警告: timelineData未定义');
    window.timelineData = [];
}

// 创建Vue应用
const app = createApp({
    components: {
        'detail-modal': DetailModal,
        'lightbox-gallery': LightboxGallery
    },
    setup() {
        // 状态
        const timelineData = ref([]);
        const currentPeriod = ref('all');
        const searchQuery = ref('');
        const modalVisible = ref(false);
        const selectedEvent = ref(null);
        const showBackToTop = ref(false);
        const showLightbox = ref(false);
        const currentLightboxIndex = ref(0);
        const currentLightboxImage = ref(null);
        const lightboxImages = ref([]);
        
        // 时期选项
        const periods = [
            { value: 'all', label: '全部时期' },
            { value: 'ancient', label: '上古时代' },
            { value: 'classical', label: '古典时代' },
            { value: 'medieval', label: '中世纪' },
            { value: 'edo', label: '江户时代' },
            { value: 'modern', label: '近现代' },
            { value: 'contemporary', label: '当代' }
        ];
        
        // 筛选后的数据
        const filteredEvents = computed(() => {
            let result = [...timelineData.value];
            
            // 按时期筛选
            if (currentPeriod.value !== 'all') {
                result = result.filter(item => item.period === currentPeriod.value);
            }
            
            // 按搜索词筛选
            if (searchQuery.value.trim() !== '') {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.year.toLowerCase().includes(query) ||
                    (item.fullDescription && item.fullDescription.toLowerCase().includes(query))
                );
            }
            
            return result;
        });
        
        // 方法
        function filterByPeriod(period) {
            currentPeriod.value = period;
        }
        
        function handleSearch() {
            // 搜索逻辑已通过计算属性实现
        }
        
        function resetFilters() {
            currentPeriod.value = 'all';
            searchQuery.value = '';
        }
        
        function getPeriodName(period) {
            const periodMap = {
                'ancient': '上古时代',
                'classical': '古典时代',
                'medieval': '中世纪',
                'edo': '江户时代',
                'modern': '近现代',
                'contemporary': '当代'
            };
            return periodMap[period] || '未知时期';
        }
        
        function getPeriodClass(period) {
            const classMap = {
                'ancient': 'bg-amber-600',
                'classical': 'bg-emerald-600',
                'medieval': 'bg-indigo-600',
                'edo': 'bg-purple-600',
                'modern': 'bg-blue-600',
                'contemporary': 'bg-rose-600'
            };
            return classMap[period] || 'bg-gray-600';
        }
        
        function showModal(item) {
            selectedEvent.value = item;
            modalVisible.value = true;
            
            // 保存图片数组用于灯箱
            if (item.images && item.images.length > 0) {
                lightboxImages.value = item.images;
            } else if (item.image) {
                // 兼容旧格式
                lightboxImages.value = [{url: item.image, caption: item.title}];
            }
        }
        
        function closeModal() {
            modalVisible.value = false;
            // 组件内部已处理滚动，此处不需要重复处理
        }
        
        function handleImageError(e) {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4=";
            e.target.classList.add('image-placeholder');
        }
        
        function scrollToTop(smooth = true) {
            window.scrollTo({
                top: 0,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
        
        function handleScroll() {
            showBackToTop.value = window.scrollY > 300;
        }
        
        function openLightbox(index) {
            if (lightboxImages.value && lightboxImages.value.length > 0) {
                currentLightboxIndex.value = index;
                currentLightboxImage.value = lightboxImages.value[index];
                showLightbox.value = true;
                // 组件内部已处理滚动，此处不需要重复处理
            }
        }
        
        function closeLightbox() {
            showLightbox.value = false;
            // 组件内部已处理滚动，此处不需要重复处理
        }
        
        function prevImage() {
            if (lightboxImages.value && lightboxImages.value.length > 0) {
                currentLightboxIndex.value = (currentLightboxIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length;
                currentLightboxImage.value = lightboxImages.value[currentLightboxIndex.value];
            }
        }
        
        function nextImage() {
            if (lightboxImages.value && lightboxImages.value.length > 0) {
                currentLightboxIndex.value = (currentLightboxIndex.value + 1) % lightboxImages.value.length;
                currentLightboxImage.value = lightboxImages.value[currentLightboxIndex.value];
            }
        }
        
        // 生命周期
        onMounted(() => {
            // 加载数据
            if (window.timelineData && Array.isArray(window.timelineData)) {
                timelineData.value = window.timelineData;
                console.log('数据加载成功，共加载 ' + timelineData.value.length + ' 条历史记录');
            } else {
                console.error('错误: timelineData未正确加载或为空');
            }
            
            // 监听滚动事件
            window.addEventListener('scroll', handleScroll);
        });
        
        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });
        
        return {
            // 状态
            currentPeriod,
            searchQuery,
            modalVisible,
            selectedEvent,
            periods,
            filteredEvents,
            showBackToTop,
            showLightbox,
            currentLightboxIndex,
            currentLightboxImage,
            lightboxImages,
            
            // 方法
            filterByPeriod,
            handleSearch,
            resetFilters,
            getPeriodName,
            getPeriodClass,
            showModal,
            closeModal,
            handleImageError,
            scrollToTop,
            openLightbox,
            closeLightbox,
            prevImage,
            nextImage,
        };
    }
});

// 挂载应用
app.mount('#app'); 