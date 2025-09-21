# 媒体代理服务 (Media Proxy Service)

一个基于 FastAPI 的媒体代理服务，支持视频播放和图片预览功能。

## 功能特性

### 视频播放
- 支持多种视频格式 (MP4, AVI, MOV, WMV, FLV, WebM, MKV, M4V)
- 播放/暂停控制
- 进度条拖拽
- 音量控制和静音
- 全屏播放
- 键盘快捷键支持

### 图片预览
- 支持多种图片格式 (JPG, PNG, GIF, BMP, WebP, SVG)
- 缩放功能 (放大/缩小)
- 拖拽移动
- 全屏查看
- 触摸设备支持

### 键盘快捷键

**视频控制：**
- 空格键：播放/暂停
- 左箭头：后退10秒
- 右箭头：前进10秒
- 上箭头：增加音量
- 下箭头：减少音量
- F键：全屏
- M键：静音/取消静音

**图片控制：**
- +/=键：放大
- -键：缩小
- 0键：重置缩放
- F键：全屏

## 安装和运行

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 启动服务：
```bash
python main.py
```

或使用 uvicorn：
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

3. 访问服务：
```
http://localhost:8000/?media_url=<你的媒体文件URL>
```

## 使用示例

### 视频播放
```
http://localhost:8000/?media_url=https://example.com/video.mp4
```

### 图片预览
```
http://localhost:8000/?media_url=https://example.com/image.jpg
```

## API 接口

### GET /
主要的媒体代理接口

**参数：**
- `media_url` (必需): 媒体文件的URL

**响应：**
- 返回媒体查看器HTML页面

### GET /health
健康检查接口

**响应：**
```json
{"status": "ok"}
```

## 技术栈

- **后端**: Python + FastAPI + Uvicorn
- **前端**: HTML5 + CSS3 + JavaScript
- **模板引擎**: Jinja2
- **样式**: 响应式设计，支持移动设备

## 项目结构

```
media_proxy/
├── main.py              # 主应用文件
├── requirements.txt     # 依赖包列表
├── templates/          # HTML模板目录
│   └── media_viewer.html
├── static/             # 静态文件目录
│   ├── style.css      # 样式文件
│   └── script.js      # JavaScript文件
└── README.md          # 项目说明
```

## 特性说明

1. **不转发流量**: 服务器不会代理媒体文件的流量，直接让浏览器访问原始URL
2. **响应式设计**: 支持各种屏幕尺寸，移动设备友好
3. **错误处理**: 当媒体文件无法加载时会显示错误提示
4. **安全性**: 自动判断媒体类型，只支持安全的媒体格式