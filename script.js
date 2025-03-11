// 确保在页面加载前就能进行数据检查
if (typeof window.timelineData === 'undefined') {
    console.error('警告: timelineData未定义，将在页面加载时尝试重新检查');
    window.timelineData = [];
}

document.addEventListener('DOMContentLoaded', function() {
    // 页面加载后再次检查数据
    if (!window.timelineData || !Array.isArray(window.timelineData) || window.timelineData.length === 0) {
        console.error('错误: timelineData未正确加载或为空');
        document.getElementById('timeline').innerHTML = '<div class="no-data">数据加载失败，请刷新页面重试</div>';
        if (document.getElementById('debug')) {
            document.getElementById('debug').style.display = 'block';
            document.getElementById('debugInfo').innerHTML = '<p>错误: timelineData未正确加载</p>';
        }
        return;
    }
    
    // 正常继续执行
    console.log('数据加载成功，共加载 ' + window.timelineData.length + ' 条历史记录');
    
    // DOM元素
    const timeline = document.getElementById('timeline');
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close-btn');
    const searchInput = document.getElementById('timelineSearch');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 模态框数据元素
    const modalTitle = document.getElementById('modalTitle');
    const modalPeriod = document.getElementById('modalPeriod');
    const modalYear = document.getElementById('modalYear');
    const modalDescription = document.getElementById('modalDescription');
    const modalImage = document.getElementById('modalImage');
    const modalLinks = document.getElementById('modalLinks');
    
    // 当前筛选的时期
    let currentPeriod = 'all';
    // 当前搜索词
    let currentSearch = '';
    // 当前页数和每页显示数量
    let currentPage = 1;
    const itemsPerPage = 6;
    
    // 初始化时间轴
    initTimeline();
    
    // 监听筛选按钮点击
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterBtns.forEach(b => b.classList.remove('active'));
            // 给当前按钮添加active类
            this.classList.add('active');
            // 设置当前筛选时期
            currentPeriod = this.getAttribute('data-period');
            // 重置页码
            currentPage = 1;
            // 重新渲染时间轴
            renderTimeline();
        });
    });
    
    // 监听搜索按钮点击
    searchBtn.addEventListener('click', function() {
        currentSearch = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        renderTimeline();
    });
    
    // 监听搜索输入框回车键
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value.trim().toLowerCase();
            currentPage = 1;
            renderTimeline();
        }
    });
    
    // 上一页按钮
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTimeline();
            // 平滑滚动到顶部
            window.scrollTo({
                top: timeline.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
    
    // 下一页按钮
    nextBtn.addEventListener('click', function() {
        const filteredData = getFilteredData();
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTimeline();
            // 平滑滚动到顶部
            window.scrollTo({
                top: timeline.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复滚动
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复滚动
        }
    });
    
    // 初始化时间轴
    function initTimeline() {
        renderTimeline();
    }
    
    // 获取筛选后的数据
    function getFilteredData() {
        // 确保timelineData已加载并存在
        if (!window.timelineData || !Array.isArray(window.timelineData)) {
            console.error('错误：timelineData未定义或不是数组');
            return [];
        }
        
        let data = [...timelineData];
        
        // 按时期筛选
        if (currentPeriod !== 'all') {
            data = data.filter(item => item.period === currentPeriod);
        }
        
        // 按搜索词筛选 - 改进搜索逻辑
        if (currentSearch) {
            console.log('搜索词:', currentSearch);
            console.log('筛选前数据数量:', data.length);
            
            data = data.filter(item => {
                const titleMatch = item.title && item.title.toLowerCase().includes(currentSearch);
                const descMatch = item.description && item.description.toLowerCase().includes(currentSearch);
                const fullDescMatch = item.fullDescription && item.fullDescription.toLowerCase().includes(currentSearch);
                const yearMatch = item.year && item.year.toString().includes(currentSearch);
                
                return titleMatch || descMatch || fullDescMatch || yearMatch;
            });
            
            console.log('筛选后数据数量:', data.length);
        }
        
        return data;
    }
    
    // 渲染时间轴
    function renderTimeline() {
        const filteredData = getFilteredData();
        
        // 计算总页数
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        // 确保当前页码有效
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        
        // 计算当前页显示的数据
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = filteredData.slice(startIndex, endIndex);
        
        // 清空时间轴
        timeline.innerHTML = '';
        
        // 没有数据的提示
        if (currentPageData.length === 0) {
            const noData = document.createElement('div');
            noData.className = 'no-data';
            noData.textContent = '没有找到符合条件的历史事件';
            timeline.appendChild(noData);
            
            // 隐藏导航按钮
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        // 显示导航按钮
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        
        // 设置导航按钮状态
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // 渲染时间轴项目
        currentPageData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            const timelineDot = document.createElement('div');
            timelineDot.className = 'timeline-dot';
            
            const timelineContent = document.createElement('div');
            timelineContent.className = 'timeline-item-content';
            
            const year = document.createElement('span');
            year.className = 'timeline-year';
            year.textContent = item.year;
            
            const title = document.createElement('h3');
            title.textContent = item.title;
            
            const periodTag = document.createElement('span');
            periodTag.className = `period-tag ${item.period}`;
            periodTag.textContent = getPeriodName(item.period);
            
            const description = document.createElement('p');
            description.textContent = item.description;
            
            const readMore = document.createElement('a');
            readMore.className = 'read-more';
            readMore.textContent = '查看详情';
            readMore.addEventListener('click', function() {
                openModal(item);
            });
            
            timelineContent.appendChild(year);
            timelineContent.appendChild(title);
            timelineContent.appendChild(periodTag);
            timelineContent.appendChild(description);
            timelineContent.appendChild(readMore);
            
            timelineItem.appendChild(timelineDot);
            timelineItem.appendChild(timelineContent);
            
            timeline.appendChild(timelineItem);
        });
        
        // 显示分页信息
        const paginationInfo = document.createElement('div');
        paginationInfo.className = 'pagination-info';
        paginationInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页，显示 ${filteredData.length} 个历史事件中的 ${currentPageData.length} 个`;
        
        timeline.appendChild(paginationInfo);
    }
    
    // 获取时期名称
    function getPeriodName(period) {
        const periodMap = {
            'ancient': '上古时代',
            'classical': '古典时代',
            'medieval': '中世纪',
            'edo': '江户时代',
            'modern': '近现代',
            'contemporary': '当代'
        };
        
        return periodMap[period] || period;
    }
    
    // 打开模态框
    function openModal(item) {
        modalTitle.textContent = item.title;
        modalYear.textContent = item.year;
        
        modalPeriod.textContent = getPeriodName(item.period);
        modalPeriod.className = `period-tag ${item.period}`;
        
        modalDescription.innerHTML = item.fullDescription.replace(/\n/g, '<br>');
        
        if (item.image) {
            modalImage.innerHTML = `<img src="${item.image}" alt="${item.title}">`;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }
        
        // 清空链接
        modalLinks.innerHTML = '';
        
        // 添加链接
        if (item.links && item.links.length > 0) {
            item.links.forEach(link => {
                const linkElem = document.createElement('a');
                linkElem.href = link.url;
                linkElem.textContent = link.text;
                linkElem.target = '_blank';
                linkElem.rel = 'noopener noreferrer';
                
                modalLinks.appendChild(linkElem);
            });
            modalLinks.style.display = 'block';
        } else {
            modalLinks.style.display = 'none';
        }
        
        // 显示模态框
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    // 增加键盘导航
    document.addEventListener('keydown', function(e) {
        // ESC键关闭模态框
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // 左右箭头键导航页面
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        }
        
        if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        }
    });
    
    // 添加动画效果
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }, 500);

    // 检查加载状态
    window.addEventListener('load', function() {
        console.log('页面完全加载');
        console.log('timelineData 是否存在:', !!window.timelineData);
        if (window.timelineData) {
            console.log('timelineData 长度:', window.timelineData.length);
        }
    });
}); 