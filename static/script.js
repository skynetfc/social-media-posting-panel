// Global JavaScript functions for Anonymous Creations Dashboard

// Initialize variables
let currentLang = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

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
        if (themeText) themeText.textContent = 'Light';
    } else {
        html.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon text-sm';
        if (themeText) themeText.textContent = 'Dark';
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
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
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

// Utility functions
function showToast(message, type = 'info') {
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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
        setStorage(DRAFT_KEY, draft);
    }
}

function loadDraft() {
    const draft = getStorage(DRAFT_KEY);
    if (draft && draft.content && draft.content.trim()) {
        const contentEl = document.getElementById('content');
        if (contentEl && !contentEl.value.trim()) {
            // Only load draft if it's substantial content (more than just whitespace)
            if (draft.content.trim().length > 5) {
                contentEl.value = draft.content;
                showToast('Draft loaded', 'info');
            }
        }
    }
}

function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

// Initialize draft functionality
document.addEventListener('DOMContentLoaded', function() {
    const contentEl = document.getElementById('content');
    if (contentEl) {
        // Load draft on page load
        loadDraft();

        // Auto-save as user types
        contentEl.addEventListener('input', function() {
            clearTimeout(draftTimer);
            draftTimer = setTimeout(saveDraft, 2000); // Save after 2 seconds of inactivity
        });
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
const platformColors = {
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
const platformIcons = {
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
// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLanguage();
    updateTheme();
    console.log('Anonymous Creations Dashboard initialized');
});

console.log('Anonymous Creations Dashboard initialized');