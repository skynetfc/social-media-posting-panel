
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

# Add session middleware with proper configuration
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production"),
    max_age=1800,
    same_site="lax",
    https_only=False
)

# Add CORS middleware
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
    """Get current user from session"""
    try:
        user_id = request.session.get("user_id")
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
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
    try:
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
    except Exception as e:
        print(f"Startup error: {e}")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request, db: Session = Depends(get_db)):
    """Redirect to dashboard or login"""
    try:
        user = get_current_user(request, db)
        if user:
            return RedirectResponse(url="/dashboard", status_code=302)
        return RedirectResponse(url="/login", status_code=302)
    except Exception as e:
        print(f"Root error: {e}")
        return RedirectResponse(url="/login", status_code=302)

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Login page"""
    try:
        return templates.TemplateResponse("login.html", {"request": request})
    except Exception as e:
        print(f"Login page error: {e}")
        return HTMLResponse(content="<h1>Error loading login page</h1>", status_code=500)

@app.post("/login")
async def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Handle login"""
    try:
        user = db.query(User).filter(User.username == username).first()
        
        if not user or not verify_password(password, str(user.hashed_password)):
            return templates.TemplateResponse(
                "login.html", 
                {
                    "request": request, 
                    "error": "Invalid username or password"
                }
            )
        
        # Clear any existing session data
        request.session.clear()
        
        # Set session data
        request.session["user_id"] = user.id
        request.session["username"] = user.username
        request.session["authenticated"] = True
        
        return RedirectResponse(url="/dashboard", status_code=302)
        
    except Exception as e:
        print(f"Login error: {e}")
        return templates.TemplateResponse(
            "login.html", 
            {
                "request": request, 
                "error": "Internal server error. Please try again."
            }
        )

