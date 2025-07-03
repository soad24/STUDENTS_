// نظام أثر - سجل الممارسات المهنية
// Application State
let currentUser = null;
let currentPage = 'landing';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
});

// Check if user is already logged in
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showMainApp();
            showDashboard();
        } else {
            showLandingPage();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showLandingPage();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
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
            showMainApp();
            showDashboard();
            showAlert('success', data.message);
        } else {
            showAlert('danger', data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('danger', 'حدث خطأ أثناء تسجيل الدخول');
    }
}

// Logout
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        showLandingPage();
        showAlert('success', 'تم تسجيل الخروج بنجاح');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Navigation functions
function showLandingPage() {
    document.getElementById('landingPage').classList.remove('d-none');
    document.getElementById('loginPage').classList.add('d-none');
    document.getElementById('mainApp').classList.add('d-none');
    currentPage = 'landing';
}

function showLoginPage() {
    document.getElementById('landingPage').classList.add('d-none');
    document.getElementById('loginPage').classList.remove('d-none');
    document.getElementById('mainApp').classList.add('d-none');
    currentPage = 'login';
}

function showMainApp() {
    document.getElementById('landingPage').classList.add('d-none');
    document.getElementById('loginPage').classList.add('d-none');
    document.getElementById('mainApp').classList.remove('d-none');
    
    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    
    // Setup navigation based on user role
    setupNavigation();
    currentPage = 'main';
}

