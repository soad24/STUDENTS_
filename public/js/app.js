// Global variables
let currentUser = null;
let currentPage = 'landing';

// Utility functions
function showElement(elementId) {
    document.getElementById(elementId).classList.remove('d-none');
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add('d-none');
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('#pageContent');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function getStatusBadgeClass(status) {
    const statusClasses = {
        'pending': 'bg-warning text-dark',
        'under_review': 'bg-info',
        'approved': 'bg-success',
        'rejected': 'bg-danger',
        'certified': 'bg-primary'
    };
    return statusClasses[status] || 'bg-secondary';
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'في الانتظار',
        'under_review': 'قيد المراجعة',
        'approved': 'معتمد',
        'rejected': 'مرفوض',
        'certified': 'مصدق'
    };
    return statusTexts[status] || 'غير محدد';
}

// Navigation functions
function showLandingPage() {
    hideElement('loginPage');
    hideElement('mainApp');
    showElement('landingPage');
    currentPage = 'landing';
}

function showLoginPage() {
    hideElement('landingPage');
    hideElement('mainApp');
    showElement('loginPage');
    currentPage = 'login';
}

function showMainApp() {
    hideElement('landingPage');
    hideElement('loginPage');
    showElement('mainApp');
    currentPage = 'main';
    setupSidebar();
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// Authentication functions
async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            document.getElementById('userName').textContent = currentUser.name;
            showMainApp();
            showDashboard();
            return true;
        } else {
            throw new Error(data.error || 'خطأ في تسجيل الدخول');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert(error.message, 'danger');
        return false;
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        showLandingPage();
    } catch (error) {
        console.error('Logout error:', error);
        showLandingPage(); // Force logout even if request fails
    }
}

async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            document.getElementById('userName').textContent = currentUser.name;
            showMainApp();
            showDashboard();
        } else {
            showLandingPage();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showLandingPage();
    }
}

// Sidebar setup
function setupSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    const practicesNavItem = document.getElementById('practicesNavItem');
    const addPracticeNavItem = document.getElementById('addPracticeNavItem');
    const templatesNavItem = document.getElementById('templatesNavItem');
    const practicesNavText = document.getElementById('practicesNavText');

    let sidebarItems = [];

    if (currentUser.role === 'student') {
        sidebarItems = [
            { icon: 'fas fa-tachometer-alt', text: 'لوحة التحكم', action: 'showDashboard()' },
            { icon: 'fas fa-list', text: 'ممارساتي المهنية', action: 'showPractices()' },
            { icon: 'fas fa-plus', text: 'إضافة ممارسة جديدة', action: 'showAddPractice()' },
            { icon: 'fas fa-chart-bar', text: 'تقاريري', action: 'showReports()' }
        ];
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'block';
        templatesNavItem.style.display = 'none';
        practicesNavText.textContent = 'ممارساتي المهنية';
    } else if (currentUser.role === 'admin') {
        sidebarItems = [
            { icon: 'fas fa-tachometer-alt', text: 'لوحة التحكم', action: 'showDashboard()' },
            { icon: 'fas fa-file-alt', text: 'قوالب الممارسات', action: 'showTemplates()' },
            { icon: 'fas fa-users', text: 'إدارة المستخدمين', action: 'showUsers()' },
            { icon: 'fas fa-chart-bar', text: 'التقارير', action: 'showReports()' }
        ];
        practicesNavItem.style.display = 'none';
        addPracticeNavItem.style.display = 'none';
        templatesNavItem.style.display = 'block';
    } else {
        sidebarItems = [
            { icon: 'fas fa-tachometer-alt', text: 'لوحة التحكم', action: 'showDashboard()' },
            { icon: 'fas fa-list', text: 'الممارسات المهنية', action: 'showPractices()' },
            { icon: 'fas fa-chart-bar', text: 'التقارير', action: 'showReports()' }
        ];
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'none';
        templatesNavItem.style.display = 'none';
        practicesNavText.textContent = 'الممارسات المهنية';
    }

    sidebar.innerHTML = sidebarItems.map(item => `
        <li class="nav-item">
            <a class="nav-link" href="#" onclick="${item.action}">
                <i class="${item.icon} me-2"></i>
                ${item.text}
            </a>
        </li>
    `).join('');
}

