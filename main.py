
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
import re
import random
from collections import Counter
from dotenv import load_dotenv
import openai
from typing import Dict, List

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    seo_keywords: Optional[str] = Form(""),
    seo_title: Optional[str] = Form(""),
    seo_description: Optional[str] = Form(""),
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
        
        # Calculate SEO metrics
        seo_score = calculate_seo_score(content, seo_keywords, seo_title, seo_description)
        readability_score = calculate_readability_score(content)
        hashtags = extract_hashtags(content)
        
        # Create post log
        post_log = PostLog(
            content=content,
            platforms=",".join(platforms),
            file_path=file_path,
            file_type=file_type,
            scheduled_for=datetime.fromisoformat(schedule_time) if schedule_time else None,
            user_id=user.id,
            status="pending",
            seo_keywords=seo_keywords,
            seo_title=seo_title,
            seo_description=seo_description,
            hashtags=hashtags,
            seo_score=seo_score,
            readability_score=readability_score
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

# SEO and Analytics helper functions
def calculate_seo_score(content: str, keywords: str = "", title: str = "", description: str = "") -> float:
    """Calculate SEO score based on content optimization"""
    score = 0.0
    
    # Content length score (5-10 points)
    content_length = len(content.split())
    if 50 <= content_length <= 300:
        score += 10
    elif 20 <= content_length < 50 or 300 < content_length <= 500:
        score += 7
    else:
        score += 3
    
    # Keywords usage (10-20 points)
    if keywords:
        keyword_list = [k.strip().lower() for k in keywords.split(',')]
        content_lower = content.lower()
        keyword_mentions = sum(content_lower.count(keyword) for keyword in keyword_list)
        if keyword_mentions >= 3:
            score += 20
        elif keyword_mentions >= 1:
            score += 15
        else:
            score += 5
    
    # Title optimization (5-15 points)
    if title:
        title_length = len(title)
        if 30 <= title_length <= 60:
            score += 15
        elif 20 <= title_length < 30 or 60 < title_length <= 80:
            score += 10
        else:
            score += 5
    
    # Description optimization (5-15 points)
    if description:
        desc_length = len(description)
        if 120 <= desc_length <= 160:
            score += 15
        elif 80 <= desc_length < 120 or 160 < desc_length <= 200:
            score += 10
        else:
            score += 5
    
    # Hashtag presence (5-10 points)
    hashtag_count = len(re.findall(r'#\w+', content))
    if 3 <= hashtag_count <= 8:
        score += 10
    elif 1 <= hashtag_count < 3:
        score += 7
    else:
        score += 3
    
    # Readability (5-10 points)
    readability = calculate_readability_score(content)
    if readability >= 70:
        score += 10
    elif readability >= 50:
        score += 7
    else:
        score += 5
    
    return min(score, 100)

def calculate_readability_score(content: str) -> float:
    """Calculate readability score using simplified Flesch Reading Ease"""
    sentences = len(re.split(r'[.!?]+', content))
    words = len(content.split())
    
    if sentences == 0 or words == 0:
        return 0
    
    # Simplified calculation
    avg_sentence_length = words / sentences
    
    # Simple readability score (higher is better)
    if avg_sentence_length <= 15:
        return 90  # Very easy
    elif avg_sentence_length <= 20:
        return 75  # Easy
    elif avg_sentence_length <= 25:
        return 60  # Fairly easy
    else:
        return 40  # Difficult
    
def extract_hashtags(content: str) -> str:
    """Extract hashtags from content"""
    hashtags = re.findall(r'#\w+', content)
    return ', '.join(hashtags)

def suggest_keywords(content: str) -> str:
    """Suggest keywords based on content analysis"""
    # Remove common stop words and get meaningful words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'}
    
    words = re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())
    meaningful_words = [word for word in words if word not in stop_words]
    
    # Get most common words
    word_counts = Counter(meaningful_words)
    top_keywords = [word for word, count in word_counts.most_common(5)]
    
    return ', '.join(top_keywords[:5])