@app.post("/register")
async def register(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Handle user registration"""
    try:
        # Check if passwords match
        if password != confirm_password:
            return templates.TemplateResponse(
                "login.html", 
                {
                    "request": request, 
                    "error": "Passwords do not match"
                }
            )
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            return templates.TemplateResponse(
                "login.html", 
                {
                    "request": request, 
                    "error": "Username already exists"
                }
            )
        
        # Create new user
        hashed_password = get_password_hash(password)
        new_user = User(
            username=username,
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Auto-login after registration
        request.session.clear()
        request.session["user_id"] = new_user.id
        request.session["username"] = new_user.username
        request.session["authenticated"] = True
        
        return RedirectResponse(url="/dashboard", status_code=302)
        
    except Exception as e:
        print(f"Registration error: {e}")
        return templates.TemplateResponse(
            "login.html", 
            {
                "request": request, 
                "error": "Registration failed. Please try again."
            }
        )

@app.get("/logout")
async def logout(request: Request):
    """Handle logout"""
    try:
        request.session.clear()
        return RedirectResponse(url="/login", status_code=302)
    except Exception as e:
        print(f"Logout error: {e}")
        return RedirectResponse(url="/login", status_code=302)

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(
    request: Request, 
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Dashboard page"""
    try:
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
    except Exception as e:
        print(f"Dashboard error: {e}")
        return HTMLResponse(content="<h1>Dashboard Error</h1><p>Please try refreshing the page or logging in again.</p>", status_code=500)

@app.post("/post")
async def create_post(
    request: Request,
    content: str = Form(...),
    platforms: List[str] = Form(...),
    schedule_time: Optional[str] = Form(None),
    media: Optional[UploadFile] = File(None),
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Create and post content to selected platforms"""
    try:
        # Validate platforms - expanded list
        valid_platforms = [
            'telegram', 'instagram', 'youtube', 'tiktok', 'facebook',
            'twitter', 'linkedin', 'snapchat', 'pinterest', 'reddit',
            'discord', 'whatsapp', 'threads', 'medium', 'tumblr'
        ]
        platforms = [p for p in platforms if p in valid_platforms]
        
        if not platforms:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "At least one platform must be selected"}
            )
        
        # Handle media upload with improved error handling
        file_path = None
        file_type = None
        full_file_path = None
        
        if media and media.filename and media.filename.strip() and media.size and media.size > 0:
            try:
                print(f"Processing media upload: {media.filename}, size: {media.size}")
                
                # Validate file type first
                file_ext = media.filename.split('.')[-1].lower()
                
                if file_ext in ALLOWED_EXTENSIONS['image']:
                    file_type = "image"
                elif file_ext in ALLOWED_EXTENSIONS['video']:
                    file_type = "video"
                else:
                    return JSONResponse(
                        status_code=400,
                        content={"success": False, "message": f"File type .{file_ext} not supported. Use: {', '.join(ALLOWED_EXTENSIONS['image'] + ALLOWED_EXTENSIONS['video'])}"}
                    )
                
                # Check file size
                if media.size > MAX_FILE_SIZE:
                    return JSONResponse(
                        status_code=400,
                        content={"success": False, "message": f"File size ({media.size} bytes) exceeds 10MB limit"}
                    )
                
                # Read file content first to validate
                media.file.seek(0)  # Reset file pointer
                file_content = await media.read()
                
                if len(file_content) == 0:
                    return JSONResponse(
                        status_code=400,
                        content={"success": False, "message": "Uploaded file is empty"}
                    )
                
                # Generate unique filename and full path
                unique_filename = f"{uuid.uuid4()}.{file_ext}"
                file_path = f"uploads/{unique_filename}"
                full_file_path = os.path.abspath(file_path)
                
                # Ensure uploads directory exists
                os.makedirs("uploads", exist_ok=True)
                
                # Save file with proper binary mode
                with open(full_file_path, "wb") as buffer:
                    buffer.write(file_content)
                
                # Verify file was saved correctly
                if not os.path.exists(full_file_path):
                    raise Exception("File was not saved")
                    
                saved_size = os.path.getsize(full_file_path)
                if saved_size == 0:
                    raise Exception("Saved file is empty")
                
                print(f"Media saved successfully: {full_file_path} ({saved_size} bytes, type: {file_type})")
                
            except Exception as e:
                print(f"Media upload error: {e}")
                # Clean up any partial file
                if full_file_path and os.path.exists(full_file_path):
                    try:
                        os.remove(full_file_path)
                    except:
                        pass
                    file_path = None
                    file_type = None
                    full_file_path = None
                
                return JSONResponse(
                    status_code=500,
                    content={"success": False, "message": f"Media upload failed: {str(e)}"}
                )
        else:
            print("No media file provided or file is empty")
        
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
        
        print(f"Starting to post to platforms: {platforms}")
        print(f"Content: {content[:50]}...")
        print(f"Media: {full_file_path} ({file_type})" if full_file_path else "No media")
        
        # Post to platforms with full file path
        results = {}
        overall_success = True
        
        for platform in platforms:
            try:
                print(f"Posting to {platform}...")
                
                # Use the social manager method based on platform
                if hasattr(social_manager, f'post_to_{platform}'):
                    method = getattr(social_manager, f'post_to_{platform}')
                    success, message = await method(content, full_file_path, file_type)
                else:
                    success, message = False, f"Platform {platform} not implemented yet"
                
                print(f"{platform} result: {success} - {message}")
                
                results[platform] = {"success": success, "message": message}
                if not success:
                    overall_success = False
                    
            except Exception as e:
                error_msg = f"Error posting to {platform}: {str(e)}"
                print(error_msg)
                results[platform] = {"success": False, "message": str(e)}
                overall_success = False
        
        # Update post log
        post_log.status = "completed" if overall_success else "failed"
        post_log.results = json.dumps(results)
        post_log.completed_at = datetime.utcnow()
        db.commit()
        
        print(f"Post processing completed. Overall success: {overall_success}")
        
        return JSONResponse(content={
            "success": overall_success,
            "results": results,
            "message": "Post published successfully!" if overall_success else "Some platforms failed",
            "post_id": post_log.id,
            "media_included": bool(full_file_path)
        })
        
    except Exception as e:
        print(f"Post creation error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Internal server error: {str(e)}"}
        )

@app.get("/logs", response_class=HTMLResponse)
async def logs_page(
    request: Request,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Logs page"""
    try:
        logs = db.query(PostLog).filter(PostLog.user_id == user.id).order_by(PostLog.created_at.desc()).all()
        
        return templates.TemplateResponse(
            "logs.html",
            {
                "request": request,
                "user": user,
                "logs": logs
            }
        )
    except Exception as e:
        print(f"Logs page error: {e}")
        return HTMLResponse(content="<h1>Logs Error</h1><p>Unable to load logs.</p>", status_code=500)

@app.get("/api/logs")
async def get_logs(
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get logs via API"""
    try:
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
    except Exception as e:
        print(f"API logs error: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

@app.get("/api/logs/{log_id}")
async def get_log_details(
    log_id: int,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get detailed log information"""
    try:
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
    except Exception as e:
        print(f"API log details error: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

@app.get("/settings", response_class=HTMLResponse)
async def settings_page(
    request: Request,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Settings page"""
    try:
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
    except Exception as e:
        print(f"Settings page error: {e}")
        return HTMLResponse(content="<h1>Settings Error</h1><p>Unable to load settings.</p>", status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