// Dashboard functions
async function showDashboard() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        let dashboardHTML = '';

        if (currentUser.role === 'student') {
            dashboardHTML = `
                <div class="py-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="h3 mb-0">مرحباً ${currentUser.name}</h1>
                        <span class="badge bg-primary fs-6">${currentUser.student_id || ''}</span>
                    </div>

                    <!-- Statistics Cards -->
                    <div class="row mb-4">
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card stats-card h-100">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <div class="text-white-75 small">إجمالي النقاط</div>
                                            <div class="text-white h4">${data.stats.totalPoints}</div>
                                        </div>
                                        <div class="text-white-50">
                                            <i class="fas fa-star fa-2x"></i>
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
                                            <div class="text-white-75 small">معتمدة</div>
                                            <div class="text-white h4">${data.stats.approvedCount}</div>
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
                                            <div class="text-white h4">${data.stats.pendingCount}</div>
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
                                            <div class="text-white h4">${data.stats.totalPractices}</div>
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
                                            <button onclick="showAddPractice()" class="btn btn-success w-100">
                                                <i class="fas fa-plus me-2"></i>
                                                إضافة ممارسة جديدة
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showPractices()" class="btn btn-primary w-100">
                                                <i class="fas fa-list me-2"></i>
                                                عرض جميع الممارسات
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button class="btn btn-info w-100">
                                                <i class="fas fa-download me-2"></i>
                                                تحميل السجل
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showReports()" class="btn btn-warning w-100">
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
                            <button onclick="showPractices()" class="btn btn-sm btn-outline-primary">عرض الكل</button>
                        </div>
                        <div class="card-body">
                            ${data.practices.length > 0 ? `
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>العنوان</th>
                                                <th>نوع الممارسة</th>
                                                <th>المؤسسة</th>
                                                <th>الحالة</th>
                                                <th>النقاط</th>
                                                <th>تاريخ الإرسال</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${data.practices.map(practice => `
                                                <tr>
                                                    <td><strong>${practice.title}</strong></td>
                                                    <td>${practice.practice_type_name}</td>
                                                    <td>${practice.organization}</td>
                                                    <td>
                                                        <span class="badge ${getStatusBadgeClass(practice.status)}">
                                                            ${getStatusText(practice.status)}
                                                        </span>
                                                    </td>
                                                    <td><strong class="text-primary">${practice.calculated_points}</strong></td>
                                                    <td>${formatDate(practice.created_at)}</td>
                                                    <td>
                                                        <button onclick="viewPractice(${practice.id})" class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : `
                                <div class="text-center py-5">
                                    <i class="fas fa-clipboard-list text-muted" style="font-size: 4rem;"></i>
                                    <h4 class="text-muted mt-3">لا توجد ممارسات مهنية</h4>
                                    <p class="text-muted">ابدأ بإضافة أول ممارسة مهنية لك</p>
                                    <button onclick="showAddPractice()" class="btn btn-primary">
                                        <i class="fas fa-plus me-2"></i>
                                        إضافة ممارسة جديدة
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        } else if (currentUser.role === 'admin') {
            dashboardHTML = `
                <div class="py-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="h3 mb-0">لوحة تحكم المدير</h1>
                        <span class="badge bg-danger fs-6">مدير النظام</span>
                    </div>

                    <!-- Statistics Cards -->
                    <div class="row mb-4">
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card stats-card h-100">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <div class="text-white-75 small">إجمالي الطلبة</div>
                                            <div class="text-white h4">${data.stats.total_students}</div>
                                        </div>
                                        <div class="text-white-50">
                                            <i class="fas fa-users fa-2x"></i>
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
                                            <div class="text-white h4">${data.stats.total_practices}</div>
                                        </div>
                                        <div class="text-white-50">
                                            <i class="fas fa-list fa-2x"></i>
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
                                            <div class="text-white h4">${data.stats.pending_practices}</div>
                                        </div>
                                        <div class="text-white-50">
                                            <i class="fas fa-clock fa-2x"></i>
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
                                            <div class="text-white-75 small">معتمدة</div>
                                            <div class="text-white h4">${data.stats.approved_practices}</div>
                                        </div>
                                        <div class="text-white-50">
                                            <i class="fas fa-check-circle fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">الإجراءات السريعة</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showTemplates()" class="btn btn-primary w-100">
                                                <i class="fas fa-file-alt me-2"></i>
                                                إدارة القوالب
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showUsers()" class="btn btn-info w-100">
                                                <i class="fas fa-users me-2"></i>
                                                إدارة المستخدمين
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showPractices()" class="btn btn-success w-100">
                                                <i class="fas fa-list me-2"></i>
                                                عرض الممارسات
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showReports()" class="btn btn-warning w-100">
                                                <i class="fas fa-chart-bar me-2"></i>
                                                التقارير
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Reviewer/Approver dashboard
            const roleText = currentUser.role === 'reviewer' ? 'المراجع' : 'المعتمد';
            dashboardHTML = `
                <div class="py-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="h3 mb-0">لوحة تحكم ${roleText}</h1>
                        <span class="badge bg-info fs-6">${roleText}</span>
                    </div>

                    <!-- Pending Practices -->
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">الممارسات المهنية المطلوب ${currentUser.role === 'reviewer' ? 'مراجعتها' : 'اعتمادها'}</h5>
                        </div>
                        <div class="card-body">
                            ${data.practices && data.practices.length > 0 ? `
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>الطالب</th>
                                                <th>العنوان</th>
                                                <th>نوع الممارسة</th>
                                                <th>تاريخ الإرسال</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${data.practices.map(practice => `
                                                <tr>
                                                    <td><strong>${practice.student_name}</strong></td>
                                                    <td>${practice.title}</td>
                                                    <td>${practice.practice_type_name}</td>
                                                    <td>${formatDate(practice.created_at)}</td>
                                                    <td>
                                                        <button onclick="viewPractice(${practice.id})" class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-eye"></i> عرض
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : `
                                <div class="text-center py-5">
                                    <i class="fas fa-clipboard-check text-muted" style="font-size: 4rem;"></i>
                                    <h4 class="text-muted mt-3">لا توجد ممارسات مطلوب ${currentUser.role === 'reviewer' ? 'مراجعتها' : 'اعتمادها'}</h4>
                                    <p class="text-muted">جميع الممارسات المهنية تم ${currentUser.role === 'reviewer' ? 'مراجعتها' : 'اعتمادها'}</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }

        document.getElementById('pageContent').innerHTML = dashboardHTML;
        updateActiveNavigation('dashboard');
    } catch (error) {
        console.error('Dashboard error:', error);
        showAlert('خطأ في تحميل لوحة التحكم', 'danger');
    }
}

// Practices functions
async function showPractices() {
    try {
        const response = await fetch('/api/practices');
        const data = await response.json();

        const practicesHTML = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">${currentUser.role === 'student' ? 'ممارساتي المهنية' : 'الممارسات المهنية'}</h1>
                    ${currentUser.role === 'student' ? `
                        <button onclick="showAddPractice()" class="btn btn-success">
                            <i class="fas fa-plus me-2"></i>
                            إضافة ممارسة جديدة
                        </button>
                    ` : ''}
                </div>

                <!-- Practices List -->
                <div class="card">
                    <div class="card-body">
                        ${data.practices.length > 0 ? `
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            ${currentUser.role !== 'student' ? '<th>الطالب</th>' : ''}
                                            <th>العنوان</th>
                                            <th>نوع الممارسة</th>
                                            <th>نوع المشاركة</th>
                                            <th>المستوى</th>
                                            <th>المؤسسة</th>
                                            <th>الحالة</th>
                                            <th>النقاط</th>
                                            <th>الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.practices.map(practice => `
                                            <tr>
                                                ${currentUser.role !== 'student' ? `<td><strong>${practice.student_name}</strong></td>` : ''}
                                                <td><strong>${practice.title}</strong></td>
                                                <td>${practice.practice_type_name}</td>
                                                <td>${practice.participation_type_name}</td>
                                                <td>${practice.participation_level_name}</td>
                                                <td>${practice.organization}</td>
                                                <td>
                                                    <span class="badge ${getStatusBadgeClass(practice.status)}">
                                                        ${getStatusText(practice.status)}
                                                    </span>
                                                </td>
                                                <td><strong class="text-primary">${practice.calculated_points}</strong></td>
                                                <td>
                                                    <div class="btn-group btn-group-sm" role="group">
                                                        <button onclick="viewPractice(${practice.id})" class="btn btn-outline-primary" title="عرض">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                        ${currentUser.role === 'reviewer' && practice.status === 'pending' ? `
                                                            <button onclick="reviewPractice(${practice.id})" class="btn btn-outline-info" title="مراجعة">
                                                                <i class="fas fa-check"></i>
                                                            </button>
                                                        ` : ''}
                                                        ${currentUser.role === 'approver' && practice.status === 'under_review' ? `
                                                            <button onclick="approvePractice(${practice.id})" class="btn btn-outline-success" title="اعتماد">
                                                                <i class="fas fa-stamp"></i>
                                                            </button>
                                                        ` : ''}
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : `
                            <div class="text-center py-5">
                                <i class="fas fa-clipboard-list text-muted" style="font-size: 4rem;"></i>
                                <h4 class="text-muted mt-3">لا توجد ممارسات مهنية</h4>
                                <p class="text-muted">لم يتم العثور على ممارسات مهنية</p>
                                ${currentUser.role === 'student' ? `
                                    <button onclick="showAddPractice()" class="btn btn-primary">
                                        <i class="fas fa-plus me-2"></i>
                                        إضافة ممارسة جديدة
                                    </button>
                                ` : ''}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = practicesHTML;
        updateActiveNavigation('practices');
    } catch (error) {
        console.error('Practices error:', error);
        showAlert('خطأ في تحميل الممارسات المهنية', 'danger');
    }
}

async function showAddPractice() {
    try {
        const response = await fetch('/api/practice-form-data');
        const data = await response.json();

        const addPracticeHTML = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">إضافة ممارسة مهنية جديدة</h1>
                    <button onclick="showPractices()" class="btn btn-outline-secondary">
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
                                <form id="addPracticeForm" enctype="multipart/form-data">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="practice_type_id" class="form-label">نوع الممارسة <span class="text-danger">*</span></label>
                                            <select class="form-select" name="practice_type_id" id="practice_type_id" required>
                                                <option value="">اختر نوع الممارسة</option>
                                                ${data.practiceTypes.map(type => `
                                                    <option value="${type.id}" data-points="${type.base_points}">
                                                        ${type.name_ar}
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </div>
                                        
                                        <div class="col-md-6 mb-3">
                                            <label for="participation_type_id" class="form-label">نوع المشاركة <span class="text-danger">*</span></label>
                                            <select class="form-select" name="participation_type_id" id="participation_type_id" required>
                                                <option value="">اختر نوع المشاركة</option>
                                                ${data.participationTypes.map(type => `
                                                    <option value="${type.id}" data-multiplier="${type.multiplier}">
                                                        ${type.name_ar}
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="participation_level_id" class="form-label">مستوى المشاركة <span class="text-danger">*</span></label>
                                        <select class="form-select" name="participation_level_id" id="participation_level_id" required>
                                            <option value="">اختر مستوى المشاركة</option>
                                            ${data.participationLevels.map(level => `
                                                <option value="${level.id}" data-multiplier="${level.multiplier}">
                                                    ${level.name_ar}
                                                </option>
                                            `).join('')}
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="title" class="form-label">عنوان الممارسة <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="title" id="title" required>
                                    </div>

                                    <div class="mb-3">
                                        <label for="organization" class="form-label">المؤسسة/الجهة المنظمة <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="organization" id="organization" required>
                                    </div>

                                    <div class="mb-3">
                                        <label for="description" class="form-label">وصف الممارسة</label>
                                        <textarea class="form-control" name="description" id="description" rows="3"></textarea>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="start_date" class="form-label">تاريخ البداية <span class="text-danger">*</span></label>
                                            <input type="date" class="form-control" name="start_date" id="start_date" required>
                                        </div>
                                        
                                        <div class="col-md-6 mb-3">
                                            <label for="end_date" class="form-label">تاريخ النهاية <span class="text-danger">*</span></label>
                                            <input type="date" class="form-control" name="end_date" id="end_date" required>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="duration_hours" class="form-label">عدد الساعات (اختياري)</label>
                                        <input type="number" class="form-control" name="duration_hours" id="duration_hours" min="1">
                                    </div>

                                    <div class="mb-3">
                                        <label for="attachments" class="form-label">المرفقات</label>
                                        <input type="file" class="form-control" name="attachments" id="attachments" multiple accept=".pdf,.jpg,.jpeg,.png">
                                        <div class="form-text">يمكنك رفع ملفات PDF أو صور (الحد الأقصى 5 ميجابايت لكل ملف)</div>
                                    </div>

                                    <div class="d-flex justify-content-end gap-2">
                                        <button type="button" onclick="showPractices()" class="btn btn-secondary">إلغاء</button>
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

                        <!-- Points Calculator Preview -->
                        <div class="card mt-3" id="pointsPreview" style="display: none;">
                            <div class="card-header">
                                <h6 class="card-title mb-0">معاينة النقاط</h6>
                            </div>
                            <div class="card-body">
                                <div class="text-center">
                                    <div class="display-4 text-primary" id="previewPoints">0</div>
                                    <small class="text-muted">نقطة متوقعة</small>
                                </div>
                                <hr>
                                <div class="small">
                                    <div>نوع الممارسة: <span id="previewPracticeType">-</span></div>
                                    <div>نوع المشاركة: <span id="previewParticipationType">-</span></div>
                                    <div>مستوى المشاركة: <span id="previewParticipationLevel">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = addPracticeHTML;
        updateActiveNavigation('add-practice');
        setupAddPracticeForm();
    } catch (error) {
        console.error('Add practice error:', error);
        showAlert('خطأ في تحميل نموذج إضافة الممارسة', 'danger');
    }
}

function setupAddPracticeForm() {
    const form = document.getElementById('addPracticeForm');
    const practiceTypeSelect = document.getElementById('practice_type_id');
    const participationTypeSelect = document.getElementById('participation_type_id');
    const participationLevelSelect = document.getElementById('participation_level_id');

    // Points calculator
    function updatePointsPreview() {
        const practiceTypeOption = practiceTypeSelect.selectedOptions[0];
        const participationTypeOption = participationTypeSelect.selectedOptions[0];
        const participationLevelOption = participationLevelSelect.selectedOptions[0];

        if (practiceTypeOption && participationTypeOption && participationLevelOption) {
            const basePoints = parseInt(practiceTypeOption.dataset.points) || 0;
            const participationMultiplier = parseInt(participationTypeOption.dataset.multiplier) || 1;
            const levelMultiplier = parseInt(participationLevelOption.dataset.multiplier) || 1;

            const calculatedPoints = basePoints * participationMultiplier * levelMultiplier;

            document.getElementById('previewPoints').textContent = calculatedPoints;
            document.getElementById('previewPracticeType').textContent = practiceTypeOption.textContent;
            document.getElementById('previewParticipationType').textContent = participationTypeOption.textContent;
            document.getElementById('previewParticipationLevel').textContent = participationLevelOption.textContent;

            document.getElementById('pointsPreview').style.display = 'block';
        } else {
            document.getElementById('pointsPreview').style.display = 'none';
        }
    }

    practiceTypeSelect.addEventListener('change', updatePointsPreview);
    participationTypeSelect.addEventListener('change', updatePointsPreview);
    participationLevelSelect.addEventListener('change', updatePointsPreview);

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/practices', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showAlert(data.message, 'success');
                showPractices();
            } else {
                throw new Error(data.error || 'خطأ في حفظ الممارسة');
            }
        } catch (error) {
            console.error('Submit practice error:', error);
            showAlert(error.message, 'danger');
        }
    });
}

async function viewPractice(practiceId) {
    try {
        const response = await fetch(`/api/practices/${practiceId}`);
        const data = await response.json();

        if (!data.practice) {
            throw new Error('الممارسة المهنية غير موجودة');
        }

        const practice = data.practice;

        const practiceHTML = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">تفاصيل الممارسة المهنية</h1>
                    <button onclick="showPractices()" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-right me-2"></i>
                        العودة للقائمة
                    </button>
                </div>

                <div class="row">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">${practice.title}</h5>
                            </div>
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>الطالب:</strong></div>
                                    <div class="col-sm-9">${practice.student_name}</div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>نوع الممارسة:</strong></div>
                                    <div class="col-sm-9">${practice.practice_type_name}</div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>نوع المشاركة:</strong></div>
                                    <div class="col-sm-9">${practice.participation_type_name}</div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>مستوى المشاركة:</strong></div>
                                    <div class="col-sm-9">${practice.participation_level_name}</div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>المؤسسة:</strong></div>
                                    <div class="col-sm-9">${practice.organization}</div>
                                </div>

                                ${practice.description ? `
                                    <div class="row mb-3">
                                        <div class="col-sm-3"><strong>الوصف:</strong></div>
                                        <div class="col-sm-9">${practice.description}</div>
                                    </div>
                                ` : ''}

                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>فترة الممارسة:</strong></div>
                                    <div class="col-sm-9">من ${formatDate(practice.start_date)} إلى ${formatDate(practice.end_date)}</div>
                                </div>

                                ${practice.duration_hours ? `
                                    <div class="row mb-3">
                                        <div class="col-sm-3"><strong>عدد الساعات:</strong></div>
                                        <div class="col-sm-9">${practice.duration_hours} ساعة</div>
                                    </div>
                                ` : ''}

                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>الحالة:</strong></div>
                                    <div class="col-sm-9">
                                        <span class="badge ${getStatusBadgeClass(practice.status)}">
                                            ${getStatusText(practice.status)}
                                        </span>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-3"><strong>النقاط:</strong></div>
                                    <div class="col-sm-9"><strong class="text-primary">${practice.calculated_points}</strong></div>
                                </div>

                                ${practice.attachments && practice.attachments.length > 0 ? `
                                    <div class="row mb-3">
                                        <div class="col-sm-3"><strong>المرفقات:</strong></div>
                                        <div class="col-sm-9">
                                            ${practice.attachments.map(attachment => `
                                                <div class="mb-2">
                                                    <a href="${attachment.path}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                        <i class="fas fa-download me-1"></i>
                                                        ${attachment.original_name}
                                                    </a>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                ${practice.reviewer_notes ? `
                                    <div class="row mb-3">
                                        <div class="col-sm-3"><strong>ملاحظات المراجع:</strong></div>
                                        <div class="col-sm-9">
                                            <div class="alert alert-info">
                                                ${practice.reviewer_notes}
                                                <br><small class="text-muted">بواسطة: ${practice.reviewer_name} في ${formatDate(practice.reviewed_at)}</small>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}

                                ${practice.approver_notes ? `
                                    <div class="row mb-3">
                                        <div class="col-sm-3"><strong>ملاحظات المعتمد:</strong></div>
                                        <div class="col-sm-9">
                                            <div class="alert alert-success">
                                                ${practice.approver_notes}
                                                <br><small class="text-muted">بواسطة: ${practice.approver_name} في ${formatDate(practice.approved_at)}</small>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        ${currentUser.role === 'reviewer' && practice.status === 'pending' ? `
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="card-title mb-0">مراجعة الممارسة</h6>
                                </div>
                                <div class="card-body">
                                    <form id="reviewForm">
                                        <div class="mb-3">
                                            <label class="form-label">الإجراء</label>
                                            <select class="form-select" name="action" required>
                                                <option value="">اختر الإجراء</option>
                                                <option value="approve">تحويل للاعتماد</option>
                                                <option value="return">إرجاع للطالب</option>
                                                <option value="reject">رفض</option>
                                            </select>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">ملاحظات</label>
                                            <textarea class="form-control" name="notes" rows="3"></textarea>
                                        </div>

                                        <div class="d-grid">
                                            <button type="submit" class="btn btn-primary">حفظ المراجعة</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ` : ''}

                        ${currentUser.role === 'approver' && practice.status === 'under_review' ? `
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="card-title mb-0">اعتماد الممارسة</h6>
                                </div>
                                <div class="card-body">
                                    <form id="approveForm">
                                        <div class="mb-3">
                                            <label class="form-label">الإجراء</label>
                                            <select class="form-select" name="action" required>
                                                <option value="">اختر الإجراء</option>
                                                <option value="approve">اعتماد</option>
                                                <option value="return">إرجاع للطالب</option>
                                                <option value="reject">رفض</option>
                                            </select>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">النقاط النهائية</label>
                                            <input type="number" class="form-control" name="points" value="${practice.calculated_points}" min="0">
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">ملاحظات</label>
                                            <textarea class="form-control" name="notes" rows="3"></textarea>
                                        </div>

                                        <div class="d-grid">
                                            <button type="submit" class="btn btn-success">حفظ الاعتماد</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ` : ''}

                        <div class="card mt-3">
                            <div class="card-header">
                                <h6 class="card-title mb-0">معلومات إضافية</h6>
                            </div>
                            <div class="card-body">
                                <div class="small">
                                    <div><strong>تاريخ الإرسال:</strong> ${formatDate(practice.created_at)}</div>
                                    ${practice.submission_deadline ? `
                                        <div><strong>الموعد النهائي للتقديم:</strong> ${formatDate(practice.submission_deadline)}</div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = practiceHTML;

        // Setup review form
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(reviewForm);
                
                try {
                    const response = await fetch(`/api/practices/${practiceId}/review`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: formData.get('action'),
                            notes: formData.get('notes')
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        showAlert(data.message, 'success');
                        viewPractice(practiceId); // Refresh the view
                    } else {
                        throw new Error(data.error || 'خطأ في حفظ المراجعة');
                    }
                } catch (error) {
                    console.error('Review error:', error);
                    showAlert(error.message, 'danger');
                }
            });
        }

        // Setup approve form
        const approveForm = document.getElementById('approveForm');
        if (approveForm) {
            approveForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(approveForm);
                
                try {
                    const response = await fetch(`/api/practices/${practiceId}/approve`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: formData.get('action'),
                            notes: formData.get('notes'),
                            points: formData.get('points')
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        showAlert(data.message, 'success');
                        viewPractice(practiceId); // Refresh the view
                    } else {
                        throw new Error(data.error || 'خطأ في حفظ الاعتماد');
                    }
                } catch (error) {
                    console.error('Approve error:', error);
                    showAlert(error.message, 'danger');
                }
            });
        }

    } catch (error) {
        console.error('View practice error:', error);
        showAlert('خطأ في تحميل تفاصيل الممارسة', 'danger');
    }
}

// Template management functions (Admin only)
async function showTemplates() {
    if (currentUser.role !== 'admin') {
        showAlert('غير مصرح لك بالوصول لهذه الصفحة', 'danger');
        return;
    }

    try {
        const response = await fetch('/api/templates');
        const data = await response.json();

        const templatesHTML = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">قوالب الممارسات المهنية</h1>
                    <button onclick="showCreateTemplate()" class="btn btn-success">
                        <i class="fas fa-plus me-2"></i>
                        إنشاء قالب جديد
                    </button>
                </div>

                <div class="card">
                    <div class="card-body">
                        ${data.templates.length > 0 ? `
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>اسم القالب</th>
                                            <th>الوصف</th>
                                            <th>أنواع المشاركة</th>
                                            <th>مستويات المشاركة</th>
                                            <th>الحقول المخصصة</th>
                                            <th>الحالة</th>
                                            <th>منشئ القالب</th>
                                            <th>تاريخ الإنشاء</th>
                                            <th>الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.templates.map(template => `
                                            <tr>
                                                <td><strong>${template.name}</strong></td>
                                                <td>${template.description ? template.description.substring(0, 50) + '...' : '-'}</td>
                                                <td><span class="badge bg-primary">${template.participation_types.length}</span></td>
                                                <td><span class="badge bg-info">${template.participation_levels.length}</span></td>
                                                <td><span class="badge bg-secondary">${template.custom_fields.length}</span></td>
                                                <td>
                                                    <span class="badge ${template.is_active ? 'bg-success' : 'bg-danger'}">
                                                        ${template.is_active ? 'نشط' : 'غير نشط'}
                                                    </span>
                                                </td>
                                                <td>${template.creator_name}</td>
                                                <td>${formatDate(template.created_at)}</td>
                                                <td>
                                                    <div class="btn-group btn-group-sm" role="group">
                                                        <button onclick="viewTemplate(${template.id})" class="btn btn-outline-primary" title="عرض">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                        <button onclick="editTemplate(${template.id})" class="btn btn-outline-warning" title="تعديل">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                        <button onclick="deleteTemplate(${template.id})" class="btn btn-outline-danger" title="حذف">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : `
                            <div class="text-center py-5">
                                <i class="fas fa-file-alt text-muted" style="font-size: 4rem;"></i>
                                <h4 class="text-muted mt-3">لا توجد قوالب</h4>
                                <p class="text-muted">لم يتم إنشاء أي قوالب للممارسات المهنية بعد</p>
                                <button onclick="showCreateTemplate()" class="btn btn-primary">
                                    <i class="fas fa-plus me-2"></i>
                                    إنشاء قالب جديد
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = templatesHTML;
        updateActiveNavigation('templates');
    } catch (error) {
        console.error('Templates error:', error);
        showAlert('خطأ في تحميل القوالب', 'danger');
    }
}

function showCreateTemplate() {
    const createTemplateHTML = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">إنشاء قالب ممارسة مهنية جديد</h1>
                <button onclick="showTemplates()" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-right me-2"></i>
                    العودة للقائمة
                </button>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <!-- Form Builder Integration -->
                            <div class="row">
                                <!-- قسم البناء -->
                                <div class="col-lg-6">
                                    <div class="border rounded p-4 mb-4" style="height: 70vh; overflow-y: auto;">
                                        <h5 class="text-center mb-4">
                                            <i class="fas fa-tools me-2"></i>بناء النموذج
                                        </h5>

                                        <form id="builder-form">
                                            <!-- اسم الممارسة -->
                                            <div class="mb-3">
                                                <label class="form-label">اسم قالب الممارسة</label>
                                                <input type="text" id="practice-name" name="name" class="form-control" placeholder="مثال: مبادرة تطوعية" required />
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">وصف القالب</label>
                                                <textarea id="practice-description" name="description" class="form-control" rows="3" placeholder="وصف مختصر للقالب"></textarea>
                                            </div>

                                            <!-- اختيار نوع ومستوى المشاركة -->
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label class="form-label">أنواع المشاركة</label>
                                                    <div id="participation-type-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #dee2e6; padding: 10px; border-radius: 5px;">
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="حضوري او افتراضي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">حضوري او افتراضي</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="حضور" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">حضور</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="تنظيم" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">تنظيم</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="تقديم" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">تقديم</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="عضو في مجلس الادارة" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">عضو في مجلس الادارة</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="عضو" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">عضو</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="المستوى الأساسي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">المستوى الأساسي</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="المستوى المتوسط" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">المستوى المتوسط</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="المستوى المتقدم" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">المستوى المتقدم</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="المستوى المتخصص / الصناعي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">المستوى المتخصص / الصناعي</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="مجال التخصص الاكاديمي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">مجال التخصص الاكاديمي</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="غير مجال التخصص الاكاديمي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">غير مجال التخصص الاكاديمي</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="مؤسسات العمل التطوعي المعتمدة" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">مؤسسات العمل التطوعي المعتمدة</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="نشر ورقة علمية في مجلة محكمة" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">نشر ورقة علمية في مجلة محكمة</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-type" value="الحصول على براءة الاختراع" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">الحصول على براءة الاختراع</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">مستويات المشاركة</label>
                                                    <div id="participation-level-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #dee2e6; padding: 10px; border-radius: 5px;">
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-level" value="محليا او دوليا" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">محليا او دوليا</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-level" value="خارج الفرع فقط" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">خارج الفرع فقط</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-level" value="الفرع" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">الفرع</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-level" value="الجامعة" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">الجامعة</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-level" value="محلي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">محلي</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="participation-level" value="دولي" class="form-check-input" onchange="toggleNumberInput(this)">
                                                            <label class="form-check-label">دولي</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- الحقول الديناميكية -->
                                            <div id="field-list" class="mt-4"></div>

                                            <div class="text-center mt-4">
                                                <button type="button" onclick="addField()" class="btn btn-success me-2">
                                                    <i class="fas fa-plus"></i> إضافة حقل
                                                </button>
                                                <button type="button" onclick="generateForm()" class="btn btn-primary">
                                                    <i class="fas fa-cog"></i> إنشاء النموذج
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                
                                <!-- النموذج الناتج -->
                                <div class="col-lg-6">
                                    <div class="border rounded p-4" style="height: 70vh; overflow-y: auto;">
                                        <div class="d-flex justify-content-between align-items-center mb-4">
                                            <h5>
                                                <i class="fas fa-file-alt me-2"></i>
                                                <span id="form-title">النموذج الناتج</span>
                                            </h5>
                                            <button onclick="clearForm()" class="btn btn-sm btn-outline-danger">
                                                <i class="fas fa-trash-alt"></i> مسح
                                            </button>
                                        </div>
                                        <form id="final-form"></form>
                                        <div id="calculation-result" class="mt-4 p-3 bg-light rounded d-none">
                                            <h6 class="text-primary">نتيجة الحساب</h6>
                                            <p id="total-value" class="h4 text-primary mb-0">0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="text-center mt-4">
                                <button type="button" onclick="saveTemplate()" class="btn btn-success btn-lg">
                                    <i class="fas fa-save me-2"></i>
                                    حفظ القالب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('pageContent').innerHTML = createTemplateHTML;
    setupTemplateBuilder();
}

function setupTemplateBuilder() {
    let fieldIndex = 0;

    window.toggleNumberInput = function(checkbox) {
        const container = checkbox.closest('.form-check');
        const inputId = `input-${checkbox.value.replace(/\s+/g, '-')}`;
        
        if (checkbox.checked) {
            if (!document.getElementById(inputId)) {
                const input = document.createElement('input');
                input.type = 'number';
                input.id = inputId;
                input.className = 'form-control form-control-sm mt-1';
                input.placeholder = 'النقاط';
                input.style.width = '80px';
                input.dataset.valueKey = checkbox.value;
                container.appendChild(input);
            }
        } else {
            const existingInput = document.getElementById(inputId);
            if (existingInput) existingInput.remove();
        }
    };

    window.addField = function() {
        const container = document.getElementById('field-list');
        const index = fieldIndex++;

        const html = `
            <div class="border rounded p-3 mb-3 bg-light position-relative" data-index="${index}">
                <button type="button" onclick="this.parentElement.remove()" 
                        class="btn btn-sm btn-outline-danger position-absolute top-0 start-0 m-2">
                    <i class="fas fa-times"></i>
                </button>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label small">اسم الحقل</label>
                        <input type="text" name="label_${index}" class="form-control form-control-sm" placeholder="مثال: تاريخ التنفيذ">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label small">نوع الحقل</label>
                        <select name="type_${index}" class="form-select form-select-sm" onchange="toggleOptions(this, ${index})">
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
                <div id="options_${index}" class="d-none">
                    <label class="form-label small">عناصر القائمة (افصل بينها بفاصلة)</label>
                    <input type="text" name="options_${index}" class="form-control form-control-sm" placeholder="مثال: خيار1, خيار2, خيار3">
                </div>
                <div class="form-check mt-2">
                    <input type="checkbox" name="required_${index}" class="form-check-input">
                    <label class="form-check-label small">إلزامي</label>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);
    };

    window.toggleOptions = function(selectElement, index) {
        const optionsDiv = document.getElementById(`options_${index}`);
        if (selectElement.value === 'select') {
            optionsDiv.classList.remove('d-none');
        } else {
            optionsDiv.classList.add('d-none');
        }
    };

    window.clearForm = function() {
        document.getElementById('final-form').innerHTML = '';
        document.getElementById('form-title').textContent = 'النموذج الناتج';
        document.getElementById('calculation-result').classList.add('d-none');
    };

    window.generateForm = function() {
        const form = document.getElementById('final-form');
        const formTitle = document.getElementById('form-title');
        form.innerHTML = '';

        const name = document.getElementById('practice-name').value || 'نموذج بدون اسم';
        formTitle.textContent = name;

        // جمع خيارات نوع المشاركة المختارة
        const selectedTypes = Array.from(document.querySelectorAll('input[name="participation-type"]:checked'))
            .map(el => el.value);

        // جمع خيارات مستوى المشاركة المختارة
        const selectedLevels = Array.from(document.querySelectorAll('input[name="participation-level"]:checked'))
            .map(el => el.value);

        // إضافة نوع المشاركة
        if (selectedTypes.length > 0) {
            const typeGroup = document.createElement('div');
            typeGroup.className = 'mb-3';

            const typeLabel = document.createElement('label');
            typeLabel.className = 'form-label';
            typeLabel.innerHTML = 'نوع المشاركة <span class="text-danger">*</span>';

            const typeSelect = document.createElement('select');
            typeSelect.className = 'form-select';
            typeSelect.required = true;
            typeSelect.name = 'selected-participation-type';

            const defaultTypeOption = document.createElement('option');
            defaultTypeOption.value = '';
            defaultTypeOption.textContent = '-- اختر نوع المشاركة --';
            typeSelect.appendChild(defaultTypeOption);

            selectedTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });

            typeGroup.appendChild(typeLabel);
            typeGroup.appendChild(typeSelect);
            form.appendChild(typeGroup);
        }

        // إضافة مستوى المشاركة
        if (selectedLevels.length > 0) {
            const levelGroup = document.createElement('div');
            levelGroup.className = 'mb-3';

            const levelLabel = document.createElement('label');
            levelLabel.className = 'form-label';
            levelLabel.innerHTML = 'مستوى المشاركة <span class="text-danger">*</span>';

            const levelSelect = document.createElement('select');
            levelSelect.className = 'form-select';
            levelSelect.required = true;
            levelSelect.name = 'selected-participation-level';

            const defaultLevelOption = document.createElement('option');
            defaultLevelOption.value = '';
            defaultLevelOption.textContent = '-- اختر مستوى المشاركة --';
            levelSelect.appendChild(defaultLevelOption);

            selectedLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = level;
                option.textContent = level;
                levelSelect.appendChild(option);
            });

            levelGroup.appendChild(levelLabel);
            levelGroup.appendChild(levelSelect);
            form.appendChild(levelGroup);
        }

        // باقي الحقول المضافة يدوياً
        const fields = document.querySelectorAll('[data-index]');
        fields.forEach(f => {
            const index = f.dataset.index;
            const label = f.querySelector(`[name=label_${index}]`).value;
            const type = f.querySelector(`[name=type_${index}]`).value;
            const required = f.querySelector(`[name=required_${index}]`).checked;
            const options = f.querySelector(`[name=options_${index}]`)?.value?.split(',') || [];

            if (!label) return;

            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'mb-3';

            const labelElement = document.createElement('label');
            labelElement.className = 'form-label';
            labelElement.innerHTML = label + (required ? ' <span class="text-danger">*</span>' : '');

            let inputElement;
            if (type === 'select') {
                inputElement = document.createElement('select');
                inputElement.className = 'form-select';
                const defaultOption = document.createElement('option');
                defaultOption.textContent = '-- اختر --';
                defaultOption.value = '';
                inputElement.appendChild(defaultOption);
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.textContent = opt.trim();
                    option.value = opt.trim();
                    inputElement.appendChild(option);
                });
            } else if (type === 'file') {
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.className = 'form-control';
            } else {
                inputElement = document.createElement('input');
                inputElement.type = type;
                inputElement.className = 'form-control';
            }

            if (required) inputElement.required = true;
            inputElement.name = `field_${index}`;

            fieldGroup.appendChild(labelElement);
            fieldGroup.appendChild(inputElement);
            form.appendChild(fieldGroup);
        });
    };

    window.saveTemplate = async function() {
        const name = document.getElementById('practice-name').value;
        const description = document.getElementById('practice-description').value;
        
        if (!name) {
            showAlert('يرجى إدخال اسم القالب', 'danger');
            return;
        }

        // جمع أنواع المشاركة المختارة مع النقاط
        const participationTypes = [];
        const typeCheckboxes = document.querySelectorAll('input[name="participation-type"]:checked');
        typeCheckboxes.forEach(checkbox => {
            const pointsInput = document.getElementById(`input-${checkbox.value.replace(/\s+/g, '-')}`);
            participationTypes.push({
                name: checkbox.value,
                points: pointsInput ? parseInt(pointsInput.value) || 0 : 0
            });
        });

        // جمع مستويات المشاركة المختارة مع النقاط
        const participationLevels = [];
        const levelCheckboxes = document.querySelectorAll('input[name="participation-level"]:checked');
        levelCheckboxes.forEach(checkbox => {
            const pointsInput = document.getElementById(`input-${checkbox.value.replace(/\s+/g, '-')}`);
            participationLevels.push({
                name: checkbox.value,
                points: pointsInput ? parseInt(pointsInput.value) || 0 : 0
            });
        });

        // جمع الحقول المخصصة
        const customFields = [];
        const fields = document.querySelectorAll('[data-index]');
        fields.forEach(f => {
            const index = f.dataset.index;
            const label = f.querySelector(`[name=label_${index}]`).value;
            const type = f.querySelector(`[name=type_${index}]`).value;
            const required = f.querySelector(`[name=required_${index}]`).checked;
            const options = f.querySelector(`[name=options_${index}]`)?.value?.split(',').map(opt => opt.trim()) || [];

            if (label) {
                customFields.push({
                    label: label,
                    type: type,
                    required: required,
                    options: options
                });
            }
        });

        try {
            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    participation_types: participationTypes,
                    participation_levels: participationLevels,
                    custom_fields: customFields
                })
            });

            const data = await response.json();

            if (data.success) {
                showAlert(data.message, 'success');
                showTemplates();
            } else {
                throw new Error(data.error || 'خطأ في حفظ القالب');
            }
        } catch (error) {
            console.error('Save template error:', error);
            showAlert(error.message, 'danger');
        }
    };
}

// Placeholder functions for other features
function showReports() {
    document.getElementById('pageContent').innerHTML = `
        <div class="py-4">
            <h1 class="h3 mb-4">التقارير</h1>
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                قسم التقارير قيد التطوير
            </div>
        </div>
    `;
    updateActiveNavigation('reports');
}

function showUsers() {
    document.getElementById('pageContent').innerHTML = `
        <div class="py-4">
            <h1 class="h3 mb-4">إدارة المستخدمين</h1>
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                قسم إدارة المستخدمين قيد التطوير
            </div>
        </div>
    `;
    updateActiveNavigation('users');
}

function updateActiveNavigation(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current page nav link
    const navLinks = {
        'dashboard': 'showDashboard()',
        'practices': 'showPractices()',
        'add-practice': 'showAddPractice()',
        'templates': 'showTemplates()',
        'reports': 'showReports()',
        'users': 'showUsers()'
    };

    const targetAction = navLinks[page];
    if (targetAction) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('onclick') === targetAction) {
                link.classList.add('active');
            }
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await login(email, password);
        });
    }

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordField = document.getElementById('password');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Check authentication on page load
    checkAuth();
});