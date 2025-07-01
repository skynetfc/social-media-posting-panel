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
        start_creating: "Start creating content to see your posts here",
        posting: "Posting..."
    },
    ar: {
        brand_title: "إبداعات مجهولة",
        brand_subtitle: "لوحة تحكم وسائل التواصل",
        dashboard: "لوحة التحكم",
        analytics: "التحليلات",
        settings: "الإعدادات",
        welcome: "مرحباً",
        logout: "تسجيل الخروج",
        dark: "مظلم",
        light: "فاتح",
        total_posts: "إجمالي المنشورات",
        successful: "نجح",
        failed: "فشل",
        pending: "قيد الانتظار",
        create_post: "إنشاء منشور",
        content: "المحتوى",
        content_placeholder: "ما الذي تفكر به؟ شارك أفكارك مع العالم...",
        select_platforms: "اختر المنصات",
        telegram: "تيليجرام",
        instagram: "انستجرام",
        youtube: "يوتيوب",
        tiktok: "تيك توك",
        facebook: "فيسبوك",
        twitter: "تويتر",
        linkedin: "لينكد إن",
        snapchat: "سناب شات",
        pinterest: "بينتيريست",
        reddit: "ريديت",
        discord: "ديسكورد",
        whatsapp: "واتساب",
        threads: "ثريدز",
        medium: "ميديوم",
        tumblr: "تمبلر",
        upload_media: "رفع الوسائط",
        upload_file: "رفع ملف",
        drag_drop: "أو اسحب وأفلت",
        file_limit: "صور أو فيديوهات حتى 10 ميجابايت",
        schedule: "الجدولة (اختياري)",
        post_now: "انشر الآن",
        recent_posts: "المنشورات الأخيرة",
        success: "نجح",
        no_posts: "لا توجد منشورات حديثة",
        start_creating: "ابدأ في إنشاء المحتوى لرؤية منشوراتك هنا",
        posting: "جارٍ النشر..."
    }
};

const languageInfo = {
    en: { flag: '🇺🇸', name: 'EN', fullName: 'English', direction: 'ltr' },
    ar: { flag: '🇵🇸', name: 'العربية', fullName: 'العربية', direction: 'rtl' }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Dashboard...');
    updateTheme();
    updateLanguage();
    initializeFormHandlers();
    initializePlatformSelection();
    initializeFileUpload();
    loadDraft();
    console.log('Dashboard initialized successfully');
});

// Language dropdown functions
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

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('lang-button');
    if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// Language and theme management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    updateTheme();
    console.log('Theme toggled to:', currentTheme);
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

function updateLanguage() {
    const html = document.documentElement;
    const body = document.body;
    const langIcon = document.getElementById('lang-icon');
    const langText = document.getElementById('lang-text');

    const langInfo = languageInfo[currentLang] || languageInfo['en'];

    // Set direction and language
    html.dir = langInfo.direction;
    html.lang = currentLang;

    // Update font classes
    if (currentLang === 'ar') {
        html.className = html.className.replace('font-english', '').replace('font-arabic', '') + ' font-arabic';
        if (body) {
            body.classList.add('font-arabic');
            body.classList.remove('font-english');
        }
    } else {
        html.className = html.className.replace('font-arabic', '').replace('font-english', '') + ' font-english';
        if (body) {
            body.classList.add('font-english');
            body.classList.remove('font-arabic');
        }
    }

    // Update language indicator
    if (langIcon) langIcon.textContent = langInfo.flag;
    if (langText) langText.textContent = langInfo.name;

    // Set text direction styles
    if (langInfo.direction === 'rtl') {
        document.documentElement.style.direction = 'rtl';
        document.body.style.textAlign = 'right';
    } else {
        document.documentElement.style.direction = 'ltr';
        document.body.style.textAlign = 'left';
    }

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });

    // Update submit button text
    const submitText = document.getElementById('submitText');
    if (submitText) {
        submitText.textContent = translations[currentLang]['post_now'] || 'Post Now';
    }

    // Update theme text
    updateTheme();
}