function setupNavigation() {
    const sidebarNav = document.getElementById('sidebarNav');
    const practicesNavItem = document.getElementById('practicesNavItem');
    const addPracticeNavItem = document.getElementById('addPracticeNavItem');
    const templatesNavItem = document.getElementById('templatesNavItem');
    
    // Clear sidebar
    sidebarNav.innerHTML = '';
    
    // Common navigation
    sidebarNav.innerHTML += `
        <li class="nav-item">
            <a class="nav-link active" href="#" onclick="showDashboard()">
                <i class="fas fa-tachometer-alt me-2"></i>
                لوحة التحكم
            </a>
        </li>
    `;
    
    if (currentUser.role === 'student') {
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'block';
        templatesNavItem.style.display = 'none';
        
        sidebarNav.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showPractices()">
                    <i class="fas fa-list me-2"></i>
                    ممارساتي المهنية
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showAddPractice()">
                    <i class="fas fa-plus me-2"></i>
                    إضافة ممارسة جديدة
                </a>
            </li>
        `;
    } else if (currentUser.role === 'admin') {
        practicesNavItem.style.display = 'none';
        addPracticeNavItem.style.display = 'none';
        templatesNavItem.style.display = 'block';
        
        sidebarNav.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showTemplates()">
                    <i class="fas fa-file-alt me-2"></i>
                    قوالب الممارسات
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showTemplateBuilder()">
                    <i class="fas fa-tools me-2"></i>
                    بناء القوالب
                </a>
            </li>
        `;
    } else {
        practicesNavItem.style.display = 'block';
        addPracticeNavItem.style.display = 'none';
        templatesNavItem.style.display = 'none';
        
        document.getElementById('practicesNavText').textContent = 'الممارسات المهنية';
        
        sidebarNav.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showPractices()">
                    <i class="fas fa-list me-2"></i>
                    الممارسات المهنية
                </a>
            </li>
        `;
    }
}

// Page functions
async function showDashboard() {
    setActiveNavLink('dashboard');
    
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        let content = '';
        
        if (currentUser.role === 'student') {
            content = `
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
                                            <button class="btn btn-warning w-100">
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
                            ${data.practices.length > 0 ? generatePracticesTable(data.practices) : generateEmptyPracticesMessage()}
                        </div>
                    </div>
                </div>
            `;
        } else if (currentUser.role === 'admin') {
            content = `
                <div class="py-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="h3 mb-0">لوحة تحكم المدير</h1>
                        <span class="badge bg-danger fs-6">مدير النظام</span>
                    </div>

                    <!-- Admin Statistics -->
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

                    <!-- Admin Actions -->
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">إدارة النظام</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showTemplates()" class="btn btn-primary w-100">
                                                <i class="fas fa-file-alt me-2"></i>
                                                قوالب الممارسات
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button onclick="showTemplateBuilder()" class="btn btn-success w-100">
                                                <i class="fas fa-tools me-2"></i>
                                                بناء القوالب
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button class="btn btn-info w-100">
                                                <i class="fas fa-users me-2"></i>
                                                إدارة المستخدمين
                                            </button>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <button class="btn btn-warning w-100">
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
            content = `
                <div class="py-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="h3 mb-0">لوحة تحكم ${roleText}</h1>
                        <span class="badge bg-info fs-6">${roleText}</span>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">الممارسات المطلوب مراجعتها</h5>
                        </div>
                        <div class="card-body">
                            ${data.practices.length > 0 ? generateReviewPracticesTable(data.practices) : '<p class="text-center text-muted">لا توجد ممارسات تحتاج مراجعة</p>'}
                        </div>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('pageContent').innerHTML = content;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('danger', 'حدث خطأ أثناء تحميل لوحة التحكم');
    }
}

async function showPractices() {
    setActiveNavLink('practices');
    
    try {
        const response = await fetch('/api/practices');
        const data = await response.json();
        
        const content = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">${currentUser.role === 'student' ? 'ممارساتي المهنية' : 'الممارسات المهنية'}</h1>
                    ${currentUser.role === 'student' ? '<button onclick="showAddPractice()" class="btn btn-success"><i class="fas fa-plus me-2"></i>إضافة ممارسة جديدة</button>' : ''}
                </div>

                <div class="card">
                    <div class="card-body">
                        ${data.practices.length > 0 ? generateFullPracticesTable(data.practices) : generateEmptyPracticesMessage()}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('pageContent').innerHTML = content;
    } catch (error) {
        console.error('Error loading practices:', error);
        showAlert('danger', 'حدث خطأ أثناء تحميل الممارسات المهنية');
    }
}

async function showAddPractice() {
    setActiveNavLink('add-practice');
    
    try {
        const response = await fetch('/api/practice-form-data');
        const data = await response.json();
        
        const content = `
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
                                                ${data.practiceTypes.map(type => `<option value="${type.id}">${type.name_ar}</option>`).join('')}
                                            </select>
                                        </div>
                                        
                                        <div class="col-md-6 mb-3">
                                            <label for="participation_type_id" class="form-label">نوع المشاركة <span class="text-danger">*</span></label>
                                            <select class="form-select" name="participation_type_id" id="participation_type_id" required>
                                                <option value="">اختر نوع المشاركة</option>
                                                ${data.participationTypes.map(type => `<option value="${type.id}">${type.name_ar}</option>`).join('')}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="participation_level_id" class="form-label">مستوى المشاركة <span class="text-danger">*</span></label>
                                        <select class="form-select" name="participation_level_id" id="participation_level_id" required>
                                            <option value="">اختر مستوى المشاركة</option>
                                            ${data.participationLevels.map(level => `<option value="${level.id}">${level.name_ar}</option>`).join('')}
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
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('pageContent').innerHTML = content;
        
        // Setup form submission
        document.getElementById('addPracticeForm').addEventListener('submit', handleAddPractice);
        
    } catch (error) {
        console.error('Error loading add practice form:', error);
        showAlert('danger', 'حدث خطأ أثناء تحميل النموذج');
    }
}

