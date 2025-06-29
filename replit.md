# Anonymous Creations - Social Media Dashboard

## Overview
This is a comprehensive social media management dashboard that allows users to create and schedule posts across multiple platforms. The application provides a modern web interface for managing social media content with multi-platform posting capabilities, featuring Arabic/English language support and responsive design.

## System Architecture

### Backend Framework
- **FastAPI**: Modern Python web framework for building APIs
- **SQLAlchemy**: Object-relational mapping for database operations
- **Jinja2 Templates**: Server-side HTML templating

### Authentication & Security
- **JWT Tokens**: JSON Web Tokens for session management
- **bcrypt**: Password hashing and verification
- **Session-based Authentication**: Server-side session management
- Token expiration: 30 minutes for access tokens

### Database Design
- **SQLAlchemy ORM**: Database abstraction layer
- **SQLite**: Default database (configurable via DATABASE_URL)
- Two main entities:
  - **Users**: Authentication and user management
  - **PostLog**: Post history and scheduling

### Frontend Architecture
- **Server-side Rendering**: HTML templates with Jinja2
- **TailwindCSS**: Utility-first CSS framework
- **SweetAlert2**: Enhanced user notifications
- **Font Awesome**: Icon library
- **JavaScript**: Client-side interactivity

## Key Components

### Authentication System (`auth.py`)
- Password hashing with bcrypt
- JWT token creation and verification
- Configurable token expiration
- Environment-based secret key management

### Database Layer (`database.py`, `models.py`)
- SQLAlchemy engine configuration
- Session management with dependency injection
- User model with relationship to posts
- PostLog model for tracking post status and results

### Social Media Integration (`social_platforms.py`)
- Multi-platform posting capabilities
- Supported platforms: Telegram, Instagram, YouTube, TikTok
- Async posting with aiohttp
- Environment-based API credential management

### File Management
- Upload directory structure
- File type validation (images and videos)
- 10MB file size limit
- Static file serving for uploads

## Data Flow

1. **User Authentication**: Login → Session creation → Dashboard access
2. **Post Creation**: Content input → File upload → Platform selection → Database storage
3. **Post Scheduling**: Immediate or scheduled posting → Social platform APIs → Result logging
4. **File Handling**: Upload → Validation → Storage → Static serving

## External Dependencies

### Python Packages
- FastAPI ecosystem (FastAPI, Uvicorn, Jinja2)
- Database (SQLAlchemy, sqlite3)
- Authentication (PyJWT, bcrypt)
- HTTP clients (requests, aiohttp)

### Frontend Libraries
- TailwindCSS (CDN)
- SweetAlert2 (CDN)
- Font Awesome (CDN)
- Google Fonts (Noto Sans Arabic, Inter)

### Social Media APIs
- Telegram Bot API
- Instagram Basic Display API
- YouTube Data API
- TikTok for Developers API

## Deployment Strategy

### Environment Configuration
Required environment variables:
- `SECRET_KEY`: JWT signing key
- `DATABASE_URL`: Database connection string
- Platform-specific API credentials (Telegram, Instagram, YouTube, TikTok)

### File Structure
- Static assets served from `/static` and `/uploads`
- Templates in `/templates` directory
- SQLite database file (default: `dashboard.db`)

### Database Initialization
- Automatic table creation on startup
- User and PostLog tables with proper relationships
- Foreign key constraints and indexing

## Changelog
- June 29, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.