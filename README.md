# Anonymous Creations - Social Media Management Dashboard

A professional, full-stack social media management platform built with FastAPI and modern web technologies. Manage and schedule posts across multiple social media platforms from a single, unified dashboard.

## 🚀 Features

### Core Functionality
- **Multi-Platform Posting**: Support for Telegram, Instagram, YouTube, and TikTok
- **File Upload Management**: Handle images and videos up to 10MB
- **Post Scheduling**: Schedule posts for optimal timing
- **Real-time Status Tracking**: Monitor post success/failure across platforms
- **Comprehensive Logging**: Detailed post history and analytics

### User Interface
- **Responsive Design**: TailwindCSS-powered modern UI
- **Dark/Light Theme**: Automatic theme switching
- **Multi-Language Support**: English and Arabic with RTL layout
- **Professional Dashboard**: Clean, intuitive interface
- **Advanced Analytics**: Post performance tracking and statistics

### Security & Administration
- **Secure Authentication**: Session-based login system
- **Password Hashing**: bcrypt encryption
- **Environment Configuration**: Secure API key management
- **Rate Limiting**: Built-in API protection
- **Session Management**: Configurable timeout settings

## 📋 Prerequisites

- Python 3.11+
- pip package manager
- Social Media API Credentials (optional for testing)

## 🛠️ Installation & Setup

### 1. Clone or Download
```bash
# If using git
git clone <repository-url>
cd anonymous-creations-dashboard

# Or download and extract the project files
```

### 2. Install Dependencies
```bash
pip install fastapi uvicorn sqlalchemy bcrypt pyjwt python-multipart requests aiohttp jinja2 python-dotenv psycopg2-binary itsdangerous
```

### 3. Environment Configuration
Create a `.env` file in the project root (already provided):

```env
# Admin Configuration
ADMIN_PASSWORD=admin123
SECRET_KEY=your_super_secret_key_change_this_in_production_123456789

# Database Configuration
DATABASE_URL=sqlite:///./dashboard.db

# Social Media API Keys (Configure as needed)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id_here
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token_here
TIKTOK_OPEN_ID=your_tiktok_open_id_here
```

### 4. Run the Application
```bash
python main.py
```

The dashboard will be available at `http://localhost:5000`

## 🔐 Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

> **Security Note**: Change the default password immediately after first login through the Settings page.

## 📱 Social Media Platform Setup

### Telegram Bot
1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your Bot Token
3. Add bot to your channel/group and get Chat ID
4. Update `.env` with `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

### Instagram Business API
1. Create a Facebook Developer account
2. Set up Instagram Business API
3. Get Access Token and Business Account ID
4. Update `.env` with Instagram credentials

### YouTube Data API
1. Create a Google Cloud Project
2. Enable YouTube Data API v3
3. Create API Key
4. Get your Channel ID
5. Update `.env` with YouTube credentials

### TikTok Business API
1. Apply for TikTok for Developers
2. Create a Business API application
3. Get Access Token and Open ID
4. Update `.env` with TikTok credentials

## 📊 Dashboard Features

### Main Dashboard
- **Post Creation**: Rich text editor with file upload
- **Platform Selection**: Multi-select platform targeting
- **Scheduling**: Optional date/time scheduling
- **Real-time Feedback**: Instant success/error notifications

### Analytics Page
- **Performance Metrics**: Success rate, total posts, platform breakdown
- **Advanced Filtering**: Filter by status, platform, date range
- **Detailed Logs**: Complete post history with expandable details
- **Export Options**: Download logs and reports

### Settings & Configuration
- **Platform Management**: Configure API credentials
- **Security Settings**: Change passwords, session management
- **User Preferences**: Default platforms, notifications
- **System Configuration**: Rate limiting, file upload settings

## 🔧 Technical Architecture

### Backend (FastAPI)
- **Modern Python Framework**: FastAPI with automatic API documentation
- **Database**: SQLAlchemy ORM with SQLite (configurable)
- **Authentication**: JWT tokens with session middleware
- **File Handling**: Secure upload with validation
- **API Integration**: Async HTTP clients for platform APIs

### Frontend (Web)
- **CSS Framework**: TailwindCSS for responsive design
- **JavaScript**: Modern ES6+ with async/await
- **Templating**: Jinja2 server-side rendering
- **UI Components**: SweetAlert2 for notifications
- **Icons**: Font Awesome integration

### Database Schema
- **Users Table**: Authentication and user management
- **PostLog Table**: Complete post history and status tracking
- **Relationships**: Foreign key constraints and indexing

## 📁 Project Structure

```
anonymous-creations-dashboard/
├── main.py                 # FastAPI application entry point
├── auth.py                 # Authentication utilities
├── database.py             # Database configuration
├── models.py               # SQLAlchemy models
├── social_platforms.py     # Social media API integrations
├── templates/              # HTML templates
│   ├── base.html          # Base template with common elements
│   ├── login.html         # Login page
│   ├── dashboard.html     # Main dashboard
│   ├── logs.html          # Analytics and logs page
│   └── settings.html      # Settings and configuration
├── static/                 # Static assets
│   ├── style.css          # Custom styles
│   └── script.js          # JavaScript functionality
├── uploads/                # File upload directory
├── .env                   # Environment variables
├── .env.example          # Environment template
├── replit.md             # Project documentation
└── README.md             # This file
```

## 🚀 Deployment

### Local Development
```bash
python main.py
```

### Production Deployment
1. **Update Environment Variables**: Change default passwords and secrets
2. **Database**: Consider PostgreSQL for production
3. **Web Server**: Use production ASGI server like Gunicorn + Uvicorn
4. **Reverse Proxy**: Configure Nginx for static files and SSL
5. **Monitoring**: Set up logging and error tracking

### Docker Deployment (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "main.py"]
```

## 🔒 Security Considerations

- **Change Default Credentials**: Update admin password immediately
- **Secure API Keys**: Never commit real API keys to version control
- **HTTPS**: Use SSL certificates in production
- **Rate Limiting**: Configure appropriate API limits
- **Session Security**: Set secure session timeouts
- **File Upload**: Validate file types and sizes

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
- Ensure SQLite file permissions are correct
- Check DATABASE_URL in `.env` file

**API Connection Failures**
- Verify API credentials in `.env`
- Check platform-specific setup requirements
- Test individual platform connections in Settings

**File Upload Issues**
- Check file size limits (default: 10MB)
- Verify upload directory permissions
- Ensure supported file types

**Authentication Problems**
- Clear browser cache and cookies
- Check session middleware configuration
- Verify SECRET_KEY in environment

## 📈 Feature Roadmap

- [ ] Bulk post scheduling
- [ ] Advanced analytics dashboard
- [ ] Custom post templates
- [ ] Team collaboration features
- [ ] API webhooks for external integrations
- [ ] Advanced file processing
- [ ] Custom platform integrations

## 📄 License

This project is available for personal and commercial use. See license terms for details.

## 🤝 Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review configuration settings
3. Verify API credentials setup
4. Test with minimal configuration first

---

**Anonymous Creations Dashboard** - Professional social media management made simple.