async function showTemplates() {
    setActiveNavLink('templates');
    
    try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        
        const content = `
            <div class="py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3 mb-0">قوالب الممارسات المهنية</h1>
                    <button onclick="showTemplateBuilder()" class="btn btn-success">
                        <i class="fas fa-plus me-2"></i>
                        إنشاء قالب جديد
                    </button>
                </div>

                <div class="card">
                    <div class="card-body">
                        ${data.templates.length > 0 ? generateTemplatesTable(data.templates) : generateEmptyTemplatesMessage()}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('pageContent').innerHTML = content;
    } catch (error) {
        console.error('Error loading templates:', error);
        showAlert('danger', 'حدث خطأ أثناء تحميل القوالب');
    }
}

function showTemplateBuilder() {
    setActiveNavLink('template-builder');
    
    const content = `
        <div class="py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 mb-0">بناء قالب ممارسة مهنية جديد</h1>
                <button onclick="showTemplates()" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-right me-2"></i>
                    العودة للقوالب
                </button>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <!-- Template Builder Integration -->
                            <div class="row">
                                <!-- قسم البناء -->
                                <div class="col-lg-6">
                                    <div class="border rounded p-4 mb-4" style="height: 70vh; overflow-y: auto;">
                                        <h5 class="text-center mb-4">
                                            <i class="fas fa-tools me-2"></i>بناء النموذج
                                        </h5>

                                        <form id="template-builder-form">
                                            <!-- اسم القالب -->
                                            <div class="mb-3">
                                                <label class="form-label">اسم قالب الممارسة</label>
                                                <input type="text" id="template-name" name="name" class="form-control" placeholder="مثال: مبادرة تطوعية" required />
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">وصف القالب</label>
                                                <textarea id="template-description" name="description" class="form-control" rows="3" placeholder="وصف مختصر للقالب"></textarea>
                                            </div>

                                            <!-- اختيار نوع ومستوى المشاركة -->
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label class="form-label">أنواع المشاركة</label>
                                                    <div id="participation-type-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #dee2e6; padding: 10px; border-radius: 5px;">
                                                        ${generateParticipationTypeCheckboxes()}
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">مستويات المشاركة</label>
                                                    <div id="participation-level-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #dee2e6; padding: 10px; border-radius: 5px;">
                                                        ${generateParticipationLevelCheckboxes()}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- الحقول الديناميكية -->
                                            <div id="field-list" class="mt-4"></div>

                                            <div class="text-center mt-4">
                                                <button type="button" onclick="addTemplateField()" class="btn btn-success me-2">
                                                    <i class="fas fa-plus"></i> إضافة حقل
                                                </button>
                                                <button type="button" onclick="generateTemplateForm()" class="btn btn-primary">
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
                                                <span id="template-form-title">النموذج الناتج</span>
                                            </h5>
                                            <button onclick="clearTemplateForm()" class="btn btn-sm btn-outline-danger">
                                                <i class="fas fa-trash-alt"></i> مسح
                                            </button>
                                        </div>
                                        <form id="template-final-form"></form>
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
    
    document.getElementById('pageContent').innerHTML = content;
    
    // Initialize template builder
    initializeTemplateBuilder();
}

// Template builder functions
let templateFieldIndex = 0;

function initializeTemplateBuilder() {
    templateFieldIndex = 0;
}

function generateParticipationTypeCheckboxes() {
    const types = [
        'حضوري او افتراضي', 'حضور', 'تنظيم', 'تقديم', 'عضو في مجلس الادارة', 'عضو',
        'المستوى الأساسي', 'المستوى المتوسط', 'المستوى المتقدم', 'المستوى المتخصص / الصناعي',
        'مجال التخصص الاكاديمي', 'غير مجال التخصص الاكاديمي', 'مؤسسات العمل التطوعي المعتمدة',
        'نشر ورقة علمية في مجلة محكمة', 'الحصول على براءة الاختراع'
    ];
    
    return types.map(type => `
        <div class="form-check">
            <input type="checkbox" name="participation-type" value="${type}" class="form-check-input" onchange="toggleTemplateNumberInput(this)">
            <label class="form-check-label">${type}</label>
        </div>
    `).join('');
}

