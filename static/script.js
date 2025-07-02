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
    },
    es: {
        brand_title: "Creaciones Anónimas",
        brand_subtitle: "Panel de Redes Sociales",
        dashboard: "Panel",
        analytics: "Analíticas",
        settings: "Configuraciones",
        welcome: "Bienvenido",
        logout: "Cerrar Sesión",
        dark: "Oscuro",
        light: "Claro",
        total_posts: "Total de Publicaciones",
        successful: "Exitoso",
        failed: "Fallido",
        pending: "Pendiente",
        create_post: "Crear Publicación",
        content: "Contenido",
        content_placeholder: "¿Qué estás pensando? Comparte tus ideas con el mundo...",
        select_platforms: "Seleccionar Plataformas",
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
        upload_media: "Subir Medios",
        upload_file: "Subir archivo",
        drag_drop: "o arrastra y suelta",
        file_limit: "Imágenes o Videos hasta 10MB",
        schedule: "Programar (Opcional)",
        post_now: "Publicar Ahora",
        recent_posts: "Publicaciones Recientes",
        success: "Éxito",
        no_posts: "No se encontraron publicaciones recientes",
        posting: "Publicando...",
        file_too_large: "El archivo debe ser menor a 10MB",
        invalid_file: "Tipo de archivo inválido"
    },
    fr: {
        brand_title: "Créations Anonymes",
        brand_subtitle: "Tableau de Bord Réseaux Sociaux",
        dashboard: "Tableau de Bord",
        analytics: "Analyses",
        settings: "Paramètres",
        welcome: "Bienvenue",
        logout: "Se Déconnecter",
        dark: "Sombre",
        light: "Clair",
        total_posts: "Total des Publications",
        successful: "Réussi",
        failed: "Échoué",
        pending: "En Attente",
        create_post: "Créer Publication",
        content: "Contenu",
        content_placeholder: "À quoi pensez-vous? Partagez vos idées avec le monde...",
        select_platforms: "Sélectionner Plateformes",
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
        upload_media: "Télécharger Médias",
        upload_file: "Télécharger fichier",
        drag_drop: "ou glisser-déposer",
        file_limit: "Images ou Vidéos jusqu'à 10MB",
        schedule: "Programmer (Optionnel)",
        post_now: "Publier Maintenant",
        recent_posts: "Publications Récentes",
        success: "Succès",
        no_posts: "Aucune publication récente trouvée",
        posting: "Publication en cours...",
        file_too_large: "Le fichier doit faire moins de 10MB",
        invalid_file: "Type de fichier invalide"
    },
    de: {
        brand_title: "Anonyme Kreationen",
        brand_subtitle: "Social Media Dashboard",
        dashboard: "Dashboard",
        analytics: "Analytik",
        settings: "Einstellungen",
        welcome: "Willkommen",
        logout: "Abmelden",
        dark: "Dunkel",
        light: "Hell",
        total_posts: "Gesamte Beiträge",
        successful: "Erfolgreich",
        failed: "Fehlgeschlagen",
        pending: "Ausstehend",
        create_post: "Beitrag Erstellen",
        content: "Inhalt",
        content_placeholder: "Was denkst du? Teile deine Gedanken mit der Welt...",
        select_platforms: "Plattformen Auswählen",
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
        upload_media: "Medien Hochladen",
        upload_file: "Datei hochladen",
        drag_drop: "oder ziehen und ablegen",
        file_limit: "Bilder oder Videos bis 10MB",
        schedule: "Planen (Optional)",
        post_now: "Jetzt Posten",
        recent_posts: "Neueste Beiträge",
        success: "Erfolg",
        no_posts: "Keine aktuellen Beiträge gefunden",
        posting: "Wird gepostet...",
        file_too_large: "Datei muss unter 10MB sein",
        invalid_file: "Ungültiger Dateityp"
    },
    ur: {
        brand_title: "گمنام تخلیقات",
        brand_subtitle: "سوشل میڈیا ڈیش بورڈ",
        dashboard: "ڈیش بورڈ",
        analytics: "تجزیات",
        settings: "ترتیبات",
        welcome: "خوش آمدید",
        logout: "لاگ آؤٹ",
        dark: "تاریک",
        light: "ہلکا",
        total_posts: "کل پوسٹس",
        successful: "کامیاب",
        failed: "ناکام",
        pending: "زیر التواء",
        create_post: "پوسٹ بنائیں",
        content: "مواد",
        content_placeholder: "آپ کیا سوچ رہے ہیں؟ دنیا کے ساتھ اپنے خیالات شیئر کریں...",
        select_platforms: "پلیٹ فارم منتخب کریں",
        telegram: "ٹیلیگرام",
        instagram: "انسٹاگرام",
        youtube: "یوٹیوب",
        tiktok: "ٹک ٹاک",
        facebook: "فیس بک",
        twitter: "ٹویٹر",
        linkedin: "لنکڈ ان",
        snapchat: "سنیپ چیٹ",
        pinterest: "پنٹریسٹ",
        reddit: "ریڈٹ",
        discord: "ڈسکورڈ",
        whatsapp: "واٹس ایپ",
        threads: "تھریڈز",
        medium: "میڈیم",
        tumblr: "ٹمبلر",
        upload_media: "میڈیا اپ لوڈ کریں",
        upload_file: "فائل اپ لوڈ کریں",
        drag_drop: "یا کھینچیں اور چھوڑیں",
        file_limit: "تصاویر یا ویڈیوز 10MB تک",
        schedule: "شیڈول (اختیاری)",
        post_now: "ابھی پوسٹ کریں",
        recent_posts: "حالیہ پوسٹس",
        success: "کامیابی",
        no_posts: "کوئی حالیہ پوسٹ نہیں ملی",
        posting: "پوسٹ کیا جا رہا ہے...",
        file_too_large: "فائل 10MB سے کم ہونی چاہیے",
        invalid_file: "غلط فائل کی قسم"
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

    // Add transition class for smooth switching
    if (!html.classList.contains('theme-transitioning')) {
        html.classList.add('theme-transitioning');
        setTimeout(() => html.classList.remove('theme-transitioning'), 300);
    }

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
    
    // Initialize AI modal handlers
    initializeAIModalHandlers();
    
    console.log('Dashboard script initialization complete');
});

