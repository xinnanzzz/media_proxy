// 视频控制功能
class VideoController {
    constructor() {
        this.video = document.getElementById('mediaPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFill = document.getElementById('progressFill');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.muteBtn = document.getElementById('muteBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (this.video) {
            this.initializeVideoControls();
        }
    }
    
    initializeVideoControls() {
        // 播放/暂停控制
        this.playPauseBtn.addEventListener('click', () => {
            if (this.video.paused) {
                this.video.play();
                this.playPauseBtn.textContent = '⏸️';
            } else {
                this.video.pause();
                this.playPauseBtn.textContent = '▶️';
            }
        });
        
        // 视频事件监听
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.video.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });
        
        this.video.addEventListener('ended', () => {
            this.playPauseBtn.textContent = '▶️';
        });
        
        // 进度条控制
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            this.video.currentTime = percentage * this.video.duration;
        });
        
        // 音量控制
        this.muteBtn.addEventListener('click', () => {
            if (this.video.muted) {
                this.video.muted = false;
                this.muteBtn.textContent = '🔊';
                this.volumeSlider.value = this.video.volume * 100;
            } else {
                this.video.muted = true;
                this.muteBtn.textContent = '🔇';
            }
        });
        
        this.volumeSlider.addEventListener('input', (e) => {
            this.video.volume = e.target.value / 100;
            this.video.muted = false;
            this.muteBtn.textContent = this.video.volume === 0 ? '🔇' : '🔊';
        });
        
        // 全屏控制
        this.fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                this.video.requestFullscreen();
            }
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.playPauseBtn.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.video.currentTime -= 10;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.video.currentTime += 10;
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.video.volume = Math.min(1, this.video.volume + 0.1);
                    this.volumeSlider.value = this.video.volume * 100;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.video.volume = Math.max(0, this.video.volume - 0.1);
                    this.volumeSlider.value = this.video.volume * 100;
                    break;
                case 'KeyF':
                    e.preventDefault();
                    this.fullscreenBtn.click();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    this.muteBtn.click();
                    break;
            }
        });
    }
    
    updateProgress() {
        if (this.video.duration) {
            const percentage = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = percentage + '%';
            this.updateTimeDisplay();
        }
    }
    
    updateTimeDisplay() {
        const current = this.formatTime(this.video.currentTime);
        const duration = this.formatTime(this.video.duration || 0);
        this.timeDisplay.textContent = `${current} / ${duration}`;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// 图片控制功能
class ImageController {
    constructor() {
        this.image = document.getElementById('mediaImage');
        this.imageContainer = document.getElementById('imageContainer');
        
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // 触摸相关
        this.initialDistance = 0;
        this.initialScale = 1;
        this.isZooming = false;
        
        if (this.image) {
            this.initializeImageControls();
        }
    }
    
    initializeImageControls() {
        // 鼠标滚轮缩放
        this.imageContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
            this.setScale(this.scale * zoomFactor);
        }, { passive: false });
        
        // 鼠标拖拽
        this.imageContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.imageContainer.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                const deltaX = e.clientX - this.lastX;
                const deltaY = e.clientY - this.lastY;
                
                this.translateX += deltaX;
                this.translateY += deltaY;
                
                this.updateTransform();
                
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.imageContainer.style.cursor = 'grab';
        });
        
        // 触摸设备支持（优化移动端体验）
        this.imageContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1) {
                // 单指拖拽
                this.isDragging = true;
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                // 双指缩放
                this.isZooming = true;
                this.isDragging = false;
                this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                this.initialScale = this.scale;
            }
        }, { passive: false });
        
        this.imageContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1 && this.isDragging && !this.isZooming) {
                // 单指拖拽
                const deltaX = e.touches[0].clientX - this.lastX;
                const deltaY = e.touches[0].clientY - this.lastY;
                
                this.translateX += deltaX;
                this.translateY += deltaY;
                
                this.updateTransform();
                
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2 && this.isZooming) {
                // 双指缩放
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scaleChange = currentDistance / this.initialDistance;
                this.setScale(this.initialScale * scaleChange);
            }
        }, { passive: false });
        
        this.imageContainer.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.isDragging = false;
                this.isZooming = false;
            } else if (e.touches.length === 1) {
                this.isZooming = false;
                this.isDragging = true;
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            }
        });
        
        // 双击缩放
        let lastTapTime = 0;
        this.imageContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTapTime;
                if (tapLength < 500 && tapLength > 0) {
                    // 双击事件
                    e.preventDefault();
                    if (this.scale > 1) {
                        this.resetZoom();
                    } else {
                        this.setScale(2);
                    }
                }
                lastTapTime = currentTime;
            }
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input') return;
            
            switch(e.code) {
                case 'Equal':
                case 'NumpadAdd':
                    e.preventDefault();
                    this.setScale(this.scale * 1.2);
                    break;
                case 'Minus':
                case 'NumpadSubtract':
                    e.preventDefault();
                    this.setScale(this.scale * 0.8);
                    break;
                case 'Digit0':
                case 'Numpad0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        this.imageContainer.requestFullscreen();
                    }
                    break;
            }
        });
    }
    
    zoomIn() {
        this.setScale(this.scale * 1.2);
    }
    
    zoomOut() {
        this.setScale(this.scale / 1.2);
    }
    
    resetZoom() {
        this.setScale(1);
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }
    
    setScale(newScale) {
        this.scale = Math.max(0.1, Math.min(10, newScale));
        this.updateTransform();
        
        // 更新光标样式
        this.imageContainer.style.cursor = 'grab';
        
        // 如果缩放到1以下，重置平移
        if (this.scale <= 1) {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            this.updateTransform();
        }
    }
    
    updateTransform() {
        this.image.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
        this.image.style.transition = this.isDragging || this.isZooming ? 'none' : 'transform 0.2s ease-out';
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// 初始化控制器
document.addEventListener('DOMContentLoaded', () => {
    new VideoController();
    new ImageController();
    
    // 错误处理
    const media = document.getElementById('mediaPlayer') || document.getElementById('mediaImage');
    if (media) {
        media.addEventListener('error', (e) => {
            console.error('媒体加载失败:', e);
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(231, 76, 60, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                z-index: 1000;
            `;
            errorMsg.innerHTML = `
                <h3>⚠️ 媒体加载失败</h3>
                <p>无法加载指定的媒体文件，请检查URL是否正确。</p>
            `;
            media.parentElement.style.position = 'relative';
            media.parentElement.appendChild(errorMsg);
        });
    }
});