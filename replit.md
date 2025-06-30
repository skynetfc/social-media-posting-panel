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

## Recent Updates

### June 30, 2025 - Professional Authentication & Enhanced Settings Structure
- Redesigned login/signup with professional glass morphism interface matching project theme
- Fixed dark/light mode toggle transitions to prevent white-to-black flashing on reload
- Implemented smooth theme switching with proper preload class management
- Created comprehensive settings structure with organized sections:
  - Account Statistics (Total Posts, Success Rate, Account Status)
  - Platform Configuration (12 social media platforms with test capabilities)
  - Security Preferences (2FA, Session Timeout, Password Encryption)
  - API Configuration (Rate Limits, Version Info, Security Warnings)
  - System Settings (File Limits, Performance Settings)
- Added complete platform integration (Twitter, LinkedIn, Snapchat, Pinterest, Reddit, Discord, WhatsApp, Threads, Medium, Tumblr)
- Enhanced dashboard with full platform selection grid and responsive design
- Implemented professional tabbed login interface with password visibility toggles
- Added comprehensive test functions for all platform configurations
- Fixed theme transition issues with CSS variable management

### June 29, 2025 - Complete Enhancement Package
- Enhanced mobile CSS with breakpoints for phones, tablets, and desktop devices
- Added mobile navigation menu with touch-friendly icons below the main header
- Improved touch targets with minimum 44px size for better mobile usability
- Made platform selection cards stack vertically on mobile with larger touch areas
- Enhanced table responsiveness with horizontal scrolling on small screens
- Added mobile-specific JavaScript for iOS zoom prevention and touch feedback
- Optimized form layouts to single column on mobile, two columns on tablet+
- Improved settings page with responsive navigation grid
- Added proper viewport meta tag to prevent unwanted zooming
- Enhanced modal sizing for mobile devices with proper overflow handling
- Fixed Chrome authentication issue with proper session middleware configuration
- Statistics cards now display in 2x2 grid on mobile, 1x4 on desktop
- Navigation switches between horizontal (desktop) and vertical mobile menu
- All buttons and interactive elements meet touch accessibility standards

### June 29, 2025 - Palestinian Flag Branding & Facebook Integration
- Created fixed header with Anonymous Creations logo featuring Palestinian flag 🇵🇸
- Enhanced theme toggle with light/dark mode indicators in fixed header position
- Added language toggle with US/Palestinian flag icons and text labels
- Added Facebook platform configuration to settings page with comprehensive setup guide
- Implemented Facebook connection testing with real-time validation
- Enhanced dashboard statistics with gradient cards and success rate calculations
- Added platform status monitoring sidebar with configuration links
- Integrated Facebook into post creation flow and recent posts display
- Updated translations for Arabic and English including Facebook support
- Created comprehensive Facebook setup guide with step-by-step instructions

### Current Status
- Fully functional social media management dashboard
- Professional UI/UX with comprehensive responsive design optimized for mobile and desktop
- Multi-language support (English/Arabic) with RTL layout
- Complete API integration framework for 4 major platforms
- Advanced analytics and logging system
- Secure authentication and session management with Chrome compatibility
- Mobile-first responsive design with touch-friendly interfaces
- Ready for production deployment

## Changelog
- June 29, 2025. Initial setup and complete professional enhancement

## User Preferences

Preferred communication style: Simple, everyday language.
Project requirements: Professional social media dashboard with consistent theme design.
Login page preference: Professional design matching project theme, not experimental/creative designs.
Settings structure: Organized sections (Account Statistics, Platform Configuration, Security Preferences, API Configuration, System Settings).
Theme toggle: Smooth transitions without white-to-black flashing on page reload.