function initializeAIModalHandlers() {
    const closeModalBtn = document.getElementById('closeAiModal');
    const generateBtn = document.getElementById('generateSuggestions');
    const modal = document.getElementById('aiSuggestModal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const topic = document.getElementById('aiTopic')?.value?.trim();
            const platform = document.getElementById('aiPlatform')?.value || 'general';
            const tone = document.getElementById('aiTone')?.value || 'neutral';
            
            if (!topic) {
                showToast('Please enter a topic', 'warning');
                return;
            }
            
            showToast('Generating AI suggestions...', 'info');
            
            // Simulate AI generation
            setTimeout(() => {
                const suggestions = [
                    `Discover the fascinating world of ${topic}! Here's what you need to know...`,
                    `${topic} is revolutionizing our industry. Here are the key insights...`,
                    `5 surprising facts about ${topic} that will change your perspective...`,
                    `The future of ${topic}: trends and predictions for 2024...`
                ];
                
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                const contentTextarea = document.getElementById('content');
                
                if (contentTextarea) {
                    contentTextarea.value = randomSuggestion;
                    contentTextarea.focus();
                }
                
                if (modal) {
                    modal.classList.add('hidden');
                }
                
                showToast('AI suggestion applied!', 'success');
            }, 1500);
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
}

// Dashboard specific functionality
function initDashboardFeatures() {
    // Platform selection
    const platformCheckboxes = document.querySelectorAll('input[name="platforms"]');
    platformCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            const check = label.querySelector('.platform-check');

            if (this.checked) {
                label.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                label.classList.remove('border-gray-200', 'dark:border-gray-600');
                check.classList.remove('opacity-0');
            } else {
                label.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                label.classList.add('border-gray-200', 'dark:border-gray-600');
                check.classList.add('opacity-0');
            }
        });
    });

    // File upload functionality
    const fileInput = document.getElementById('media');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file
                const validation = validateFile(file);
                if (!validation.valid) {
                    showToast(validation.message, 'error');
                    fileInput.value = '';
                    return;
                }

                fileName.textContent = `${file.name} (${formatFileSize(file.size)})`;
                filePreview.classList.remove('hidden');
            }
        });
    }

    if (removeFile) {
        removeFile.addEventListener('click', function() {
            fileInput.value = '';
            filePreview.classList.add('hidden');
        });
    }

    // Form submission
    const postForm = document.getElementById('postForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');

    if (postForm) {
        postForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platforms"]:checked')).map(cb => cb.value);

            if (selectedPlatforms.length === 0) {
                showToast('Please select at least one platform to post to.', 'warning');
                return;
            }

            // Clear existing platform values and add selected ones
            formData.delete('platforms');
            selectedPlatforms.forEach(platform => {
                formData.append('platforms', platform);
            });

            // Update button state
            submitBtn.disabled = true;
            submitText.textContent = t('posting');
            submitSpinner.classList.remove('hidden');

            try {
                const response = await fetch('/post', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    // Show detailed success message
                    let successMessage = 'Your content has been published successfully!';
                    if (result.results) {
                        const successfulPlatforms = Object.entries(result.results)
                            .filter(([platform, data]) => data.success)
                            .map(([platform]) => platform);
                        if (successfulPlatforms.length > 0) {
                            successMessage += `\n\nSuccessfully posted to: ${successfulPlatforms.join(', ')}`;
                        }
                    }

                    // Show professional success popup with auto-close
                    Swal.fire({
                        icon: 'success',
                        title: 'Post Published Successfully!',
                        html: `
                            <div class="text-center">
                                <div class="mb-3">
                                    <i class="fas fa-check-circle text-3xl text-green-500 mb-2"></i>
                                    <p class="text-base font-medium">Your content is now live!</p>
                                </div>
                                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
                                    <p class="text-sm text-green-700 dark:text-green-300">${successMessage}</p>
                                </div>
                            </div>
                        `,
                        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                        confirmButtonColor: '#10b981',
                        confirmButtonText: 'Continue',
                        timer: 4000,
                        timerProgressBar: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true,
                        showClass: {
                            popup: 'swal2-show',
                            backdrop: 'swal2-backdrop-show',
                            icon: 'swal2-icon-show'
                        },
                        hideClass: {
                            popup: 'swal2-hide',
                            backdrop: 'swal2-backdrop-hide',
                            icon: 'swal2-icon-hide'
                        }
                    }).then(() => {
                        // Reset form without page reload
                        resetFormAfterSuccess();
                        // Update stats without full page reload
                        updateDashboardStats();
                    });
                } else {
                    throw new Error(result.message || 'Failed to publish post');
                }
            } catch (error) {
                console.error('Post submission error:', error);
                let errorMessage = 'Failed to publish content. ';

                if (error.message.includes('HTTP error')) {
                    errorMessage += 'Server connection issue. Please try again.';
                } else if (error.message.includes('JSON')) {
                    errorMessage += 'Invalid response from server.';
                } else {
                    errorMessage += error.message || 'Unknown error occurred.';
                }

                showToast(errorMessage, 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitText.textContent = t('post_now');
                submitSpinner.classList.add('hidden');
            }
        });
    }
}

