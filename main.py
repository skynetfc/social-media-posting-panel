from fastapi import FastAPI, Request, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime, timedelta
from typing import Optional, List
import uuid
import mimetypes
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from database import get_db, init_db
from models import PostLog, User
from auth import verify_password, get_password_hash, create_access_token, verify_token
from social_platforms import SocialMediaManager

app = FastAPI(title="Anonymous Creations Dashboard")

# Add session middleware with improved cookie settings for browser compatibility
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production"),
    max_age=1800,  # 30 minutes
    same_site="lax",
    https_only=False
)

# Add CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Templates
templates = Jinja2Templates(directory="templates")

# Initialize database
init_db()

# Social media manager
social_manager = SocialMediaManager()

# Allowed file types and max size (10MB)
ALLOWED_EXTENSIONS = {
    'image': ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    'video': ['mp4', 'mov', 'avi', 'mkv', 'webm']
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current user from session with enhanced reliability"""
    try:
        # Primary authentication: session
        user_id = request.session.get("user_id")
        if user_id:
            try:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    return user
            except Exception:
                pass
        
        # Fallback authentication: backup cookie
        backup_cookie = request.cookies.get("user_session")
        if backup_cookie and ":" in backup_cookie:
            try:
                parts = backup_cookie.split(":", 1)
                if len(parts) == 2:
                    cookie_user_id, cookie_username = parts
                    user = db.query(User).filter(
                        User.id == int(cookie_user_id),
                        User.username == cookie_username
                    ).first()
                    if user:
                        # Restore session data
                        request.session.clear()
                        request.session["user_id"] = user.id
                        request.session["username"] = user.username
                        request.session["authenticated"] = True
                        return user
            except (ValueError, TypeError, AttributeError):
                pass
                
        return None
    except Exception as e:
        print(f"Authentication error: {e}")
        return None

def require_auth(request: Request, db: Session = Depends(get_db)):
    """Require authentication"""
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return user

def validate_file(file: UploadFile) -> tuple[bool, str, str]:
    """Validate uploaded file"""
    if not file.filename:
        return False, "No file selected", ""
    
    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        return False, "File size exceeds 10MB limit", ""
    
    # Check file extension
    file_ext = file.filename.split('.')[-1].lower()
    file_type = ""
    
    if file_ext in ALLOWED_EXTENSIONS['image']:
        file_type = "image"
    elif file_ext in ALLOWED_EXTENSIONS['video']:
        file_type = "video"
    else:
        return False, f"File type .{file_ext} not allowed", ""
    
    return True, "", file_type

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Create default admin user if it doesn't exist
    db = next(get_db())
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        hashed_password = get_password_hash(os.getenv("ADMIN_PASSWORD", "admin123"))
        admin_user = User(
            username="admin",
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
    db.close()

@app.get("/", response_class=HTMLResponse)
async def root(request: Request, db: Session = Depends(get_db)):
    """Redirect to dashboard or login"""
    user = get_current_user(request, db)
    if user:
        return RedirectResponse(url="/dashboard", status_code=302)
    return RedirectResponse(url="/login", status_code=302)

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Login page"""
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Handle login"""
    user = db.query(User).filter(User.username == username).first()
    
    if not user or not verify_password(password, user.hashed_password):
        return templates.TemplateResponse(
            "login.html", 
            {
                "request": request, 
                "error": "Invalid username or password"
            }
        )
    
    # Set session with additional security
    request.session["user_id"] = user.id
    request.session["username"] = user.username
    request.session["authenticated"] = True
    
    response = RedirectResponse(url="/dashboard", status_code=302)
    # Also set a backup cookie for reliability with proper path
    response.set_cookie(
        key="user_session", 
        value=f"{user.id}:{user.username}", 
        max_age=1800,
        httponly=True,
        samesite="lax",
        path="/",
        secure=False
    )
    return response

@app.get("/logout")
async def logout(request: Request):
    """Handle logout"""
    request.session.clear()
    response = RedirectResponse(url="/login", status_code=302)
    # Clear backup cookie
    response.delete_cookie("user_session")
    return response

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(
    request: Request, 
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Dashboard page"""
    # Get recent posts
    recent_posts = db.query(PostLog).filter(PostLog.user_id == user.id).order_by(PostLog.created_at.desc()).limit(10).all()
    
    # Calculate statistics
    total_posts = db.query(PostLog).filter(PostLog.user_id == user.id).count()
    successful_posts = db.query(PostLog).filter(
        PostLog.user_id == user.id, 
        PostLog.status == "completed"
    ).count()
    failed_posts = db.query(PostLog).filter(
        PostLog.user_id == user.id, 
        PostLog.status == "failed"
    ).count()
    pending_posts = db.query(PostLog).filter(
        PostLog.user_id == user.id, 
        PostLog.status == "pending"
    ).count()
    
    return templates.TemplateResponse(
        "dashboard.html", 
        {
            "request": request, 
            "user": user,
            "recent_posts": recent_posts,
            "total_posts": total_posts,
            "successful_posts": successful_posts,
            "failed_posts": failed_posts,
            "pending_posts": pending_posts
        }
    )

@app.post("/post")
async def create_post(
    request: Request,
    content: str = Form(...),
    platforms: List[str] = Form(...),
    schedule_time: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Create and post content to selected platforms"""
    
    # Validate platforms
    valid_platforms = ['telegram', 'instagram', 'youtube', 'tiktok', 'facebook']
    platforms = [p for p in platforms if p in valid_platforms]
    
    if not platforms:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "At least one platform must be selected"}
        )
    
    # Handle file upload
    file_path = None
    file_type = None
    
    if file and file.filename:
        is_valid, error_msg, detected_type = validate_file(file)
        if not is_valid:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": error_msg}
            )
        
        # Save file
        file_extension = file.filename.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{unique_filename}"
        file_type = detected_type
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    # Create post log
    post_log = PostLog(
        content=content,
        platforms=",".join(platforms),
        file_path=file_path,
        file_type=file_type,
        scheduled_for=datetime.fromisoformat(schedule_time) if schedule_time else None,
        user_id=user.id,
        status="pending"
    )
    db.add(post_log)
    db.commit()
    db.refresh(post_log)
    
    # Post to platforms
    results = {}
    overall_success = True
    
    for platform in platforms:
        try:
            if platform == 'telegram':
                success, message = await social_manager.post_to_telegram(content, file_path, file_type)
            elif platform == 'instagram':
                success, message = await social_manager.post_to_instagram(content, file_path, file_type)
            elif platform == 'youtube':
                success, message = await social_manager.post_to_youtube(content, file_path, file_type)
            elif platform == 'tiktok':
                success, message = await social_manager.post_to_tiktok(content, file_path, file_type)
            elif platform == 'facebook':
                success, message = await social_manager.post_to_facebook(content, file_path, file_type)
            else:
                success, message = False, "Unsupported platform"
            
            results[platform] = {"success": success, "message": message}
            if not success:
                overall_success = False
                
        except Exception as e:
            results[platform] = {"success": False, "message": str(e)}
            overall_success = False
    
    # Update post log
    post_log.status = "completed" if overall_success else "failed"
    post_log.results = str(results)
    post_log.completed_at = datetime.utcnow()
    db.commit()
    
    return JSONResponse(content={
        "success": overall_success,
        "results": results,
        "message": "Post completed" if overall_success else "Some platforms failed"
    })

@app.get("/logs", response_class=HTMLResponse)
async def logs_page(
    request: Request,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Logs page"""
    logs = db.query(PostLog).order_by(PostLog.created_at.desc()).all()
    
    return templates.TemplateResponse(
        "logs.html",
        {
            "request": request,
            "user": user,
            "logs": logs
        }
    )

@app.get("/api/logs")
async def get_logs(
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get logs via API"""
    logs = db.query(PostLog).order_by(PostLog.created_at.desc()).limit(50).all()
    
    logs_data = []
    for log in logs:
        logs_data.append({
            "id": log.id,
            "content": log.content[:100] + "..." if len(log.content) > 100 else log.content,
            "platforms": log.platforms.split(","),
            "status": log.status,
            "created_at": log.created_at.isoformat(),
            "completed_at": log.completed_at.isoformat() if log.completed_at else None,
            "results": log.results
        })
    
    return {"logs": logs_data}

@app.get("/api/logs/{log_id}")
async def get_log_details(
    log_id: int,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get detailed log information"""
    log = db.query(PostLog).filter(PostLog.id == log_id, PostLog.user_id == user.id).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    return {
        "id": log.id,
        "content": log.content,
        "platforms": log.platforms.split(","),
        "status": log.status,
        "created_at": log.created_at.isoformat(),
        "completed_at": log.completed_at.isoformat() if log.completed_at else None,
        "results": log.results,
        "file_path": log.file_path,
        "file_type": log.file_type,
        "scheduled_for": log.scheduled_for.isoformat() if log.scheduled_for else None
    }

@app.get("/settings", response_class=HTMLResponse)
async def settings_page(
    request: Request,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Settings page"""
    # Calculate statistics
    total_posts = db.query(PostLog).filter(PostLog.user_id == user.id).count()
    successful_posts = db.query(PostLog).filter(
        PostLog.user_id == user.id, 
        PostLog.status == "completed"
    ).count()
    
    success_rate = f"{(successful_posts / total_posts * 100):.1f}%" if total_posts > 0 else "0%"
    
    return templates.TemplateResponse(
        "settings.html",
        {
            "request": request,
            "user": user,
            "total_posts": total_posts,
            "success_rate": success_rate
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
