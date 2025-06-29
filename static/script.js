// Global JavaScript functions for Anonymous Creations Dashboard

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
    if (contentEl && contentEl.value.trim()) {
        const draft = {
            content: contentEl.value,
            timestamp: Date.now()
        };
        setStorage(DRAFT_KEY, draft);
    }
}

function loadDraft() {
    const draft = getStorage(DRAFT_KEY);
    if (draft && draft.content) {
        const contentEl = document.getElementById('content');
        if (contentEl && !contentEl.value) {
            contentEl.value = draft.content;
            showToast('Draft loaded', 'info');
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

// Initialize app
console.log('Anonymous Creations Dashboard initialized');