// Function to update dashboard stats without page reload
async function updateDashboardStats() {
    try {
        const response = await fetch("/dashboard-stats");
        if (response.ok) {
            const stats = await response.json();
            
            // Update stats counters
            const totalPostsEl = document.querySelector("[data-stat=\"total\"]");
            const successfulPostsEl = document.querySelector("[data-stat=\"successful\"]");
            const failedPostsEl = document.querySelector("[data-stat=\"failed\"]");
            const pendingPostsEl = document.querySelector("[data-stat=\"pending\"]");
            
            if (totalPostsEl) totalPostsEl.textContent = stats.total || 0;
            if (successfulPostsEl) successfulPostsEl.textContent = stats.successful || 0;
            if (failedPostsEl) failedPostsEl.textContent = stats.failed || 0;
            if (pendingPostsEl) pendingPostsEl.textContent = stats.pending || 0;
        }
    } catch (error) {
        console.log("Stats update failed, will update on next page load");
    }
}

// Reset form after successful post
function resetFormAfterSuccess() {
    const postForm = document.getElementById('post-form');
    const filePreview = document.getElementById('file-preview');
    const platformCheckboxes = document.querySelectorAll('input[name="platforms"]');
    
    if (postForm) {
        postForm.reset();
    }
    
    if (filePreview) {
        filePreview.classList.add('hidden');
    }
    
    // Uncheck all platforms and reset their visual state
    platformCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        const label = checkbox.nextElementSibling;
        if (label) {
            const check = label.querySelector('.platform-check');
            label.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
            label.classList.add('border-gray-200', 'dark:border-gray-600');
            if (check) {
                check.classList.add('opacity-0');
            }
        }
    });
    
    // Clear draft
    clearDraft();
}