function generateParticipationLevelCheckboxes() {
    const levels = [
        'محليا او دوليا', 'خارج الفرع فقط', 'الفرع', 'الجامعة', 'محلي', 'دولي'
    ];
    
    return levels.map(level => `
        <div class="form-check">
            <input type="checkbox" name="participation-level" value="${level}" class="form-check-input" onchange="toggleTemplateNumberInput(this)">
            <label class="form-check-label">${level}</label>
        </div>
    `).join('');
}

function toggleTemplateNumberInput(checkbox) {
    const container = checkbox.closest('.form-check');
    const inputId = `template-input-${checkbox.value.replace(/\s+/g, '-')}`;
    
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
}

function addTemplateField() {
    const container = document.getElementById('field-list');
    const index = templateFieldIndex++;

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
                    <select name="type_${index}" class="form-select form-select-sm" onchange="toggleTemplateOptions(this, ${index})">
                        <option value="text">نص</option>
                        <option value="number">رقم</option>
                        <option value="date">تاريخ</option>
                        <option value="time">وقت</option>
                        <option value="file">ملف</option>
                        <option value="select">قائمة</option>
                    </select>
                </div>
            </div>
            <div id="template-options_${index}" class="d-none">
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
}

function toggleTemplateOptions(selectElement, index) {
    const optionsDiv = document.getElementById(`template-options_${index}`);
    if (selectElement.value === 'select') {
        optionsDiv.classList.remove('d-none');
    } else {
        optionsDiv.classList.add('d-none');
    }
}

function clearTemplateForm() {
    document.getElementById('template-final-form').innerHTML = '';
    document.getElementById('template-form-title').textContent = 'النموذج الناتج';
}

function generateTemplateForm() {
    const form = document.getElementById('template-final-form');
    const formTitle = document.getElementById('template-form-title');
    form.innerHTML = '';

    const name = document.getElementById('template-name').value || 'نموذج بدون اسم';
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
}

async function saveTemplate() {
    const name = document.getElementById('template-name').value;
    const description = document.getElementById('template-description').value;
    
    if (!name) {
        showAlert('warning', 'يرجى إدخال اسم القالب');
        return;
    }

    // جمع أنواع المشاركة المختارة مع النقاط
    const participationTypes = [];
    const typeCheckboxes = document.querySelectorAll('input[name="participation-type"]:checked');
    typeCheckboxes.forEach(checkbox => {
        const pointsInput = document.getElementById(`template-input-${checkbox.value.replace(/\s+/g, '-')}`);
        participationTypes.push({
            name: checkbox.value,
            points: pointsInput ? parseInt(pointsInput.value) || 0 : 0
        });
    });

    // جمع مستويات المشاركة المختارة مع النقاط
    const participationLevels = [];
    const levelCheckboxes = document.querySelectorAll('input[name="participation-level"]:checked');
    levelCheckboxes.forEach(checkbox => {
        const pointsInput = document.getElementById(`template-input-${checkbox.value.replace(/\s+/g, '-')}`);
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
            showAlert('success', data.message);
            showTemplates();
        } else {
            showAlert('danger', data.error);
        }
    } catch (error) {
        console.error('Error saving template:', error);
        showAlert('danger', 'حدث خطأ أثناء حفظ القالب');
    }
}

// Form submission handlers
async function handleAddPractice(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/api/practices', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('success', data.message);
            showPractices();
        } else {
            showAlert('danger', data.error);
        }
    } catch (error) {
        console.error('Error adding practice:', error);
        showAlert('danger', 'حدث خطأ أثناء حفظ الممارسة المهنية');
    }
}

// Helper functions
function setActiveNavLink(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page nav link
    const navLinks = {
        'dashboard': 'الرئيسية',
        'practices': currentUser.role === 'student' ? 'ممارساتي المهنية' : 'الممارسات المهنية',
        'add-practice': 'إضافة ممارسة',
        'templates': 'قوالب الممارسات',
        'template-builder': 'بناء القوالب'
    };
    
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.textContent.trim().includes(navLinks[page])) {
            link.classList.add('active');
        }
    });
}

