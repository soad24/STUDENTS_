// نظام أثر - سجل الممارسات المهنية

// Current user data
let currentUser = null;

// Sample data
const sampleData = {
    users: {
        'student@athar.om': {
            name: 'أحمد محمد الشريف',
            role: 'student',
            studentId: '2021001234',
            branch: 'مسقط',
            college: 'الهندسة والتكنولوجيا',
            department: 'هندسة الحاسوب',
            phone: '96890123456'
        },
        'reviewer@athar.om': {
            name: 'فاطمة علي المقبالي',
            role: 'reviewer',
            branch: 'مسقط'
        },
        'approver@athar.om': {
            name: 'سالم بن عبدالله الهنائي',
            role: 'approver',
            branch: 'مسقط'
        },
        'admin@athar.om': {
            name: 'مدير النظام',
            role: 'admin'
        }
    },
    practices: [
        {
            id: 1,
            title: 'ورشة عمل في الذكاء الاصطناعي',
            type: 'ورش العمل والندوات',
            participationType: 'حضور',
            participationLevel: 'دولي',
            organization: 'جامعة السلطان قابوس',
            startDate: '2024-01-15',
            endDate: '2024-01-17',
            status: 'approved',
            points: 30,
            submittedDate: '2024-01-20'
        },
        {
            id: 2,
            title: 'مسابقة البرمجة الوطنية',
            type: 'المسابقات والهاكاثونات',
            participationType: 'مشاركة',
            participationLevel: 'محلي',
            organization: 'وزارة التعليم العالي',
            startDate: '2024-02-10',
            endDate: '2024-02-12',
            status: 'pending',
            points: 45,
            submittedDate: '2024-02-15'
        },
        {
            id: 3,
            title: 'تدريب صيفي في شركة تقنية',
            type: 'التدريب على رأس العمل',
            participationType: 'تدريب',
            participationLevel: 'محلي',
            organization: 'شركة عمان للتكنولوجيا',
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            status: 'under_review',
            points: 60,
            submittedDate: '2024-09-05'
        }
    ],
    practiceTypes: [
        'التدريب على رأس العمل',
        'التدريب الاختياري',
        'الزيارات الميدانية',
        'ورش العمل والندوات',
        'المؤتمرات المهنية',
        'المسابقات والهاكاثونات',
        'المعارض',
        'عضوية الجمعيات المهنية',
        'الشهادات الاحترافية',
        'العمل بدوام جزئي',
        'العمل التطوعي',
        'مشاريع ريادة الأعمال',
        'البحوث العلمية المنشورة',
        'براءات الاختراع',
        'الجوائز المهنية'
    ],
    participationTypes: [
        'حضور',
        'مشاركة',
        'تقديم',
        'تنظيم',
        'قيادة'
    ],
    participationLevels: [
        'الفرع',
        'الجامعة',
        'محلي',
        'إقليمي',
        'دولي'
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show landing page by default
    showLandingPage();
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Copy buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
            const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
            const textToCopy = btn.getAttribute('data-copy');
            copyToClipboard(textToCopy, btn);
        }
    });
    
    // Navigation links
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
            
            // Update active navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    });
    
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

function showLandingPage() {
    document.getElementById('landingPage').classList.remove('d-none');
    document.getElementById('loginPage').classList.add('d-none');
    document.getElementById('mainApp').classList.add('d-none');
}

function showLoginPage() {
    document.getElementById('landingPage').classList.add('d-none');
    document.getElementById('loginPage').classList.remove('d-none');
    document.getElementById('mainApp').classList.add('d-none');
}

function showMainApp() {
    document.getElementById('landingPage').classList.add('d-none');
    document.getElementById('loginPage').classList.add('d-none');
    document.getElementById('mainApp').classList.remove('d-none');
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (sampleData.users[email] && password === 'password123') {
        currentUser = sampleData.users[email];
        currentUser.email = email;
        
        // Update UI
        document.getElementById('userName').textContent = currentUser.name;
        
        // Setup navigation based on user role
        setupNavigation();
        
        // Show main app
        showMainApp();
        
        // Load dashboard
        loadPage('dashboard');
        
        showToast('تم تسجيل الدخول بنجاح', 'success');
    } else {
        showToast('بيانات تسجيل الدخول غير صحيحة', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    showLandingPage();
    
    // Reset form
    document.getElementById('loginForm').reset();
    
    showToast('تم تسجيل الخروج بنجاح', 'info');
}

function setupNavigation() {
    const sidebarNav = document.getElementById('sidebarNav');
    const practicesNavItem = document.getElementById('practicesNavItem');
    const addPracticeNavItem = document.getElementById('addPracticeNavItem');
    const settingsNavItem = document.getElementById('settingsNavItem');
    const practicesNavText = document.getElementById('practicesNavText');
    
    // Clear sidebar
    sidebarNav.innerHTML = '';
    
    // Common navigation items
    const dashboardItem = createNavItem('dashboard', 'fas fa-tachometer-alt', 'لوحة التحكم');
    sidebarNav.appendChild(dashboardItem);
    
    if (currentUser.role === 'student') {
        // Student navigation
        practicesNavText.textContent = 'ممارساتي المهنية';
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'block';
        settingsNavItem.style.display = 'none';
        
        const practicesItem = createNavItem('practices', 'fas fa-list', 'ممارساتي المهنية');
        const addPracticeItem = createNavItem('add-practice', 'fas fa-plus', 'إضافة ممارسة جديدة');
        const reportsItem = createNavItem('reports', 'fas fa-chart-bar', 'تقاريري');
        
        sidebarNav.appendChild(practicesItem);
        sidebarNav.appendChild(addPracticeItem);
        sidebarNav.appendChild(reportsItem);
        
    } else if (currentUser.role === 'reviewer') {
        // Reviewer navigation
        practicesNavText.textContent = 'الممارسات للمراجعة';
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'none';
        settingsNavItem.style.display = 'none';
        
        const reviewItem = createNavItem('practices', 'fas fa-search', 'الممارسات للمراجعة');
        const reportsItem = createNavItem('reports', 'fas fa-chart-bar', 'التقارير');
        
        sidebarNav.appendChild(reviewItem);
        sidebarNav.appendChild(reportsItem);
        
    } else if (currentUser.role === 'approver') {
        // Approver navigation
        practicesNavText.textContent = 'الممارسات للاعتماد';
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'none';
        settingsNavItem.style.display = 'none';
        
        const approveItem = createNavItem('practices', 'fas fa-stamp', 'الممارسات للاعتماد');
        const reportsItem = createNavItem('reports', 'fas fa-chart-bar', 'التقارير');
        
        sidebarNav.appendChild(approveItem);
        sidebarNav.appendChild(reportsItem);
        
    } else if (currentUser.role === 'admin') {
        // Admin navigation
        practicesNavText.textContent = 'جميع الممارسات';
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'none';
        settingsNavItem.style.display = 'block';
        
        const allPracticesItem = createNavItem('practices', 'fas fa-list', 'جميع الممارسات');
        const usersItem = createNavItem('users', 'fas fa-users', 'إدارة المستخدمين');
        const settingsItem = createNavItem('settings', 'fas fa-cog', 'الإعدادات');
        const reportsItem = createNavItem('reports', 'fas fa-chart-bar', 'التقارير');
        
        sidebarNav.appendChild(allPracticesItem);
        sidebarNav.appendChild(usersItem);
        sidebarNav.appendChild(settingsItem);
        sidebarNav.appendChild(reportsItem);
    }
}

function createNavItem(page, icon, text) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = '#';
    a.setAttribute('data-page', page);
    a.innerHTML = `<i class="${icon} me-2"></i>${text}`;
    
    li.appendChild(a);
    return li;
}

function loadPage(page) {
    const pageContent = document.getElementById('pageContent');
    
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'practices':
            loadPractices();
            break;
        case 'add-practice':
            loadAddPractice();
            break;
        case 'reports':
            loadReports();
            break;
            case 'final-report':
            loadFinalReport();
            break;
        case 'settings':
            loadSettings();
            break;
        case 'users':
            loadUsers();
            break;
        default:
            pageContent.innerHTML = '<div class="alert alert-warning">الصفحة غير موجودة</div>';
    }
}

