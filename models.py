from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    posts = relationship("PostLog", back_populates="user")

class PostLog(Base):
    __tablename__ = "post_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    platforms = Column(String(255), nullable=False)  # Comma-separated
    file_path = Column(String(255), nullable=True)
    file_type = Column(String(20), nullable=True)  # image, video
    scheduled_for = Column(DateTime, nullable=True)
    status = Column(String(20), default="pending")  # pending, completed, failed
    results = Column(Text, nullable=True)  # JSON string of results
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Analytics fields
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    
    # SEO fields
    seo_keywords = Column(Text, nullable=True)  # Comma-separated keywords
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    hashtags = Column(Text, nullable=True)  # Comma-separated hashtags
    seo_score = Column(Float, default=0.0)
    readability_score = Column(Float, default=0.0)
    
    # Relationship
    user = relationship("User", back_populates="posts")