// Platform selection handling
function initializePlatformSelection() {
    const platformCards = document.querySelectorAll('.platform-card');

    platformCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const label = card.querySelector('label');
        const checkIcon = card.querySelector('.platform-check');

        if (checkbox && label) {
            // Remove any existing event listeners
            card.replaceWith(card.cloneNode(true));

            // Get the new card reference after cloning
            const newCard = document.querySelector(`label[for="${checkbox.id}"]`).closest('.platform-card');
            const newCheckbox = newCard.querySelector('input[type="checkbox"]');
            const newLabel = newCard.querySelector('label');

            // Handle click on the entire card
            newCard.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                newCheckbox.checked = !newCheckbox.checked;
                updatePlatformCardAppearance(newCard, newCheckbox.checked);
                console.log('Platform toggled:', newCheckbox.value, newCheckbox.checked);
            });

            // Handle direct checkbox change
            newCheckbox.addEventListener('change', function(e) {
                e.stopPropagation();
                updatePlatformCardAppearance(newCard, this.checked);
            });

            // Initialize appearance
            updatePlatformCardAppearance(newCard, newCheckbox.checked);
        }
    });
}

function updatePlatformCardAppearance(card, isSelected) {
    const label = card.querySelector('label');
    const checkIcon = card.querySelector('.platform-check');

    if (isSelected) {
        label.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30');
        label.classList.remove('border-gray-200', 'dark:border-gray-600');
        if (checkIcon) {
            checkIcon.classList.remove('opacity-0');
            checkIcon.classList.add('opacity-100');
        }
    } else {
        label.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30');
        label.classList.add('border-gray-200', 'dark:border-gray-600');
        if (checkIcon) {
            checkIcon.classList.add('opacity-0');
            checkIcon.classList.remove('opacity-100');
        }
    }
}

// File upload handling
function initializeFileUpload() {
    const fileInput = document.getElementById('media');
    const filePreview = document.getElementById('filePreview');
    const fileInfo = document.getElementById('fileInfo');
    const removeFileBtn = document.getElementById('removeFile');
    const dropZone = document.querySelector('.border-dashed');

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop functionality
        if (dropZone) {
            dropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
            });

            dropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
            });

            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    handleFileSelect({ target: fileInput });
                }
            });

            dropZone.addEventListener('click', function() {
                fileInput.click();
            });
        }
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function() {
            clearFilePreview();
        });
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileInfo = document.getElementById('fileInfo');

    if (!file) {
        clearFilePreview();
        return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: validation.message,
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
        });
        clearFilePreview();
        return;
    }

    // Show file name and size
    if (fileName) {
        fileName.textContent = `${file.name} (${formatFileSize(file.size)})`;
    }

    // Show preview
    if (fileInfo) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const fileType = file.type.startsWith('image/') ? 'image' : 'video';

            if (fileType === 'image') {
                fileInfo.innerHTML = `
                    <div class="flex items-center space-x-3 mt-2">
                        <img src="${e.target.result}" class="w-16 h-16 object-cover rounded-lg" alt="Preview">
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white text-sm">${file.name}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">${formatFileSize(file.size)} • Image</p>
                        </div>
                    </div>
                `;
            } else {
                fileInfo.innerHTML = `
                    <div class="flex items-center space-x-3 mt-2">
                        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <i class="fas fa-video text-2xl text-gray-600 dark:text-gray-400"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white text-sm">${file.name}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">${formatFileSize(file.size)} • Video</p>
                        </div>
                    </div>
                `;
            }
        };

        reader.readAsDataURL(file);
    }

    if (filePreview) {
        filePreview.classList.remove('hidden');
    }

    console.log('File selected:', file.name, formatFileSize(file.size));
}

function clearFilePreview() {
    const fileInput = document.getElementById('media');
    const filePreview = document.getElementById('filePreview');
    const fileInfo = document.getElementById('fileInfo');

    if (fileInput) fileInput.value = '';
    if (filePreview) filePreview.classList.add('hidden');
    if (fileInfo) fileInfo.innerHTML = '';

    console.log('File preview cleared');
}

// Form handling
function initializeFormHandlers() {
    const postForm = document.getElementById('postForm');

    if (postForm) {
        postForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const platforms = formData.getAll('platforms');

            if (platforms.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Platforms Selected',
                    text: 'Please select at least one platform to post to.',
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
                });
                return;
            }

            const content = formData.get('content');
            if (!content || content.trim().length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Content',
                    text: 'Please enter some content to post.',
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
                });
                return;
            }

            await submitPost(formData);
        });
    }
}

