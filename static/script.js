// Global JavaScript functions for Anonymous Creations Dashboard

// Initialize variables
let currentLang = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

// Language translations
const translations = {
    en: {
        brand_title: "Anonymous Creations",
        brand_subtitle: "Social Media Dashboard",
        dashboard: "Dashboard",
        analytics: "Analytics",
        settings: "Settings",
        welcome: "Welcome",
        logout: "Logout",
        dark: "Dark",
        light: "Light",
        total_posts: "Total Posts",
        successful: "Successful",
        failed: "Failed",
        pending: "Pending",
        create_post: "Create Post",
        content: "Content",
        content_placeholder: "What's on your mind? Share your thoughts with the world...",
        select_platforms: "Select Platforms",
        telegram: "Telegram",
        instagram: "Instagram",
        youtube: "YouTube",
        tiktok: "TikTok",
        facebook: "Facebook",
        twitter: "Twitter",
        linkedin: "LinkedIn",
        snapchat: "Snapchat",
        pinterest: "Pinterest",
        reddit: "Reddit",
        discord: "Discord",
        whatsapp: "WhatsApp",
        threads: "Threads",
        medium: "Medium",
        tumblr: "Tumblr",
        upload_media: "Upload Media",
        upload_file: "Upload a file",
        drag_drop: "or drag and drop",
        file_limit: "Images or Videos up to 10MB",
        schedule: "Schedule (Optional)",
        post_now: "Post Now",
        recent_posts: "Recent Posts",
        success: "Success",
        no_posts: "No recent posts found",
        posting: "Posting...",
        file_too_large: "File size must be under 10MB",
        invalid_file: "Invalid file type"
    },
    ar: {
        brand_title: "الإبداعات المجهولة",
        brand_subtitle: "لوحة تحكم وسائل التواصل الاجتماعي",
        dashboard: "لوحة التحكم",
        analytics: "التحليلات",
        settings: "الإعدادات",
        welcome: "مرحباً",
        logout: "تسجيل الخروج",
        dark: "داكن",
        light: "فاتح",
        total_posts: "إجمالي المنشورات",
        successful: "ناجح",
        failed: "فشل",
        pending: "قيد الانتظار",
        create_post: "إنشاء منشور",
        content: "المحتوى",
        content_placeholder: "ماذا يدور في ذهنك؟ شارك أفكارك مع العالم...",
        select_platforms: "اختر المنصات",
        telegram: "تيليجرام",
        instagram: "إنستجرام",
        youtube: "يوتيوب",
        tiktok: "تيك توك",
        facebook: "فيسبوك",
        twitter: "تويتر",
        linkedin: "لينكد إن",
        snapchat: "سناب شات",
        pinterest: "بينتريست",
        reddit: "ريديت",
        discord: "ديسكورد",
        whatsapp: "واتساب",
        threads: "ثريدز",
        medium: "ميديم",
        tumblr: "تمبلر",
        upload_media: "رفع الوسائط",
        upload_file: "رفع ملف",
        drag_drop: "أو اسحب وأفلت",
        file_limit: "صور أو فيديوهات حتى 10 ميجابايت",
        schedule: "جدولة (اختياري)",
        post_now: "انشر الآن",
        recent_posts: "المنشورات الحديثة",
        success: "نجح",
        no_posts: "لا توجد منشورات حديثة",
        posting: "جاري النشر...",
        file_too_large: "حجم الملف يجب أن يكون أقل من 10 ميجابايت",
        invalid_file: "نوع الملف غير صالح"
    }
};

// Language and theme management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    updateTheme();
}

function updateTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (currentTheme === 'dark') {
        html.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun text-sm';
        if (themeText) {
            themeText.textContent = translations[currentLang]['light'] || 'Light';
            themeText.setAttribute('data-translate', 'light');
        }
    } else {
        html.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon text-sm';
        if (themeText) {
            themeText.textContent = translations[currentLang]['dark'] || 'Dark';
            themeText.setAttribute('data-translate', 'dark');
        }
    }
}

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', currentLang);
    updateLanguage();
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}

function updateLanguage() {
    const html = document.getElementById('html-root');
    const body = document.getElementById('body-root');
    const langIcon = document.getElementById('lang-icon');
    const langText = document.getElementById('lang-text');

    const languageInfo = {
        en: { flag: '🇺🇸', name: 'EN', direction: 'ltr' },
        ar: { flag: '🇵🇸', name: 'العربية', direction: 'rtl' }
    };

    const langInfo = languageInfo[currentLang] || languageInfo['en'];

    if (html) {
        html.dir = langInfo.direction;
        html.lang = currentLang;
    }

    if (currentLang === 'ar') {
        if (body) {
            body.classList.add('font-arabic');
            body.classList.remove('font-english');
        }
    } else {
        if (body) {
            body.classList.add('font-english');
            body.classList.remove('font-arabic');
        }
    }

    if (langIcon) langIcon.textContent = langInfo.flag;
    if (langText) langText.textContent = langInfo.name;

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = translations[currentLang][key];
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Utility function to get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Toast notifications
function showToast(message, type = 'info') {
    if (typeof Swal !== 'undefined') {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        toast.fire({
            icon: type,
            title: message
        });
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// File validation
function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];

    if (file.size > maxSize) {
        return { valid: false, message: t('file_too_large') };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, message: t('invalid_file') };
    }

    return { valid: true, message: '' };
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Auto-save draft functionality
let draftTimer;
const DRAFT_KEY = 'post_draft';

function saveDraft() {
    const contentEl = document.getElementById('content');
    if (contentEl && contentEl.value.trim() && contentEl.value.trim().length > 5) {
        const draft = {
            content: contentEl.value,
            timestamp: Date.now()
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
}

function loadDraft() {
    try {
        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
        if (draft && draft.content && draft.content.trim()) {
            const contentEl = document.getElementById('content');
            if (contentEl && !contentEl.value.trim()) {
                if (draft.content.trim().length > 5) {
                    contentEl.value = draft.content;
                    showToast('Draft loaded', 'info');
                }
            }
        }
    } catch (e) {
        console.warn('Failed to load draft:', e);
    }
}

function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

// Mobile-specific enhancements
function initMobileFeatures() {
    // Prevent iOS zoom on input focus
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });
            input.addEventListener('blur', function() {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });
        });
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('lang-button');
    if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Anonymous Creations Dashboard script loaded');
    
    // Initialize theme and language
    updateTheme();
    updateLanguage();
    
    // Initialize mobile features
    initMobileFeatures();
    
    // Initialize draft functionality
    const contentEl = document.getElementById('content');
    if (contentEl) {
        loadDraft();
        
        // Auto-save as user types
        contentEl.addEventListener('input', function() {
            clearTimeout(draftTimer);
            draftTimer = setTimeout(saveDraft, 2000);
        });
    }
    
    console.log('Dashboard script initialization complete');
});