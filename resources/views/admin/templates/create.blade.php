@extends('layouts.app')

@section('title', 'إنشاء قالب ممارسة مهنية جديد - نظام أثر')

@section('content')
<div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">إنشاء قالب ممارسة مهنية جديد</h1>
        <a href="{{ route('admin.templates.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-right me-2"></i>
            العودة للقائمة
        </a>
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
                                    @csrf
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
@endsection

@push('scripts')
<script>
let fieldIndex = 0;

function toggleNumberInput(checkbox) {
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
}

function addField() {
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
}

function toggleOptions(selectElement, index) {
    const optionsDiv = document.getElementById(`options_${index}`);
    if (selectElement.value === 'select') {
        optionsDiv.classList.remove('d-none');
    } else {
        optionsDiv.classList.add('d-none');
    }
}

function clearForm() {
    document.getElementById('final-form').innerHTML = '';
    document.getElementById('form-title').textContent = 'النموذج الناتج';
    document.getElementById('calculation-result').classList.add('d-none');
}

function generateForm() {
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
}

function saveTemplate() {
    const name = document.getElementById('practice-name').value;
    const description = document.getElementById('practice-description').value;
    
    if (!name) {
        alert('يرجى إدخال اسم القالب');
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

    // إرسال البيانات
    const formData = new FormData();
    formData.append('_token', document.querySelector('input[name="_token"]').value);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('participation_types', JSON.stringify(participationTypes));
    formData.append('participation_levels', JSON.stringify(participationLevels));
    formData.append('custom_fields', JSON.stringify(customFields));

    fetch('{{ route("admin.templates.store") }}', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '{{ route("admin.templates.index") }}';
        } else {
            alert('حدث خطأ أثناء حفظ القالب');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء حفظ القالب');
    });
}
</script>
@endpush