function generatePracticesTable(practices) {
    if (practices.length === 0) {
        return generateEmptyPracticesMessage();
    }
    
    return `
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
                    ${practices.map(practice => `
                        <tr>
                            <td><strong>${practice.title}</strong></td>
                            <td>${practice.practice_type_name}</td>
                            <td>${practice.organization}</td>
                            <td><span class="badge ${getStatusBadgeClass(practice.status)}">${getStatusText(practice.status)}</span></td>
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
    `;
}

function generateFullPracticesTable(practices) {
    if (practices.length === 0) {
        return generateEmptyPracticesMessage();
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
                                <div><strong>${practice.title}</strong></div>
                                ${practice.description ? `<small class="text-muted">${practice.description.substring(0, 50)}...</small>` : ''}
                            </td>
                            <td>${practice.practice_type_name}</td>
                            <td>${practice.participation_type_name}</td>
                            <td>${practice.participation_level_name}</td>
                            <td>${practice.organization}</td>
                            <td>
                                <small>
                                    من: ${formatDate(practice.start_date)}<br>
                                    إلى: ${formatDate(practice.end_date)}
                                </small>
                            </td>
                            <td><span class="badge ${getStatusBadgeClass(practice.status)}">${getStatusText(practice.status)}</span></td>
                            <td><strong class="text-primary">${practice.calculated_points}</strong></td>
                            <td>
                                <div class="btn-group btn-group-sm" role="group">
                                    <button onclick="viewPractice(${practice.id})" class="btn btn-outline-primary" title="عرض">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${generateActionButtons(practice)}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateReviewPracticesTable(practices) {
    return `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>الطالب</th>
                        <th>العنوان</th>
                        <th>نوع الممارسة</th>
                        <th>المؤسسة</th>
                        <th>تاريخ الإرسال</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${practices.map(practice => `
                        <tr>
                            <td><strong>${practice.student_name}</strong></td>
                            <td>${practice.title}</td>
                            <td>${practice.practice_type_name}</td>
                            <td>${practice.organization}</td>
                            <td>${formatDate(practice.created_at)}</td>
                            <td>
                                <button onclick="viewPractice(${practice.id})" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-eye"></i> عرض
                                </button>
                                <button onclick="reviewPractice(${practice.id})" class="btn btn-sm btn-outline-success">
                                    <i class="fas fa-check"></i> مراجعة
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateTemplatesTable(templates) {
    return `
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
                    ${templates.map(template => `
                        <tr>
                            <td><strong>${template.name}</strong></td>
                            <td>${template.description ? template.description.substring(0, 50) + '...' : '-'}</td>
                            <td><span class="badge bg-primary">${template.participation_types.length}</span></td>
                            <td><span class="badge bg-info">${template.participation_levels.length}</span></td>
                            <td><span class="badge bg-secondary">${template.custom_fields.length}</span></td>
                            <td>
                                ${template.is_active ? 
                                    '<span class="badge bg-success">نشط</span>' : 
                                    '<span class="badge bg-danger">غير نشط</span>'
                                }
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
                                    <button onclick="toggleTemplate(${template.id})" class="btn btn-outline-${template.is_active ? 'warning' : 'success'}" title="${template.is_active ? 'إلغاء التفعيل' : 'تفعيل'}">
                                        <i class="fas fa-${template.is_active ? 'pause' : 'play'}"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateActionButtons(practice) {
    let buttons = '';
    
    if (currentUser.role === 'student' && practice.status === 'pending') {
        buttons += `
            <button onclick="editPractice(${practice.id})" class="btn btn-outline-warning" title="تعديل">
                <i class="fas fa-edit"></i>
            </button>
        `;
    }
    
    if (currentUser.role === 'reviewer' && practice.status === 'pending') {
        buttons += `
            <button onclick="reviewPractice(${practice.id})" class="btn btn-outline-info" title="مراجعة">
                <i class="fas fa-check"></i>
            </button>
        `;
    }
    
    if (currentUser.role === 'approver' && practice.status === 'under_review') {
        buttons += `
            <button onclick="approvePractice(${practice.id})" class="btn btn-outline-success" title="اعتماد">
                <i class="fas fa-stamp"></i>
            </button>
        `;
    }
    
    return buttons;
}

function generateEmptyPracticesMessage() {
    return `
        <div class="text-center py-5">
            <i class="fas fa-clipboard-list text-muted" style="font-size: 4rem;"></i>
            <h4 class="text-muted mt-3">لا توجد ممارسات مهنية</h4>
            <p class="text-muted">${currentUser.role === 'student' ? 'ابدأ بإضافة أول ممارسة مهنية لك' : 'لا توجد ممارسات مهنية للمراجعة'}</p>
            ${currentUser.role === 'student' ? '<button onclick="showAddPractice()" class="btn btn-primary"><i class="fas fa-plus me-2"></i>إضافة ممارسة جديدة</button>' : ''}
        </div>
    `;
}

function generateEmptyTemplatesMessage() {
    return `
        <div class="text-center py-5">
            <i class="fas fa-file-alt text-muted" style="font-size: 4rem;"></i>
            <h4 class="text-muted mt-3">لا توجد قوالب</h4>
            <p class="text-muted">لم يتم إنشاء أي قوالب للممارسات المهنية بعد</p>
            <button onclick="showTemplateBuilder()" class="btn btn-primary">
                <i class="fas fa-plus me-2"></i>
                إنشاء قالب جديد
            </button>
        </div>
    `;
}

function getStatusBadgeClass(status) {
    const classes = {
        'pending': 'bg-warning',
        'under_review': 'bg-info',
        'approved': 'bg-success',
        'rejected': 'bg-danger',
        'certified': 'bg-primary'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusText(status) {
    const texts = {
        'pending': 'في الانتظار',
        'under_review': 'قيد المراجعة',
        'approved': 'معتمد',
        'rejected': 'مرفوض',
        'certified': 'مصدق'
    };
    return texts[status] || 'غير محدد';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('main');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Placeholder functions for future implementation
function viewPractice(id) {
    showAlert('info', `عرض الممارسة المهنية رقم ${id}`);
}

function editPractice(id) {
    showAlert('info', `تعديل الممارسة المهنية رقم ${id}`);
}

function reviewPractice(id) {
    showAlert('info', `مراجعة الممارسة المهنية رقم ${id}`);
}

function approvePractice(id) {
    showAlert('info', `اعتماد الممارسة المهنية رقم ${id}`);
}

function viewTemplate(id) {
    showAlert('info', `عرض القالب رقم ${id}`);
}

function editTemplate(id) {
    showAlert('info', `تعديل القالب رقم ${id}`);
}

function toggleTemplate(id) {
    showAlert('info', `تغيير حالة القالب رقم ${id}`);
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// Global functions for HTML onclick events
window.showLandingPage = showLandingPage;
window.showLoginPage = showLoginPage;
window.showMainApp = showMainApp;
window.showDashboard = showDashboard;
window.showPractices = showPractices;
window.showAddPractice = showAddPractice;
window.showTemplates = showTemplates;
window.showTemplateBuilder = showTemplateBuilder;
window.logout = logout;
window.scrollToFeatures = scrollToFeatures;
window.viewPractice = viewPractice;
window.editPractice = editPractice;
window.reviewPractice = reviewPractice;
window.approvePractice = approvePractice;
window.viewTemplate = viewTemplate;
window.editTemplate = editTemplate;
window.toggleTemplate = toggleTemplate;
window.toggleTemplateNumberInput = toggleTemplateNumberInput;
window.addTemplateField = addTemplateField;
window.toggleTemplateOptions = toggleTemplateOptions;
window.clearTemplateForm = clearTemplateForm;
window.generateTemplateForm = generateTemplateForm;
window.saveTemplate = saveTemplate;