async function submitPost(formData) {
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');

    try {
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            if (submitText) submitText.textContent = translations[currentLang]['posting'] || 'Posting...';
            if (submitSpinner) submitSpinner.classList.remove('hidden');
        }

        const response = await fetch('/post', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Posted Successfully!',
                text: result.message,
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });

            // Clear form and draft
            document.getElementById('postForm').reset();
            clearFilePreview();
            clearDraft();

            // Reset platform selections
            document.querySelectorAll('.platform-card').forEach(card => {
                const checkbox = card.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = false;
                    updatePlatformCardAppearance(card, false);
                }
            });

            // Refresh page to update stats
            setTimeout(() => location.reload(), 1000);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Posting Failed',
                text: result.message || 'An error occurred while posting.',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
        }

    } catch (error) {
        console.error('Post submission error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Failed to connect to the server. Please try again.',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
        });
    } finally {
        // Reset button state
        if (submitBtn) {
            submitBtn.disabled = false;
            if (submitText) submitText.textContent = translations[currentLang]['post_now'] || 'Post Now';
            if (submitSpinner) submitSpinner.classList.add('hidden');
        }
    }
}

// File validation
function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'
    ];

    if (file.size > maxSize) {
        return { valid: false, message: 'File size exceeds 10MB limit' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, message: 'File type not supported. Use: jpg, png, gif, webp, mp4, mov, avi, mkv, webm' };
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
        const draftStr = localStorage.getItem(DRAFT_KEY);
        if (draftStr) {
            const draft = JSON.parse(draftStr);
            if (draft && draft.content && draft.content.trim()) {
                const contentEl = document.getElementById('content');
                if (contentEl && !contentEl.value.trim()) {
                    if (draft.content.trim().length > 5) {
                        contentEl.value = draft.content;
                        console.log('Draft loaded');
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error loading draft:', e);
    }
}

function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

// Initialize draft functionality
function initializeDraftFunctionality() {
    const contentEl = document.getElementById('content');
    if (contentEl) {
        contentEl.addEventListener('input', function() {
            clearTimeout(draftTimer);
            draftTimer = setTimeout(saveDraft, 2000);
        });
    }
}

// Mobile menu toggle
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDraftFunctionality();
});

// Platform icons mapping
const platformIcons = {
    telegram: 'fab fa-telegram',
    instagram: 'fab fa-instagram',
    youtube: 'fab fa-youtube',
    tiktok: 'fab fa-tiktok'
};

// Platform colors mapping
const platformColors = {
    telegram: 'text-blue-500',
    instagram: 'text-pink-500',
    youtube: 'text-red-500',
    tiktok: 'text-gray-900 dark:text-white'
};

// Create platform badge
function createPlatformBadge(platform) {
    const icon = platformIcons[platform] || 'fas fa-globe';
    const color = platformColors[platform] || 'text-gray-500';

    return `
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <i class="${icon} ${color} mr-1"></i>
            ${t(platform) || platform}
        </span>
    `;
}

// Local storage helpers
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

function getStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('Failed to read from localStorage:', e);
        return defaultValue;
    }
}

// API helpers
async function apiCall(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Form helpers
function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    return data;
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();

        // Clear any custom file previews
        const filePreview = document.getElementById('filePreview');
        if (filePreview) {
            filePreview.classList.add('hidden');
        }

        // Reset any error states
        form.querySelectorAll('.form-error').forEach(el => {
            el.classList.remove('form-error');
        });
    }
}

