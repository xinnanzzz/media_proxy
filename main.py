from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os
from urllib.parse import urlparse
import mimetypes

app = FastAPI(title="Media Proxy Service")

# 创建模板目录
templates = Jinja2Templates(directory="templates")

# 静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

def get_media_type(url: str) -> str:
    """根据URL判断媒体类型"""
    parsed_url = urlparse(url)
    path = parsed_url.path.lower()
    
    # 视频格式
    video_extensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v']
    # 图片格式
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    
    for ext in video_extensions:
        if path.endswith(ext):
            return "video"
    
    for ext in image_extensions:
        if path.endswith(ext):
            return "image"
    
    # 通过MIME类型判断
    mime_type, _ = mimetypes.guess_type(url)
    if mime_type:
        if mime_type.startswith('video/'):
            return "video"
        elif mime_type.startswith('image/'):
            return "image"
    
    return "unknown"

@app.get("/", response_class=HTMLResponse)
async def media_proxy(request: Request, media_url: str = None):
    """媒体代理主页面"""
    if not media_url:
        raise HTTPException(status_code=400, detail="media_url parameter is required")
    
    # 判断媒体类型
    media_type = get_media_type(media_url)
    
    if media_type == "unknown":
        raise HTTPException(status_code=400, detail="Unsupported media format")
    
    return templates.TemplateResponse(
        "media_viewer.html",
        {
            "request": request,
            "media_url": media_url,
            "media_type": media_type
        }
    )

@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)