function loadDashboard() {
    const pageContent = document.getElementById('pageContent');
    
    if (currentUser.role === 'student') {
        loadStudentDashboard();
    } else if (currentUser.role === 'reviewer') {
        loadReviewerDashboard();
    } else if (currentUser.role === 'approver') {
        loadApproverDashboard();
    } else if (currentUser.role === 'admin') {
        loadAdminDashboard();
    }
}

function loadStudentDashboard() {
    const pageContent = document.getElementById('pageContent');
    const userPractices = sampleData.practices;
    const totalPoints = userPractices.reduce((sum, p) => p.status === 'approved' ? sum + p.points : sum, 0);
    const approvedCount = userPractices.filter(p => p.status === 'approved').length;
    const pendingCount = userPractices.filter(p => p.status === 'pending').length;
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">مرحباً ${currentUser.name}</h1>
                <span class="badge bg-primary fs-6">${currentUser.studentId}</span>
            </div>

            <!-- Student Record -->
            <div class="student-record fade-in">
                <div class="record-header">
                    <h2 class="record-title">سجل الممارسات المهنية</h2>
                    <p class="record-subtitle">جامعة التقنية والعلوم التطبيقية</p>
                    <div class="university-seal">
                        <i class="fas fa-graduation-cap" style="font-size: 3rem; color: var(--primary-color);"></i>
                    </div>
                </div>
                
                <div class="student-info">
                    <div class="info-row">
                        <span class="info-label">اسم الطالب:</span>
                        <span class="info-value">${currentUser.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">الرقم الأكاديمي:</span>
                        <span class="info-value">${currentUser.studentId}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">الفرع:</span>
                        <span class="info-value">${currentUser.branch}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">الكلية:</span>
                        <span class="info-value">${currentUser.college}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">التخصص:</span>
                        <span class="info-value">${currentUser.department}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">تاريخ إصدار السجل:</span>
                        <span class="info-value">${new Date().toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>
                
                <div class="practices-summary">
                    <div class="summary-card">
                        <div class="summary-number">${totalPoints}</div>
                        <div class="summary-label">إجمالي النقاط</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-number">${approvedCount}</div>
                        <div class="summary-label">ممارسات معتمدة</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-number">${pendingCount}</div>
                        <div class="summary-label">في الانتظار</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-number">${userPractices.length}</div>
                        <div class="summary-label">إجمالي الممارسات</div>
                    </div>
                </div>
                
                <div class="record-footer">
                    <p><strong>ملاحظة:</strong> هذا السجل يوثق جميع الممارسات المهنية المعتمدة للطالب خلال فترة الدراسة</p>
                    <p>تم إصدار هذا السجل إلكترونياً من نظام أثر - جامعة التقنية والعلوم التطبيقية</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">الإجراءات السريعة</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-success w-100" onclick="loadPage('add-practice')">
                                        <i class="fas fa-plus me-2"></i>
                                        إضافة ممارسة جديدة
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-primary w-100" onclick="loadPage('practices')">
                                        <i class="fas fa-list me-2"></i>
                                        عرض جميع الممارسات
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-info w-100" onclick="downloadRecord()">
                                        <i class="fas fa-download me-2"></i>
                                        تحميل السجل
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-warning w-100" onclick="loadPage('reports')">
                                        <i class="fas fa-chart-bar me-2"></i>
                                        التقارير
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Practices -->
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">أحدث الممارسات المهنية</h5>
                    <button class="btn btn-sm btn-outline-primary" onclick="loadPage('practices')">عرض الكل</button>
                </div>
                <div class="card-body">
                    ${generatePracticesTable(userPractices.slice(0, 5), true)}
                </div>
            </div>
        </div>
    `;
}

function loadReviewerDashboard() {
    const pageContent = document.getElementById('pageContent');
    const pendingPractices = sampleData.practices.filter(p => p.status === 'pending');
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">مرحباً ${currentUser.name}</h1>
                <span class="badge bg-info fs-6">مراجع</span>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card stats-card-warning h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">في انتظار المراجعة</div>
                                    <div class="text-white h4">${pendingPractices.length}</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-clock fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card stats-card-success h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">تم مراجعتها</div>
                                    <div class="text-white h4">12</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-check-circle fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card stats-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">إجمالي الممارسات</div>
                                    <div class="text-white h4">${sampleData.practices.length}</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-list fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Reviews -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">الممارسات في انتظار المراجعة</h5>
                </div>
                <div class="card-body">
                    ${generatePracticesTable(pendingPractices, false, true)}
                </div>
            </div>
        </div>
    `;
}

function loadApproverDashboard() {
    const pageContent = document.getElementById('pageContent');
    const underReviewPractices = sampleData.practices.filter(p => p.status === 'under_review');
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">مرحباً ${currentUser.name}</h1>
                <span class="badge bg-success fs-6">معتمد</span>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card stats-card-info h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">في انتظار الاعتماد</div>
                                    <div class="text-white h4">${underReviewPractices.length}</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-hourglass-half fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card stats-card-success h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">تم اعتمادها</div>
                                    <div class="text-white h4">8</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-stamp fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card stats-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">إجمالي الممارسات</div>
                                    <div class="text-white h4">${sampleData.practices.length}</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-list fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Approvals -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">الممارسات في انتظار الاعتماد</h5>
                </div>
                <div class="card-body">
                    ${generatePracticesTable(underReviewPractices, false, false, true)}
                </div>
            </div>
        </div>
    `;
}

function loadAdminDashboard() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">مرحباً ${currentUser.name}</h1>
                <span class="badge bg-danger fs-6">مدير النظام</span>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card stats-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">إجمالي الطلاب</div>
                                    <div class="text-white h4">1,234</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-user-graduate fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card stats-card-success h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">ممارسات معتمدة</div>
                                    <div class="text-white h4">567</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-check-circle fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card stats-card-warning h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">في الانتظار</div>
                                    <div class="text-white h4">89</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-clock fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card stats-card-info h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div class="text-white-75 small">إجمالي الممارسات</div>
                                    <div class="text-white h4">${sampleData.practices.length}</div>
                                </div>
                                <div class="text-white-50">
                                    <i class="fas fa-list fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">الإجراءات السريعة</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-primary w-100" onclick="loadPage('users')">
                                        <i class="fas fa-users me-2"></i>
                                        إدارة المستخدمين
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-success w-100" onclick="loadPage('settings')">
                                        <i class="fas fa-cog me-2"></i>
                                        إعدادات النظام
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-info w-100" onclick="loadPage('practices')">
                                        <i class="fas fa-list me-2"></i>
                                        جميع الممارسات
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-warning w-100" onclick="loadPage('reports')">
                                        <i class="fas fa-chart-bar me-2"></i>
                                        التقارير
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">آخر الأنشطة</h5>
                </div>
                <div class="card-body">
                    ${generatePracticesTable(sampleData.practices.slice(0, 5))}
                </div>
            </div>
        </div>
    `;
}

function loadPractices() {
    const pageContent = document.getElementById('pageContent');
    let practices = sampleData.practices;
    let title = 'الممارسات المهنية';
    
    if (currentUser.role === 'reviewer') {
        practices = practices.filter(p => p.status === 'pending');
        title = 'الممارسات في انتظار المراجعة';
    } else if (currentUser.role === 'approver') {
        practices = practices.filter(p => p.status === 'under_review');
        title = 'الممارسات في انتظار الاعتماد';
    } else if (currentUser.role === 'student') {
        title = 'ممارساتي المهنية';
    } else if (currentUser.role === 'admin') {
        title = 'جميع الممارسات المهنية';
    }
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">${title}</h1>
                ${currentUser.role === 'student' ? '<button class="btn btn-success" onclick="loadPage(\'add-practice\')"><i class="fas fa-plus me-2"></i>إضافة ممارسة جديدة</button>' : ''}
            </div>

            <!-- Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">البحث</label>
                            <input type="text" class="form-control" placeholder="ابحث في العنوان أو المؤسسة...">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">الحالة</label>
                            <select class="form-select">
                                <option value="">جميع الحالات</option>
                                <option value="pending">في الانتظار</option>
                                <option value="under_review">قيد المراجعة</option>
                                <option value="approved">معتمد</option>
                                <option value="rejected">مرفوض</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">من تاريخ</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">إلى تاريخ</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="col-md-1">
                            <label class="form-label">&nbsp;</label>
                            <button type="button" class="btn btn-primary w-100">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Practices List -->
            <div class="card">
                <div class="card-body">
                    ${generatePracticesTable(practices, currentUser.role === 'student', currentUser.role === 'reviewer', currentUser.role === 'approver')}
                </div>
            </div>
        </div>
    `;
}

function loadAddPractice() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">إضافة ممارسة مهنية جديدة</h1>
                <button class="btn btn-outline-secondary" onclick="loadPage('practices')">
                    <i class="fas fa-arrow-right me-2"></i>
                    العودة للقائمة
                </button>
            </div>

            <div class="row">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">معلومات الممارسة المهنية</h5>
                        </div>
                        <div class="card-body">
                            <form id="addPracticeForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">نوع الممارسة <span class="text-danger">*</span></label>
                                        <select class="form-select" required>
                                            <option value="">اختر نوع الممارسة</option>
                                            ${sampleData.practiceTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">نوع المشاركة <span class="text-danger">*</span></label>
                                        <select class="form-select" required>
                                            <option value="">اختر نوع المشاركة</option>
                                            ${sampleData.participationTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">مستوى المشاركة <span class="text-danger">*</span></label>
                                    <select class="form-select" required>
                                        <option value="">اختر مستوى المشاركة</option>
                                        ${sampleData.participationLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">عنوان الممارسة <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">المؤسسة/الجهة المنظمة <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">وصف الممارسة</label>
                                    <textarea class="form-control" rows="3"></textarea>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">تاريخ البداية <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" required>
                                    </div>
                                    
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">تاريخ النهاية <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" required>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">عدد الساعات (اختياري)</label>
                                    <input type="number" class="form-control" min="1">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">المرفقات</label>
                                    <input type="file" class="form-control" multiple accept=".pdf,.jpg,.jpeg,.png">
                                    <div class="form-text">يمكنك رفع ملفات PDF أو صور (الحد الأقصى 2 ميجابايت لكل ملف)</div>
                                </div>

                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-secondary" onclick="loadPage('practices')">إلغاء</button>
                                    <button type="submit" class="btn btn-success">
                                        <i class="fas fa-save me-2"></i>
                                        حفظ الممارسة
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">إرشادات مهمة</h6>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>تذكير:</strong> يجب تقديم الممارسة خلال شهر من تاريخ انتهائها.
                            </div>

                            <h6>الوثائق المطلوبة:</h6>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-check text-success me-2"></i>شهادة المشاركة</li>
                                <li><i class="fas fa-check text-success me-2"></i>وثيقة من الجهة المنظمة</li>
                                <li><i class="fas fa-check text-success me-2"></i>صور من الفعالية (اختياري)</li>
                            </ul>

                            <div class="alert alert-warning mt-3">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <small>سيتم احتساب النقاط تلقائياً بناءً على نوع ومستوى المشاركة المحددة.</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup form submission
    document.getElementById('addPracticeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('تم حفظ الممارسة بنجاح', 'success');
        loadPage('practices');
    });
}

function loadSettings() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="settings-container">
                <h1 class="h3 mb-4">إعدادات النظام</h1>
                
                <!-- Settings Navigation -->
                <div class="card settings-nav">
                    <div class="card-body p-0">
                        <ul class="nav nav-tabs border-0" id="settingsTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="practice-builder-tab" data-bs-toggle="tab" data-bs-target="#practice-builder" type="button" role="tab">
                                    <i class="fas fa-tools me-2"></i>بناء الممارسات
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="practice-types-tab" data-bs-toggle="tab" data-bs-target="#practice-types" type="button" role="tab">
                                    <i class="fas fa-list me-2"></i>أنواع الممارسات
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="participation-types-tab" data-bs-toggle="tab" data-bs-target="#participation-types" type="button" role="tab">
                                    <i class="fas fa-users me-2"></i>أنواع المشاركة
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="participation-levels-tab" data-bs-toggle="tab" data-bs-target="#participation-levels" type="button" role="tab">
                                    <i class="fas fa-layer-group me-2"></i>مستويات المشاركة
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="user-management-tab" data-bs-toggle="tab" data-bs-target="#user-management" type="button" role="tab">
                                    <i class="fas fa-user-cog me-2"></i>إدارة المستخدمين
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="permissions-tab" data-bs-toggle="tab" data-bs-target="#permissions" type="button" role="tab">
                                    <i class="fas fa-shield-alt me-2"></i>الصلاحيات
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <!-- Settings Content -->
                <div class="tab-content" id="settingsTabContent">
                    <!-- Practice Builder -->
                    <div class="tab-pane fade show active" id="practice-builder" role="tabpanel">
                        ${generatePracticeBuilder()}
                    </div>
                    
                    <!-- Practice Types -->
                    <div class="tab-pane fade" id="practice-types" role="tabpanel">
                        ${generatePracticeTypesSettings()}
                    </div>
                    
                    <!-- Participation Types -->
                    <div class="tab-pane fade" id="participation-types" role="tabpanel">
                        ${generateParticipationTypesSettings()}
                    </div>
                    
                    <!-- Participation Levels -->
                    <div class="tab-pane fade" id="participation-levels" role="tabpanel">
                        ${generateParticipationLevelsSettings()}
                    </div>
                    
                    <!-- User Management -->
                    <div class="tab-pane fade" id="user-management" role="tabpanel">
                        ${generateUserManagementSettings()}
                    </div>
                    
                    <!-- Permissions -->
                    <div class="tab-pane fade" id="permissions" role="tabpanel">
                        ${generatePermissionsSettings()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize practice builder functionality
    initializePracticeBuilder();
}

function generatePracticeBuilder() {
    return `
        <div class="settings-content">
            <h4 class="mb-4">بناء نماذج الممارسات المهنية</h4>
            
            <div class="row">
                <!-- Builder Section -->
                <div class="col-lg-6">
                    <div class="practice-builder">
                        <h5 class="mb-3">
                            <i class="fas fa-tools me-2"></i>بناء النموذج
                        </h5>
                        
                        <form id="practiceBuilderForm">
                            <!-- Practice Name -->
                            <div class="mb-3">
                                <label class="form-label">اسم الممارسة</label>
                                <input type="text" id="practiceName" class="form-control" placeholder="مثال: مبادرة تطوعية" required>
                            </div>
                            
                            <!-- Participation Types -->
                            <div class="builder-section">
                                <h4>نوع المشاركة</h4>
                                <div class="checkbox-group">
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationType" value="حضوري او افتراضي" id="pt1">
                                        <label for="pt1">حضوري او افتراضي</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationType" value="حضور" id="pt2">
                                        <label for="pt2">حضور</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationType" value="تنظيم" id="pt3">
                                        <label for="pt3">تنظيم</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationType" value="تقديم" id="pt4">
                                        <label for="pt4">تقديم</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationType" value="عضو في مجلس الادارة" id="pt5">
                                        <label for="pt5">عضو في مجلس الادارة</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationType" value="عضو" id="pt6">
                                        <label for="pt6">عضو</label>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Participation Levels -->
                            <div class="builder-section">
                                <h4>مستوى المشاركة</h4>
                                <div class="checkbox-group">
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationLevel" value="محليا او دوليا" id="pl1">
                                        <label for="pl1">محليا او دوليا</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationLevel" value="خارج الفرع فقط" id="pl2">
                                        <label for="pl2">خارج الفرع فقط</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationLevel" value="الفرع" id="pl3">
                                        <label for="pl3">الفرع</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationLevel" value="الجامعة" id="pl4">
                                        <label for="pl4">الجامعة</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationLevel" value="محلي" id="pl5">
                                        <label for="pl5">محلي</label>
                                    </div>
                                    <div class="checkbox-item">
                                        <input type="checkbox" name="participationLevel" value="دولي" id="pl6">
                                        <label for="pl6">دولي</label>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Dynamic Fields -->
                            <div class="builder-section">
                                <h4>الحقول الإضافية</h4>
                                <div id="dynamicFields"></div>
                                <button type="button" class="btn btn-success" onclick="addDynamicField()">
                                    <i class="fas fa-plus me-2"></i>إضافة حقل جديد
                                </button>
                            </div>
                            
                            <div class="d-flex gap-2 mt-4">
                                <button type="button" class="btn btn-primary" onclick="generatePracticeForm()">
                                    <i class="fas fa-cog me-2"></i>إنشاء النموذج
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="clearPracticeBuilder()">
                                    <i class="fas fa-trash me-2"></i>مسح النموذج
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Preview Section -->
                <div class="col-lg-6">
                    <div class="practice-builder">
                        <h5 class="mb-3">
                            <i class="fas fa-eye me-2"></i>معاينة النموذج
                        </h5>
                        <div id="formPreview" class="border rounded p-3 bg-light">
                            <p class="text-muted text-center">سيظهر النموذج هنا بعد الإنشاء</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generatePracticeTypesSettings() {
    return `
        <div class="settings-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>إدارة أنواع الممارسات</h4>
                <button class="btn btn-success" onclick="addPracticeType()">
                    <i class="fas fa-plus me-2"></i>إضافة نوع جديد
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>الاسم بالعربية</th>
                            <th>الاسم بالإنجليزية</th>
                            <th>النقاط الأساسية</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sampleData.practiceTypes.map((type, index) => `
                            <tr>
                                <td>${type}</td>
                                <td>${type} (EN)</td>
                                <td>20</td>
                                <td><span class="badge bg-success">نشط</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="editPracticeType(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deletePracticeType(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateParticipationTypesSettings() {
    return `
        <div class="settings-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>إدارة أنواع المشاركة</h4>
                <button class="btn btn-success" onclick="addParticipationType()">
                    <i class="fas fa-plus me-2"></i>إضافة نوع جديد
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>الاسم بالعربية</th>
                            <th>الاسم بالإنجليزية</th>
                            <th>المضاعف</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sampleData.participationTypes.map((type, index) => `
                            <tr>
                                <td>${type}</td>
                                <td>${type} (EN)</td>
                                <td>${index + 1}</td>
                                <td><span class="badge bg-success">نشط</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="editParticipationType(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteParticipationType(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateParticipationLevelsSettings() {
    return `
        <div class="settings-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>إدارة مستويات المشاركة</h4>
                <button class="btn btn-success" onclick="addParticipationLevel()">
                    <i class="fas fa-plus me-2"></i>إضافة مستوى جديد
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>الاسم بالعربية</th>
                            <th>الاسم بالإنجليزية</th>
                            <th>المضاعف</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sampleData.participationLevels.map((level, index) => `
                            <tr>
                                <td>${level}</td>
                                <td>${level} (EN)</td>
                                <td>${index + 1}</td>
                                <td><span class="badge bg-success">نشط</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="editParticipationLevel(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteParticipationLevel(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateUserManagementSettings() {
    return `
        <div class="settings-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>إدارة المستخدمين</h4>
                <button class="btn btn-success" onclick="addUser()">
                    <i class="fas fa-user-plus me-2"></i>إضافة مستخدم جديد
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>الدور</th>
                            <th>الفرع</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(sampleData.users).map(([email, user]) => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${email}</td>
                                <td>
                                    <span class="badge ${getRoleBadgeClass(user.role)}">
                                        ${getRoleText(user.role)}
                                    </span>
                                </td>
                                <td>${user.branch || '-'}</td>
                                <td><span class="badge bg-success">نشط</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="editUser('${email}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning" onclick="resetPassword('${email}')">
                                        <i class="fas fa-key"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${email}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generatePermissionsSettings() {
    return `
        <div class="settings-content">
            <h4 class="mb-4">إدارة صلاحيات المستخدمين</h4>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">صلاحيات الطالب</h6>
                        </div>
                        <div class="card-body">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked disabled>
                                <label class="form-check-label">إضافة ممارسة مهنية</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked disabled>
                                <label class="form-check-label">تعديل الممارسات المعلقة</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked disabled>
                                <label class="form-check-label">عرض ممارساته فقط</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked disabled>
                                <label class="form-check-label">تحميل السجل الشخصي</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">صلاحيات المراجع</h6>
                        </div>
                        <div class="card-body">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">مراجعة الممارسات المعلقة</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">إضافة ملاحظات المراجعة</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">رفض أو إرجاع الممارسات</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">عرض تقارير المراجعة</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">صلاحيات المعتمد</h6>
                        </div>
                        <div class="card-body">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">اعتماد الممارسات المراجعة</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">تعديل النقاط</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">إضافة ملاحظات الاعتماد</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">عرض تقارير الاعتماد</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">صلاحيات المدير</h6>
                        </div>
                        <div class="card-body">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">إدارة جميع المستخدمين</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">إعدادات النظام</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">عرض جميع التقارير</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked>
                                <label class="form-check-label">إدارة أنواع الممارسات</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-end mt-4">
                <button class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>حفظ الصلاحيات
                </button>
            </div>
        </div>
    `;
}

// تحميل صفحة التقارير
function loadReports() {
    const pageContent = document.getElementById('pageContent');
    
    if (currentUser.role === 'student') {
        // Prepare practicesData for student
        const practicesData = sampleData.practices.map(p => ({
            ...p,
            duration: p.duration || Math.round((new Date(p.endDate) - new Date(p.startDate)) / (1000 * 60 * 60 * 24)) // fallback duration in days
        }));

        pageContent.innerHTML = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">التقارير والإحصائيات</h1>
                </div>

                <!-- Statistics Overview -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <div class="text-white-75 small">إجمالي النقاط</div>
                                        <div class="text-white h4">${practicesData.reduce((sum, p) => sum + p.points, 0)}</div>
                                    </div>
                                    <div class="text-white-50">
                                        <i class="fas fa-star fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card stats-card-success">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <div class="text-white-75 small">ممارسات معتمدة</div>
                                        <div class="text-white h4">${practicesData.filter(p => p.status === 'approved').length}</div>
                                    </div>
                                    <div class="text-white-50">
                                        <i class="fas fa-check-circle fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card stats-card-info">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <div class="text-white-75 small">ساعات التدريب</div>
                                        <div class="text-white h4">${practicesData.reduce((sum, p) => sum + (p.duration || 0), 0)}</div>
                                    </div>
                                    <div class="text-white-50">
                                        <i class="fas fa-clock fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card stats-card-warning">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <div class="text-white-75 small">أنواع مختلفة</div>
                                        <div class="text-white h4">${[...new Set(practicesData.map(p => p.type))].length}</div>
                                    </div>
                                    <div class="text-white-50">
                                        <i class="fas fa-layer-group fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Generation -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">إنشاء التقارير</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card border-primary">
                                    <div class="card-body text-center">
                                        <i class="fas fa-file-pdf text-primary mb-3" style="font-size: 3rem;"></i>
                                        <h5>التقرير النهائي للسجل</h5>
                                        <p class="text-muted">تقرير شامل يحتوي على جميع الممارسات المهنية والإحصائيات</p>
                                        <button class="btn btn-primary" onclick="loadPage('final-report')">
                                            <i class="fas fa-download me-2"></i>
                                            إنشاء التقرير
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card border-success">
                                    <div class="card-body text-center">
                                        <i class="fas fa-chart-line text-success mb-3" style="font-size: 3rem;"></i>
                                        <h5>تقرير الإحصائيات</h5>
                                        <p class="text-muted">تقرير تفصيلي للإحصائيات والرسوم البيانية</p>
                                        <button class="btn btn-success">
                                            <i class="fas fa-chart-bar me-2"></i>
                                            عرض الإحصائيات
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Practices by Type -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">الممارسات حسب النوع</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>نوع الممارسة</th>
                                        <th>عدد الممارسات</th>
                                        <th>إجمالي النقاط</th>
                                        <th>متوسط النقاط</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${generatePracticeTypeStats(practicesData)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // تقارير للأدوار الأخرى
        pageContent.innerHTML = `
            <div class="py-4">
                <h1 class="h3 mb-4">التقارير والإحصائيات</h1>
                <div class="card">
                    <div class="card-body text-center">
                        <h4>تقارير ${getRoleDisplayName(currentUser.role)}</h4>
                        <p class="text-muted">قريباً...</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// تحميل صفحة التقرير النهائي
function loadFinalReport() {
    const pageContent = document.getElementById('pageContent');
    const practicesData = sampleData.practices.map(p => ({
        ...p,
        duration: p.duration || Math.round((new Date(p.endDate) - new Date(p.startDate)) / (1000 * 60 * 60 * 24))
    }));
    const totalPoints = practicesData.reduce((sum, p) => sum + p.points, 0);
    const totalHours = practicesData.reduce((sum, p) => sum + (p.duration || 0), 0);
    
    pageContent.innerHTML = `
        <div class="py-4">
            <!-- Header with Print Button -->
            <div class="d-flex justify-content-between align-items-center mb-4 no-print">
                <h1 class="h3 mb-0">التقرير النهائي للسجل</h1>
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="loadPage('reports')">
                        <i class="fas fa-arrow-right me-2"></i>
                        العودة للتقارير
                    </button>
                    <button class="btn btn-primary" onclick="window.print()">
                        <i class="fas fa-print me-2"></i>
                        طباعة التقرير
                    </button>
                </div>
            </div>

            <!-- Final Report Document -->
            <div class="final-report-document">
                <!-- Report Header -->
                <div class="report-header">
                    <div class="university-header">
                        <div class="logo-section">
                            <img src="logo.png" alt="شعار أثر" class="report-logo-left">
                        </div>
                        <div class="university-info">
                            <h2 class="university-name-ar">جامعة التقنية والعلوم التطبيقية</h2>
                            <h3 class="university-name-en">University of Technology and Applied Sciences</h3>
                        </div>
                        <div class="logo-section">
                            <img src="logo.png" alt="شعار الجامعة" class="report-logo-right">
                        </div>
                    </div>
                    
                    <div class="report-title-section">
                        <h1 class="report-main-title">سجل الطالب للممارسة المهنية (أثر)</h1>
                        <h2 class="report-subtitle">رحلة الإنجاز والتأثير</h2>
                    </div>
                </div>

                <!-- Student Information Table -->
                <div class="student-info-section">
                    <h3 class="section-title">معلومات الطالب</h3>
                    <table class="info-table">
                        <tr>
                            <td class="label-cell">اسم الطالب</td>
                            <td class="value-cell">${currentUser.name}</td>
                            <td class="label-cell">الكلية</td>
                            <td class="value-cell">${currentUser.college}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">الرقم الجامعي</td>
                            <td class="value-cell">${currentUser.studentId}</td>
                            <td class="label-cell">التخصص</td>
                            <td class="value-cell">${currentUser.department}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">المرشد الأكاديمي</td>
                            <td class="value-cell">د. محمد بن سالم الكندي</td>
                            <td class="label-cell">الرقم المدني</td>
                            <td class="value-cell">12345678</td>
                        </tr>
                    </table>
                </div>

                <!-- Training Section -->
                <div class="practices-section">
                    <h3 class="section-title">التدريب</h3>
                    <table class="practices-table">
                        <thead>
                            <tr>
                                <th>اسم المؤسسة</th>
                                <th>نوع التدريب</th>
                                <th>نمط المشاركة (حضوري/افتراضي)</th>
                                <th>مستوى المشاركة</th>
                                <th>الوقت (من/إلى)</th>
                                <th>التاريخ (من/إلى)</th>
                                <th>مجموع النقاط</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateTrainingRows(practicesData)}
                        </tbody>
                    </table>
                </div>

                <!-- Field Visits Section -->
                <div class="practices-section">
                    <h3 class="section-title">الزيارات الميدانية</h3>
                    <table class="practices-table">
                        <thead>
                            <tr>
                                <th>اسم المؤسسة</th>
                                <th>هدف الزيارة</th>
                                <th>مدة الزيارة (ساعة/يوم)</th>
                                <th>الجهة المنظمة</th>
                                <th>مستوى المشاركة</th>
                                <th>الوقت (من/إلى)</th>
                                <th>التاريخ (من/إلى)</th>
                                <th>مجموع النقاط</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateFieldVisitsRows(practicesData)}
                        </tbody>
                    </table>
                </div>

                <!-- Workshops and Seminars Section -->
                <div class="practices-section">
                    <h3 class="section-title">ورش العمل والندوات والمؤتمرات المهنية</h3>
                    <table class="practices-table">
                        <thead>
                            <tr>
                                <th>اسم المؤسسة</th>
                                <th>نمط التقديم (حضوري/افتراضي)</th>
                                <th>نمط المشاركة</th>
                                <th>الموضوع</th>
                                <th>الجهة المنظمة</th>
                                <th>مستوى المشاركة</th>
                                <th>الوقت (من/إلى)</th>
                                <th>التاريخ (من/إلى)</th>
                                <th>مجموع النقاط</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateWorkshopsRows(practicesData)}
                        </tbody>
                    </table>
                </div>

                <!-- Report Footer -->
                <div class="report-footer">
                    <div class="footer-content">
                        <div class="signature-section">
                            <div class="signature-box">
                                <p>توقيع الطالب</p>
                                <div class="signature-line"></div>
                                <p class="signature-date">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
                            </div>
                            <div class="signature-box">
                                <p>توقيع المرشد الأكاديمي</p>
                                <div class="signature-line"></div>
                                <p class="signature-date">التاريخ: ___________</p>
                            </div>
                        </div>
                        
                        <div class="summary-section">
                            <div class="summary-box">
                                <h4>ملخص الإنجازات</h4>
                                <div class="summary-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">إجمالي النقاط:</span>
                                        <span class="stat-value">${totalPoints}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">إجمالي الساعات:</span>
                                        <span class="stat-value">${totalHours}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">عدد الممارسات:</span>
                                        <span class="stat-value">${practicesData.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
        @media print {
            .no-print { display: none !important; }
            body { font-size: 12px; }
            .final-report-document { margin: 0; padding: 0; }
        }

        .final-report-document {
            background: white;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-family: 'Cairo', sans-serif;
            line-height: 1.4;
        }

        .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid var(--primary-color);
            padding-bottom: 20px;
        }

        .university-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .report-logo-left, .report-logo-right {
            height: 80px;
            width: auto;
        }

        .university-info {
            text-align: center;
            flex: 1;
        }

        .university-name-ar {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 5px;
        }

        .university-name-en {
            font-size: 18px;
            color: var(--secondary-color);
            margin-bottom: 0;
        }

        .report-main-title {
            font-size: 28px;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .report-subtitle {
            font-size: 20px;
            color: var(--secondary-color);
            margin-bottom: 0;
        }

        .section-title {
            background: var(--primary-color);
            color: white;
            padding: 10px 15px;
            margin: 25px 0 15px 0;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
        }

        .info-table, .practices-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .info-table td, .practices-table th, .practices-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        .info-table .label-cell {
            background-color: #f8f9fa;
            font-weight: bold;
            width: 25%;
        }

        .info-table .value-cell {
            width: 25%;
        }

        .practices-table th {
            background-color: var(--primary-color);
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .practices-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .report-footer {
            margin-top: 40px;
            border-top: 2px solid var(--primary-color);
            padding-top: 20px;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .signature-box {
            text-align: center;
            width: 45%;
        }

        .signature-line {
            border-bottom: 2px solid #333;
            margin: 20px 0 10px 0;
            height: 40px;
        }

        .signature-date {
            font-size: 12px;
            color: #666;
        }

        .summary-section {
            text-align: center;
        }

        .summary-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid var(--primary-color);
        }

        .summary-box h4 {
            color: var(--primary-color);
            margin-bottom: 15px;
            font-size: 18px;
        }

        .summary-stats {
            display: flex;
            justify-content: space-around;
        }

        .stat-item {
            text-align: center;
        }

        .stat-label {
            display: block;
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
        }

        .stat-value {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
        }
        </style>
    `;
}

// وظائف مساعدة لإنشاء صفوف الجداول
function generateTrainingRows(practicesData) {
    const trainingPractices = practicesData.filter(p => 
        p.type === 'التدريب على رأس العمل' || p.type === 'التدريب الاختياري'
    );
    
    if (trainingPractices.length === 0) {
        return '<tr><td colspan="7" class="text-center text-muted">لا توجد ممارسات تدريبية</td></tr>';
    }
    
    return trainingPractices.map(practice => `
        <tr>
            <td>${practice.organization}</td>
            <td>${practice.type}</td>
            <td>${practice.participationType}</td>
            <td>${practice.participationLevel}</td>
            <td>${practice.duration} ساعة</td>
            <td>${new Date(practice.startDate).toLocaleDateString('ar-SA')} - ${new Date(practice.endDate).toLocaleDateString('ar-SA')}</td>
            <td><strong>${practice.points}</strong></td>
        </tr>
    `).join('');
}

function generateFieldVisitsRows(practicesData) {
    const fieldVisits = practicesData.filter(p => p.type === 'الزيارات الميدانية');
    
    if (fieldVisits.length === 0) {
        return '<tr><td colspan="8" class="text-center text-muted">لا توجد زيارات ميدانية</td></tr>';
    }
    
    return fieldVisits.map(practice => `
        <tr>
            <td>${practice.organization}</td>
            <td>${practice.title}</td>
            <td>${practice.duration} ساعة</td>
            <td>${practice.organization}</td>
            <td>${practice.participationLevel}</td>
            <td>-</td>
            <td>${new Date(practice.startDate).toLocaleDateString('ar-SA')} - ${new Date(practice.endDate).toLocaleDateString('ar-SA')}</td>
            <td><strong>${practice.points}</strong></td>
        </tr>
    `).join('');
}

function generateWorkshopsRows(practicesData) {
    const workshops = practicesData.filter(p => 
        p.type === 'ورش العمل والندوات' || 
        p.type === 'المؤتمرات المهنية' ||
        p.type === 'المسابقات والهاكاثونات'
    );
    
    if (workshops.length === 0) {
        return '<tr><td colspan="9" class="text-center text-muted">لا توجد ورش عمل أو ندوات</td></tr>';
    }
    
    return workshops.map(practice => `
        <tr>
            <td>${practice.organization}</td>
            <td>${practice.participationType}</td>
            <td>${practice.participationType}</td>
            <td>${practice.title}</td>
            <td>${practice.organization}</td>
            <td>${practice.participationLevel}</td>
            <td>${practice.duration} ساعة</td>
            <td>${new Date(practice.startDate).toLocaleDateString('ar-SA')} - ${new Date(practice.endDate).toLocaleDateString('ar-SA')}</td>
            <td><strong>${practice.points}</strong></td>
        </tr>
    `).join('');
}

// باقي الوظائف...
function generatePracticeTypeStats(practicesData) {
    const typeStats = {};
    
    practicesData.forEach(practice => {
        if (!typeStats[practice.type]) {
            typeStats[practice.type] = {
                count: 0,
                totalPoints: 0
            };
        }
        typeStats[practice.type].count++;
        typeStats[practice.type].totalPoints += practice.points;
    });
    
    return Object.entries(typeStats).map(([type, stats]) => `
        <tr>
            <td>${type}</td>
            <td>${stats.count}</td>
            <td>${stats.totalPoints}</td>
            <td>${Math.round(stats.totalPoints / stats.count)}</td>
        </tr>
    `).join('');
}

function getRoleDisplayName(role) {
    const roleNames = {
        'student': 'الطالب',
        'reviewer': 'المراجع',
        'approver': 'المعتمد',
        'certifier': 'المصدق',
        'admin': 'المدير'
    };
    return roleNames[role] || role;
}

function loadUsers() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">إدارة المستخدمين</h1>
                <button class="btn btn-success" onclick="addUser()">
                    <i class="fas fa-user-plus me-2"></i>إضافة مستخدم جديد
                </button>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>الدور</th>
                                    <th>الفرع</th>
                                    <th>الحالة</th>
                                    <th>تاريخ التسجيل</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(sampleData.users).map(([email, user]) => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${email}</td>
                                        <td>
                                            <span class="badge ${getRoleBadgeClass(user.role)}">
                                                ${getRoleText(user.role)}
                                            </span>
                                        </td>
                                        <td>${user.branch || '-'}</td>
                                        <td><span class="badge bg-success">نشط</span></td>
                                        <td>2024/01/15</td>
                                        <td>
                                            <div class="btn-group btn-group-sm">
                                                <button class="btn btn-outline-primary" onclick="editUser('${email}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-outline-warning" onclick="resetPassword('${email}')">
                                                    <i class="fas fa-key"></i>
                                                </button>
                                                <button class="btn btn-outline-danger" onclick="deleteUser('${email}')">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function generatePracticesTable(practices, isStudent = false, isReviewer = false, isApprover = false) {
    if (practices.length === 0) {
        return `
            <div class="text-center py-5">
                <i class="fas fa-clipboard-list text-muted" style="font-size: 4rem;"></i>
                <h4 class="text-muted mt-3">لا توجد ممارسات مهنية</h4>
                <p class="text-muted">لم يتم العثور على ممارسات مهنية</p>
                ${isStudent ? '<button class="btn btn-primary" onclick="loadPage(\'add-practice\')"><i class="fas fa-plus me-2"></i>إضافة ممارسة جديدة</button>' : ''}
            </div>
        `;
    }
    
    return `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>نوع الممارسة</th>
                        <th>نوع المشاركة</th>
                        <th>المستوى</th>
                        <th>المؤسسة</th>
                        <th>فترة الممارسة</th>
                        <th>الحالة</th>
                        <th>النقاط</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${practices.map(practice => `
                        <tr>
                            <td>
                                <div>
                                    <strong>${practice.title}</strong>
                                </div>
                            </td>
                            <td>${practice.type}</td>
                            <td>${practice.participationType}</td>
                            <td>${practice.participationLevel}</td>
                            <td>${practice.organization}</td>
                            <td>
                                <small>
                                    من: ${practice.startDate}<br>
                                    إلى: ${practice.endDate}
                                </small>
                            </td>
                            <td>
                                <span class="badge ${getStatusBadgeClass(practice.status)}">
                                    ${getStatusText(practice.status)}
                                </span>
                            </td>
                            <td>
                                <strong class="text-primary">${practice.points}</strong>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewPractice(${practice.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${isStudent && practice.status === 'pending' ? `
                                        <button class="btn btn-sm btn-outline-warning" onclick="editPractice(${practice.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    ` : ''}
                                    ${isReviewer && practice.status === 'pending' ? `
                                        <button class="action-btn btn-approve" onclick="reviewPractice(${practice.id}, 'approve')">
                                            <i class="fas fa-check"></i> موافقة
                                        </button>
                                        <button class="action-btn btn-return" onclick="reviewPractice(${practice.id}, 'return')">
                                            <i class="fas fa-undo"></i> إرجاع
                                        </button>
                                        <button class="action-btn btn-reject" onclick="reviewPractice(${practice.id}, 'reject')">
                                            <i class="fas fa-times"></i> رفض
                                        </button>
                                    ` : ''}
                                    ${isApprover && practice.status === 'under_review' ? `
                                        <button class="action-btn btn-approve" onclick="approvePractice(${practice.id}, 'approve')">
                                            <i class="fas fa-stamp"></i> اعتماد
                                        </button>
                                        <button class="action-btn btn-return" onclick="approvePractice(${practice.id}, 'return')">
                                            <i class="fas fa-undo"></i> إرجاع
                                        </button>
                                        <button class="action-btn btn-reject" onclick="approvePractice(${practice.id}, 'reject')">
                                            <i class="fas fa-times"></i> رفض
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending': return 'badge-warning';
        case 'under_review': return 'badge-info';
        case 'approved': return 'badge-success';
        case 'rejected': return 'badge-danger';
        case 'certified': return 'badge-primary';
        default: return 'badge-secondary';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'pending': return 'في الانتظار';
        case 'under_review': return 'قيد المراجعة';
        case 'approved': return 'معتمد';
        case 'rejected': return 'مرفوض';
        case 'certified': return 'مصدق';
        default: return 'غير محدد';
    }
}

function getRoleBadgeClass(role) {
    switch (role) {
        case 'student': return 'bg-primary';
        case 'reviewer': return 'bg-info';
        case 'approver': return 'bg-success';
        case 'admin': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getRoleText(role) {
    switch (role) {
        case 'student': return 'طالب';
        case 'reviewer': return 'مراجع';
        case 'approver': return 'معتمد';
        case 'admin': return 'مدير';
        default: return 'غير محدد';
    }
}

// Practice Builder Functions
let fieldIndex = 0;

function initializePracticeBuilder() {
    fieldIndex = 0;
}

function addDynamicField() {
    const container = document.getElementById('dynamicFields');
    const index = fieldIndex++;
    
    const fieldHtml = `
        <div class="field-builder" data-index="${index}">
            <button type="button" class="remove-field-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">اسم الحقل</label>
                    <input type="text" name="label_${index}" class="form-control" placeholder="مثال: تاريخ التنفيذ">
                </div>
                
                <div class="col-md-6 mb-3">
                    <label class="form-label">نوع الحقل</label>
                    <select name="type_${index}" class="form-select" onchange="toggleFieldOptions(this, ${index})">
                        <option value="text">نص</option>
                        <option value="number">رقم</option>
                        <option value="date">تاريخ</option>
                        <option value="daterange">نطاق تاريخ</option>
                        <option value="time">وقت</option>
                        <option value="file">ملف</option>
                        <option value="select">قائمة</option>
                    </select>
                </div>
            </div>
            
            <div id="options_${index}" class="mb-3" style="display: none;">
                <label class="form-label">عناصر القائمة (افصل بينها بفاصلة)</label>
                <input type="text" name="options_${index}" class="form-control" placeholder="مثال: خيار1, خيار2, خيار3">
            </div>
            
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="required_${index}">
                <label class="form-check-label">إلزامي</label>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function toggleFieldOptions(selectElement, index) {
    const optionsDiv = document.getElementById(`options_${index}`);
    if (selectElement.value === 'select') {
        optionsDiv.style.display = 'block';
    } else {
        optionsDiv.style.display = 'none';
    }
}

function generatePracticeForm() {
    const practiceName = document.getElementById('practiceName').value || 'نموذج بدون اسم';
    const formPreview = document.getElementById('formPreview');
    
    // Get selected participation types
    const selectedTypes = Array.from(document.querySelectorAll('input[name="participationType"]:checked'))
        .map(el => el.value);
    
    // Get selected participation levels
    const selectedLevels = Array.from(document.querySelectorAll('input[name="participationLevel"]:checked'))
        .map(el => el.value);
    
    let formHtml = `<h5 class="mb-3">${practiceName}</h5>`;
    
    // Add participation type dropdown
    if (selectedTypes.length > 0) {
        formHtml += `
            <div class="mb-3">
                <label class="form-label">نوع المشاركة <span class="text-danger">*</span></label>
                <select class="form-select" required>
                    <option value="">-- اختر نوع المشاركة --</option>
                    ${selectedTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
        `;
    }
    
    // Add participation level dropdown
    if (selectedLevels.length > 0) {
        formHtml += `
            <div class="mb-3">
                <label class="form-label">مستوى المشاركة <span class="text-danger">*</span></label>
                <select class="form-select" required>
                    <option value="">-- اختر مستوى المشاركة --</option>
                    ${selectedLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
                </select>
            </div>
        `;
    }
    
    // Add dynamic fields
    const fields = document.querySelectorAll('[data-index]');
    fields.forEach(field => {
        const index = field.dataset.index;
        const label = field.querySelector(`[name=label_${index}]`).value;
        const type = field.querySelector(`[name=type_${index}]`).value;
        const required = field.querySelector(`[name=required_${index}]`).checked;
        const options = field.querySelector(`[name=options_${index}]`)?.value?.split(',') || [];
        
        if (label) {
            formHtml += `
                <div class="mb-3">
                    <label class="form-label">${label} ${required ? '<span class="text-danger">*</span>' : ''}</label>
            `;
            
            if (type === 'select') {
                formHtml += `
                    <select class="form-select" ${required ? 'required' : ''}>
                        <option value="">-- اختر --</option>
                        ${options.map(opt => `<option value="${opt.trim()}">${opt.trim()}</option>`).join('')}
                    </select>
                `;
            } else if (type === 'daterange') {
                formHtml += `<input type="text" class="form-control" placeholder="اختر نطاق التاريخ" ${required ? 'required' : ''}>`;
            } else {
                formHtml += `<input type="${type}" class="form-control" ${required ? 'required' : ''}>`;
            }
            
            formHtml += '</div>';
        }
    });
    
    formPreview.innerHTML = formHtml;
    showToast('تم إنشاء النموذج بنجاح', 'success');
}

function clearPracticeBuilder() {
    document.getElementById('practiceName').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('dynamicFields').innerHTML = '';
    document.getElementById('formPreview').innerHTML = '<p class="text-muted text-center">سيظهر النموذج هنا بعد الإنشاء</p>';
    fieldIndex = 0;
    showToast('تم مسح النموذج', 'info');
}

// Action Functions
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
        
        showToast('تم نسخ النص بنجاح', 'success');
    }).catch(() => {
        showToast('فشل في نسخ النص', 'error');
    });
}

function downloadRecord() {
    showToast('جاري تحميل السجل...', 'info');
    // Simulate download
    setTimeout(() => {
        showToast('تم تحميل السجل بنجاح', 'success');
    }, 2000);
}

function viewPractice(id) {
    showToast(`عرض تفاصيل الممارسة رقم ${id}`, 'info');
}

function editPractice(id) {
    showToast(`تعديل الممارسة رقم ${id}`, 'info');
}

function reviewPractice(id, action) {
    const actionText = action === 'approve' ? 'الموافقة على' : action === 'return' ? 'إرجاع' : 'رفض';
    showToast(`تم ${actionText} الممارسة رقم ${id}`, 'success');
}

function approvePractice(id, action) {
    const actionText = action === 'approve' ? 'اعتماد' : action === 'return' ? 'إرجاع' : 'رفض';
    showToast(`تم ${actionText} الممارسة رقم ${id}`, 'success');
}

// Settings Functions
function addPracticeType() {
    showToast('إضافة نوع ممارسة جديد', 'info');
}

function editPracticeType(index) {
    showToast(`تعديل نوع الممارسة رقم ${index}`, 'info');
}

function deletePracticeType(index) {
    showToast(`حذف نوع الممارسة رقم ${index}`, 'warning');
}

function addParticipationType() {
    showToast('إضافة نوع مشاركة جديد', 'info');
}

function editParticipationType(index) {
    showToast(`تعديل نوع المشاركة رقم ${index}`, 'info');
}

function deleteParticipationType(index) {
    showToast(`حذف نوع المشاركة رقم ${index}`, 'warning');
}

function addParticipationLevel() {
    showToast('إضافة مستوى مشاركة جديد', 'info');
}

function editParticipationLevel(index) {
    showToast(`تعديل مستوى المشاركة رقم ${index}`, 'info');
}

function deleteParticipationLevel(index) {
    showToast(`حذف مستوى المشاركة رقم ${index}`, 'warning');
}

function addUser() {
    showToast('إضافة مستخدم جديد', 'info');
}

function editUser(email) {
    showToast(`تعديل المستخدم ${email}`, 'info');
}

function resetPassword(email) {
    showToast(`إعادة تعيين كلمة مرور ${email}`, 'warning');
}

function deleteUser(email) {
    showToast(`حذف المستخدم ${email}`, 'warning');
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 start-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerHTML = `
        <div class="toast-body d-flex align-items-center">
            <i class="fas ${getToastIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close ms-auto" onclick="this.closest('.toast').remove()"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle text-success';
        case 'error': return 'fa-exclamation-circle text-danger';
        case 'warning': return 'fa-exclamation-triangle text-warning';
        case 'info': return 'fa-info-circle text-info';
        default: return 'fa-info-circle text-info';
    }
}