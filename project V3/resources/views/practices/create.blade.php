@extends('layouts.app')

@section('title', 'إضافة ممارسة مهنية جديدة - نظام أثر')

@section('content')
<div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">إضافة ممارسة مهنية جديدة</h1>
        <a href="{{ route('practices.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-right me-2"></i>
            العودة للقائمة
        </a>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">معلومات الممارسة المهنية</h5>
                </div>
                <div class="card-body">
                    <form action="{{ route('practices.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="practice_type_id" class="form-label">نوع الممارسة <span class="text-danger">*</span></label>
                                <select class="form-select @error('practice_type_id') is-invalid @enderror" name="practice_type_id" id="practice_type_id" required>
                                    <option value="">اختر نوع الممارسة</option>
                                    @foreach($practiceTypes as $type)
                                        <option value="{{ $type->id }}" {{ old('practice_type_id') == $type->id ? 'selected' : '' }}>
                                            {{ $type->name_ar }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('practice_type_id')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label for="participation_type_id" class="form-label">نوع المشاركة <span class="text-danger">*</span></label>
                                <select class="form-select @error('participation_type_id') is-invalid @enderror" name="participation_type_id" id="participation_type_id" required>
                                    <option value="">اختر نوع المشاركة</option>
                                    @foreach($participationTypes as $type)
                                        <option value="{{ $type->id }}" {{ old('participation_type_id') == $type->id ? 'selected' : '' }}>
                                            {{ $type->name_ar }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('participation_type_id')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="participation_level_id" class="form-label">مستوى المشاركة <span class="text-danger">*</span></label>
                            <select class="form-select @error('participation_level_id') is-invalid @enderror" name="participation_level_id" id="participation_level_id" required>
                                <option value="">اختر مستوى المشاركة</option>
                                @foreach($participationLevels as $level)
                                    <option value="{{ $level->id }}" {{ old('participation_level_id') == $level->id ? 'selected' : '' }}>
                                        {{ $level->name_ar }}
                                    </option>
                                @endforeach
                            </select>
                            @error('participation_level_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="title" class="form-label">عنوان الممارسة <span class="text-danger">*</span></label>
                            <input type="text" class="form-control @error('title') is-invalid @enderror" 
                                   name="title" id="title" value="{{ old('title') }}" required>
                            @error('title')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="organization" class="form-label">المؤسسة/الجهة المنظمة <span class="text-danger">*</span></label>
                            <input type="text" class="form-control @error('organization') is-invalid @enderror" 
                                   name="organization" id="organization" value="{{ old('organization') }}" required>
                            @error('organization')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">وصف الممارسة</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" 
                                      name="description" id="description" rows="3">{{ old('description') }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="start_date" class="form-label">تاريخ البداية <span class="text-danger">*</span></label>
                                <input type="date" class="form-control @error('start_date') is-invalid @enderror" 
                                       name="start_date" id="start_date" value="{{ old('start_date') }}" required>
                                @error('start_date')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label for="end_date" class="form-label">تاريخ النهاية <span class="text-danger">*</span></label>
                                <input type="date" class="form-control @error('end_date') is-invalid @enderror" 
                                       name="end_date" id="end_date" value="{{ old('end_date') }}" required>
                                @error('end_date')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="duration_hours" class="form-label">عدد الساعات (اختياري)</label>
                            <input type="number" class="form-control @error('duration_hours') is-invalid @enderror" 
                                   name="duration_hours" id="duration_hours" value="{{ old('duration_hours') }}" min="1">
                            @error('duration_hours')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="attachments" class="form-label">المرفقات</label>
                            <input type="file" class="form-control @error('attachments') is-invalid @enderror" 
                                   name="attachments[]" id="attachments" multiple accept=".pdf,.jpg,.jpeg,.png">
                            <div class="form-text">يمكنك رفع ملفات PDF أو صور (الحد الأقصى 2 ميجابايت لكل ملف)</div>
                            @error('attachments')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <a href="{{ route('practices.index') }}" class="btn btn-secondary">إلغاء</a>
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
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const practiceTypeSelect = document.getElementById('practice_type_id');
    const participationTypeSelect = document.getElementById('participation_type_id');
    const participationLevelSelect = document.getElementById('participation_level_id');
    const pointsPreview = document.getElementById('pointsPreview');
    const previewPoints = document.getElementById('previewPoints');
    const previewPracticeType = document.getElementById('previewPracticeType');
    const previewParticipationType = document.getElementById('previewParticipationType');
    const previewParticipationLevel = document.getElementById('previewParticipationLevel');

    // Practice types data (base points)
    const practiceTypes = @json($practiceTypes->keyBy('id'));
    const participationTypes = @json($participationTypes->keyBy('id'));
    const participationLevels = @json($participationLevels->keyBy('id'));

    function updatePointsPreview() {
        const practiceTypeId = practiceTypeSelect.value;
        const participationTypeId = participationTypeSelect.value;
        const participationLevelId = participationLevelSelect.value;

        if (practiceTypeId && participationTypeId && participationLevelId) {
            const practiceType = practiceTypes[practiceTypeId];
            const participationType = participationTypes[participationTypeId];
            const participationLevel = participationLevels[participationLevelId];

            const calculatedPoints = practiceType.base_points * participationType.multiplier * participationLevel.multiplier;

            previewPoints.textContent = calculatedPoints;
            previewPracticeType.textContent = practiceType.name_ar;
            previewParticipationType.textContent = participationType.name_ar;
            previewParticipationLevel.textContent = participationLevel.name_ar;

            pointsPreview.style.display = 'block';
        } else {
            pointsPreview.style.display = 'none';
        }
    }

    practiceTypeSelect.addEventListener('change', updatePointsPreview);
    participationTypeSelect.addEventListener('change', updatePointsPreview);
    participationLevelSelect.addEventListener('change', updatePointsPreview);

    // Initial update
    updatePointsPreview();
});
</script>
@endpush