// AI Assistant Functions
function generateContentIdeas(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const topicInput = document.getElementById('topic-input');
    const topic = topicInput ? topicInput.value.trim() : '';
    
    if (!topic) {
        showToast('Please enter a topic to generate ideas', 'warning');
        return;
    }
    
    showToast('Generating content ideas...', 'info');
    
    // Simulate AI content generation
    setTimeout(() => {
        const ideas = [
            `5 amazing facts about ${topic} that will surprise you`,
            `How ${topic} is changing the world in 2024`,
            `The ultimate guide to understanding ${topic}`,
            `Why everyone is talking about ${topic} right now`
        ];
        
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
        const contentTextarea = document.getElementById('content');
        
        if (contentTextarea) {
            contentTextarea.value = randomIdea;
            contentTextarea.focus();
        }
        
        showToast('Content idea generated!', 'success');
    }, 1000);
}

function optimizeHashtags(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const contentTextarea = document.getElementById('content');
    const content = contentTextarea ? contentTextarea.value.trim() : '';
    
    if (!content) {
        showToast('Please write some content first to optimize hashtags', 'warning');
        return;
    }
    
    showToast('Optimizing hashtags...', 'info');
    
    // Generate hashtags based on content
    setTimeout(() => {
        const words = content.toLowerCase().split(/\s+/);
        const keywords = words.filter(word => word.length > 4 && !['that', 'with', 'this', 'have', 'will', 'from', 'they', 'been', 'their'].includes(word));
        
        const hashtags = keywords.slice(0, 5).map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`);
        hashtags.push('#trending', '#content', '#social');
        
        const hashtagString = '\n\n' + hashtags.join(' ');
        
        if (contentTextarea && !contentTextarea.value.includes('#')) {
            contentTextarea.value += hashtagString;
        }
        
        showToast('Hashtags optimized!', 'success');
    }, 1000);
}

function enhanceContent(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const contentTextarea = document.getElementById('content');
    const content = contentTextarea ? contentTextarea.value.trim() : '';
    
    if (!content) {
        showToast('Please write some content first to enhance', 'warning');
        return;
    }
    
    showToast('Enhancing content...', 'info');
    
    // Enhance content
    setTimeout(() => {
        const emojis = ['✨', '🚀', '💡', '🔥', '⭐', '🎯', '💪', '🌟'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        let enhancedContent = content;
        
        // Add emoji if not present
        if (!content.includes('✨') && !content.includes('🚀') && !content.includes('💡')) {
            enhancedContent = `${randomEmoji} ${enhancedContent}`;
        }
        
        // Add call to action if not present
        if (!content.toLowerCase().includes('what do you think') && !content.toLowerCase().includes('comment') && !content.toLowerCase().includes('share')) {
            enhancedContent += '\n\nWhat do you think? Share your thoughts below! 👇';
        }
        
        if (contentTextarea) {
            contentTextarea.value = enhancedContent;
        }
        
        showToast('Content enhanced!', 'success');
    }, 1000);
}

function showAIModal(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const modal = document.getElementById('aiSuggestModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function enhanceContentFromButton(event) {
    enhanceContent(event);
}

function generateHashtagsFromButton(event) {
    optimizeHashtags(event);
}