// Loading states
function setLoading(elementId, loading = true) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (loading) {
        element.disabled = true;
        const originalText = element.textContent;
        element.dataset.originalText = originalText;
        element.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${t('posting')}`;
    } else {
        element.disabled = false;
        const originalText = element.dataset.originalText || element.textContent;
        element.textContent = originalText;
    }
}

// Confirmation dialogs
function confirmAction(title, text, confirmCallback) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed && confirmCallback) {
            confirmCallback();
        }
    });
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy to clipboard', 'error');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const postForm = document.getElementById('postForm');
        if (postForm && document.activeElement.form === postForm) {
            e.preventDefault();
            postForm.dispatchEvent(new Event('submit'));
        }
    }

    // Escape to close modals (handled by SweetAlert2)
    if (e.key === 'Escape') {
        Swal.close();
    }
});

// Network status handling
window.addEventListener('online', function() {
    showToast('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showToast('No internet connection', 'warning');
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to buttons without text
    document.querySelectorAll('button[title]:not([aria-label])').forEach(btn => {
        btn.setAttribute('aria-label', btn.getAttribute('title'));
    });

    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
});

// Performance monitoring
const performanceMonitor = {
    start: function(name) {
        performance.mark(`${name}-start`);
    },

    end: function(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measure = performance.getEntriesByName(name)[0];
        if (measure.duration > 1000) {
            console.warn(`Slow operation detected: ${name} took ${measure.duration}ms`);
        }
    }
};

// Error reporting
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error reporting service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error reporting service
});

// Mobile-specific enhancements
function initMobileFeatures() {
    // Prevent iOS zoom on input focus
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                document.querySelector('meta[name="viewport"]').setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
            input.addEventListener('blur', function() {
                document.querySelector('meta[name="viewport"]').setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
        });
    }

    // Enhanced touch feedback for buttons
    const touchTargets = document.querySelectorAll('.touch-target, button, .btn');
    touchTargets.forEach(target => {
        target.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        target.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });

    // Mobile navigation handling
    function handleMobileNav() {
        const mobileNav = document.querySelector('.md\\:hidden nav');
        if (mobileNav && window.innerWidth < 768) {
            mobileNav.style.display = 'flex';
        }
    }

    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            handleMobileNav();
            // Refresh viewport
            const viewport = document.querySelector('meta[name="viewport"]');
            viewport.setAttribute('content', viewport.getAttribute('content'));
        }, 100);
    });

    // Smooth scrolling for mobile
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// Responsive table handling
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.parentElement.classList.contains('table-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-container overflow-x-auto';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            table.classList.add('table-responsive');
        }
    });
}

// Enhanced mobile modal handling
function enhanceMobileModals() {
    const modals = document.querySelectorAll('[id*="Modal"]');
    modals.forEach(modal => {
        const content = modal.querySelector('div');
                if (content && window.innerWidth < 768) {
            content.classList.add('modal-content');
        }
    });
}

// Mobile-friendly file upload
function enhanceFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        const wrapper = input.closest('.border-dashed');
        if (wrapper) {
            wrapper.addEventListener('click', () => {
                input.click();
            });

            // Improve mobile drag and drop feedback
            wrapper.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('border-primary-400', 'bg-primary-50');
            });

            wrapper.addEventListener('dragleave', function() {
                this.classList.remove('border-primary-400', 'bg-primary-50');
            });
        }
    });
}

// Initialize app with mobile features
document.addEventListener('DOMContentLoaded', function() {
    initMobileFeatures();
    makeTablesResponsive();
    enhanceMobileModals();
    enhanceFileUpload();
});

// Initialize dark mode
function initDarkMode() {
    const savedMode = getStorage('darkMode', 'false');
    const html = document.documentElement;

    if (savedMode === 'true') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    updateDarkModeIcon();
}

// Update dark mode icon
function updateDarkModeIcon() {
    const toggleBtn = document.getElementById('darkModeToggle');
    const html = document.documentElement;

    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            if (html.classList.contains('dark')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}
// Dark mode toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
        html.classList.remove('dark');
        setStorage('darkMode', 'false');
    } else {
        html.classList.add('dark');
        setStorage('darkMode', 'true');
    }

    // Update toggle button icon
    updateDarkModeIcon();
}
// Platform colors for badges
const platformColors_badges = {
    telegram: 'text-blue-500',
    instagram: 'text-pink-500',
    youtube: 'text-red-500',
    tiktok: 'text-gray-900',
    facebook: 'text-blue-600',
    twitter: 'text-blue-400',
    linkedin: 'text-blue-700',
    snapchat: 'text-yellow-400',
    pinterest: 'text-red-600',
    reddit: 'text-orange-500',
    discord: 'text-indigo-500',
    whatsapp: 'text-green-500',
    threads: 'text-gray-600',
    medium: 'text-gray-700',
    tumblr: 'text-blue-800'
};

// Platform icons
const platformIcons_all = {
    telegram: 'fab fa-telegram-plane',
    instagram: 'fab fa-instagram',
    youtube: 'fab fa-youtube',
    tiktok: 'fab fa-tiktok',
    facebook: 'fab fa-facebook',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    snapchat: 'fab fa-snapchat',
    pinterest: 'fab fa-pinterest',
    reddit: 'fab fa-reddit',
    discord: 'fab fa-discord',
    whatsapp: 'fab fa-whatsapp',
    threads: 'fas fa-at',
    medium: 'fab fa-medium',
    tumblr: 'fab fa-tumblr'
};

console.log('Anonymous Creations Dashboard JavaScript loaded');