def simulate_analytics_data(post_id: int) -> dict:
    """Simulate analytics data for demonstration"""
    # In a real application, this would fetch data from social media APIs
    base_engagement = random.randint(10, 1000)
    
    return {
        'views': base_engagement * random.randint(5, 20),
        'likes': base_engagement + random.randint(0, base_engagement // 2),
        'shares': random.randint(0, base_engagement // 4),
        'comments': random.randint(0, base_engagement // 6),
        'clicks': random.randint(0, base_engagement // 3),
        'reach': base_engagement * random.randint(2, 8),
        'impressions': base_engagement * random.randint(8, 25)
    }

@app.get("/analytics", response_class=HTMLResponse)
async def analytics_page(
    request: Request,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Analytics dashboard page"""
    try:
        # Get all posts for analytics
        posts = db.query(PostLog).filter(PostLog.user_id == user.id).order_by(PostLog.created_at.desc()).all()
        
        # Calculate overall analytics
        total_views = sum(post.views or 0 for post in posts)
        total_likes = sum(post.likes or 0 for post in posts)
        total_shares = sum(post.shares or 0 for post in posts)
        total_comments = sum(post.comments or 0 for post in posts)
        total_clicks = sum(post.clicks or 0 for post in posts)
        total_reach = sum(post.reach or 0 for post in posts)
        total_impressions = sum(post.impressions or 0 for post in posts)
        
        # Calculate engagement rate
        avg_engagement_rate = sum(post.engagement_rate or 0 for post in posts) / len(posts) if posts else 0
        
        # Get top performing posts
        top_posts = sorted(posts, key=lambda x: (x.views or 0) + (x.likes or 0) + (x.shares or 0), reverse=True)[:5]
        
        # Platform performance
        platform_stats = {}
        for post in posts:
            platforms = post.platforms.split(', ')
            for platform in platforms:
                if platform not in platform_stats:
                    platform_stats[platform] = {'posts': 0, 'views': 0, 'likes': 0, 'shares': 0}
                platform_stats[platform]['posts'] += 1
                platform_stats[platform]['views'] += post.views or 0
                platform_stats[platform]['likes'] += post.likes or 0
                platform_stats[platform]['shares'] += post.shares or 0
        
        # SEO performance
        avg_seo_score = sum(post.seo_score or 0 for post in posts) / len(posts) if posts else 0
        avg_readability = sum(post.readability_score or 0 for post in posts) / len(posts) if posts else 0
        
        return templates.TemplateResponse(
            "analytics.html",
            {
                "request": request,
                "user": user,
                "posts": posts,
                "total_views": total_views,
                "total_likes": total_likes,
                "total_shares": total_shares,
                "total_comments": total_comments,
                "total_clicks": total_clicks,
                "total_reach": total_reach,
                "total_impressions": total_impressions,
                "avg_engagement_rate": round(avg_engagement_rate, 2),
                "top_posts": top_posts,
                "platform_stats": platform_stats,
                "avg_seo_score": round(avg_seo_score, 1),
                "avg_readability": round(avg_readability, 1)
            }
        )
    except Exception as e:
        print(f"Analytics page error: {e}")
        return HTMLResponse(content="<h1>Analytics Error</h1><p>Unable to load analytics.</p>", status_code=500)

@app.post("/api/analyze-seo")
async def analyze_seo(
    request: Request,
    content: str = Form(...),
    keywords: str = Form(""),
    title: str = Form(""),
    description: str = Form(""),
    user: User = Depends(require_auth)
):
    """Analyze SEO for content"""
    try:
        seo_score = calculate_seo_score(content, keywords, title, description)
        readability_score = calculate_readability_score(content)
        suggested_keywords = suggest_keywords(content)
        hashtags = extract_hashtags(content)
        
        return JSONResponse({
            "seo_score": round(seo_score, 1),
            "readability_score": round(readability_score, 1),
            "suggested_keywords": suggested_keywords,
            "hashtags": hashtags,
            "recommendations": get_seo_recommendations(seo_score, content, keywords, title, description)
        })
    except Exception as e:
        print(f"SEO analysis error: {e}")
        return JSONResponse({"error": "SEO analysis failed"}, status_code=500)

async def generate_ai_content_suggestions(topic: str, platform: str = "general", tone: str = "professional") -> Dict[str, any]:
    """Generate AI-powered content suggestions using OpenAI"""
    try:
        if not openai.api_key:
            return {
                "suggestions": [
                    f"Create engaging content about {topic}",
                    f"Share insights on {topic} with your audience",
                    f"Discuss the latest trends in {topic}"
                ],
                "hashtags": [f"#{topic.replace(' ', '')}", "#content", "#socialmedia"],
                "ai_powered": False
            }
        
        # Platform-specific prompts
        platform_prompts = {
            "instagram": "Create Instagram-friendly content with visual appeal",
            "twitter": "Create concise, engaging Twitter content under 280 characters",
            "linkedin": "Create professional LinkedIn content for business networking",
            "facebook": "Create engaging Facebook content for community building",
            "tiktok": "Create trendy, fun TikTok content ideas",
            "youtube": "Create compelling YouTube content descriptions",
            "general": "Create engaging social media content"
        }
        
        prompt = f"""
        Generate 3 creative social media content suggestions about '{topic}' for {platform}.
        Tone: {tone}
        
        Requirements:
        - {platform_prompts.get(platform, platform_prompts['general'])}
        - Make it engaging and shareable
        - Include call-to-action where appropriate
        
        Also suggest 5-8 relevant hashtags.
        
        Format your response as JSON with 'suggestions' array and 'hashtags' array.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a social media content expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.8
        )
        
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            result["ai_powered"] = True
            return result
        except json.JSONDecodeError:
            # Fallback parsing
            suggestions = re.findall(r'"([^"]*)"', content)[:3]
            hashtags = re.findall(r'#\w+', content)[:8]
            return {
                "suggestions": suggestions or [f"Create engaging content about {topic}"],
                "hashtags": hashtags or [f"#{topic.replace(' ', '')}", "#content"],
                "ai_powered": True
            }
            
    except Exception as e:
        print(f"AI content generation error: {e}")
        return {
            "suggestions": [
                f"Share your thoughts on {topic}",
                f"What's your experience with {topic}?",
                f"Let's discuss {topic} - what do you think?"
            ],
            "hashtags": [f"#{topic.replace(' ', '')}", "#discussion", "#community"],
            "ai_powered": False
        }

async def generate_ai_hashtags(content: str, platform: str = "general") -> List[str]:
    """Generate AI-powered hashtag recommendations"""
    try:
        if not openai.api_key:
            # Fallback hashtag generation
            words = re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())
            stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
            keywords = [word for word in words if word not in stop_words][:5]
            return [f"#{word}" for word in keywords] + ["#socialmedia", "#content"]
        
        prompt = f"""
        Analyze this social media content and suggest 8-12 relevant hashtags for {platform}:
        
        Content: "{content}"
        
        Requirements:
        - Mix of popular and niche hashtags
        - Platform-appropriate hashtags
        - Include trending hashtags where relevant
        - Avoid overly generic hashtags
        
        Return only the hashtags, one per line, starting with #
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a social media hashtag expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        hashtags = re.findall(r'#\w+', response.choices[0].message.content)
        return hashtags[:12]
        
    except Exception as e:
        print(f"AI hashtag generation error: {e}")
        # Fallback hashtag generation
        words = re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())
        return [f"#{word}" for word in words[:5]] + ["#ai", "#content"]

def get_seo_recommendations(score: float, content: str, keywords: str, title: str, description: str) -> list:
    """Get SEO improvement recommendations"""
    recommendations = []
    
    if score < 50:
        recommendations.append("Your content needs significant SEO improvements")
    elif score < 70:
        recommendations.append("Good SEO foundation, but there's room for improvement")
    else:
        recommendations.append("Excellent SEO optimization!")
    
    # Content length recommendations
    word_count = len(content.split())
    if word_count < 20:
        recommendations.append("Consider adding more content (aim for 50-300 words)")
    elif word_count > 500:
        recommendations.append("Consider shortening your content for better engagement")
    
    # Keywords recommendations
    if not keywords:
        recommendations.append("Add relevant keywords to improve discoverability")
    
    # Title recommendations
    if not title:
        recommendations.append("Add a compelling title (30-60 characters)")
    elif len(title) < 30:
        recommendations.append("Consider making your title longer (30-60 characters)")
    elif len(title) > 80:
        recommendations.append("Consider shortening your title (30-60 characters)")
    
    # Description recommendations
    if not description:
        recommendations.append("Add a meta description (120-160 characters)")
    elif len(description) < 120:
        recommendations.append("Consider making your description longer (120-160 characters)")
    elif len(description) > 200:
        recommendations.append("Consider shortening your description (120-160 characters)")
    
    # Hashtag recommendations
    hashtag_count = len(re.findall(r'#\w+', content))
    if hashtag_count == 0:
        recommendations.append("Add relevant hashtags to increase reach")
    elif hashtag_count > 10:
        recommendations.append("Consider reducing hashtags (3-8 is optimal)")
    
    return recommendations

def get_trending_hashtags(platform: str = "general") -> List[str]:
    """Get platform-specific trending hashtags"""
    trending_by_platform = {
        "instagram": ["#instagood", "#photooftheday", "#love", "#beautiful", "#happy", "#follow", "#fashion", "#art"],
        "twitter": ["#trending", "#viral", "#breaking", "#news", "#follow", "#retweet", "#thread", "#discussion"],
        "tiktok": ["#fyp", "#foryou", "#viral", "#trending", "#duet", "#challenge", "#funny", "#dance"],
        "linkedin": ["#professional", "#career", "#business", "#networking", "#leadership", "#innovation", "#growth", "#success"],
        "facebook": ["#community", "#family", "#friends", "#share", "#like", "#love", "#memories", "#celebration"],
        "youtube": ["#subscribe", "#video", "#content", "#creator", "#tutorial", "#review", "#entertainment", "#education"],
        "pinterest": ["#diy", "#inspiration", "#home", "#fashion", "#food", "#travel", "#wedding", "#design"],
        "general": ["#content", "#social", "#digital", "#online", "#community", "#share", "#engage", "#connect"]
    }
    
    return trending_by_platform.get(platform, trending_by_platform["general"])

def get_optimal_hashtag_count(platform: str) -> int:
    """Get optimal hashtag count per platform"""
    optimal_counts = {
        "instagram": 8,
        "twitter": 2,
        "tiktok": 5,
        "linkedin": 3,
        "facebook": 3,
        "youtube": 5,
        "pinterest": 10,
        "general": 5
    }
    
    return optimal_counts.get(platform, 5)

@app.post("/api/update-analytics/{post_id}")
async def update_analytics(
    post_id: int,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Update analytics data for a post (simulation)"""
    try:
        post = db.query(PostLog).filter(PostLog.id == post_id, PostLog.user_id == user.id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Simulate fetching analytics data
        analytics_data = simulate_analytics_data(post_id)
        
        # Update post with analytics data
        post.views = analytics_data['views']
        post.likes = analytics_data['likes']
        post.shares = analytics_data['shares']
        post.comments = analytics_data['comments']
        post.clicks = analytics_data['clicks']
        post.reach = analytics_data['reach']
        post.impressions = analytics_data['impressions']
        
        # Calculate engagement rate
        total_engagements = post.likes + post.shares + post.comments + post.clicks
        post.engagement_rate = (total_engagements / max(post.reach, 1)) * 100 if post.reach else 0
        
        db.commit()
        
        return JSONResponse({
            "message": "Analytics updated successfully",
            "analytics": analytics_data,
            "engagement_rate": round(post.engagement_rate, 2)
        })
    except Exception as e:
        print(f"Update analytics error: {e}")
        return JSONResponse({"error": "Failed to update analytics"}, status_code=500)

@app.post("/api/ai-content-suggestions")
async def get_ai_content_suggestions(
    request: Request,
    topic: str = Form(...),
    platform: str = Form("general"),
    tone: str = Form("professional"),
    user: User = Depends(require_auth)
):
    """Get AI-powered content suggestions"""
    try:
        suggestions = await generate_ai_content_suggestions(topic, platform, tone)
        return JSONResponse(suggestions)
    except Exception as e:
        print(f"AI content suggestions error: {e}")
        return JSONResponse({"error": "Failed to generate content suggestions"}, status_code=500)

@app.post("/api/ai-hashtags")
async def get_ai_hashtags(
    request: Request,
    content: str = Form(...),
    platform: str = Form("general"),
    user: User = Depends(require_auth)
):
    """Get AI-powered hashtag recommendations"""
    try:
        hashtags = await generate_ai_hashtags(content, platform)
        return JSONResponse({"hashtags": hashtags})
    except Exception as e:
        print(f"AI hashtag generation error: {e}")
        return JSONResponse({"error": "Failed to generate hashtags"}, status_code=500)

@app.post("/api/enhance-content")
async def enhance_content_with_ai(
    request: Request,
    content: str = Form(...),
    platform: str = Form("general"),
    user: User = Depends(require_auth)
):
    """Enhance existing content with AI suggestions"""
    try:
        if not openai.api_key:
            return JSONResponse({
                "enhanced_content": content,
                "suggestions": ["Add emojis to make it more engaging", "Consider adding a call-to-action"],
                "ai_powered": False
            })
        
        prompt = f"""
        Enhance this social media content for {platform}:
        
        Original: "{content}"
        
        Provide:
        1. An enhanced version of the content
        2. 3 specific improvement suggestions
        
        Keep the core message but make it more engaging and platform-appropriate.
        
        Format as JSON with 'enhanced_content' and 'suggestions' array.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a social media content optimization expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            result["ai_powered"] = True
            return JSONResponse(result)
        except json.JSONDecodeError:
            return JSONResponse({
                "enhanced_content": content,
                "suggestions": ["Consider adding emojis", "Add a call-to-action", "Make it more conversational"],
                "ai_powered": True
            })
            
    except Exception as e:
        print(f"Content enhancement error: {e}")
        return JSONResponse({"error": "Failed to enhance content"}, status_code=500)

@app.post("/api/generate-content-ideas")
async def generate_content_ideas(
    request: Request,
    topic: str = Form(...),
    platform: str = Form("general"),
    tone: str = Form("professional"),
    user: User = Depends(require_auth)
):
    """Generate AI-powered content ideas"""
    try:
        suggestions = await generate_ai_content_suggestions(topic, platform, tone)
        return JSONResponse(suggestions)
    except Exception as e:
        print(f"Content ideas generation error: {e}")
        return JSONResponse({"error": "Failed to generate content ideas"}, status_code=500)

@app.post("/api/optimize-hashtags")
async def optimize_hashtags(
    request: Request,
    content: str = Form(...),
    platform: str = Form("general"),
    user: User = Depends(require_auth)
):
    """Get optimized hashtag recommendations"""
    try:
        hashtags = await generate_ai_hashtags(content, platform)
        trending_hashtags = get_trending_hashtags(platform)
        
        return JSONResponse({
            "ai_hashtags": hashtags,
            "trending_hashtags": trending_hashtags,
            "recommended_count": get_optimal_hashtag_count(platform)
        })
    except Exception as e:
        print(f"Hashtag optimization error: {e}")
        return JSONResponse({"error": "Failed to optimize hashtags"}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
