@extends('layouts.app')

@section('title', 'عرض قالب الممارسة المهنية - نظام أثر')

@section('content')
<div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">{{ $template->name }}</h1>
        <div>
            <a href="{{ route('admin.templates.edit', $template) }}" class="btn btn-warning me-2">
                <i class="fas fa-edit me-2"></i>
                تعديل
            </a>
            <a href="{{ route('admin.templates.index') }}" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-right me-2"></i>
                العودة للقائمة
            </a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">تفاصيل القالب</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-sm-3"><strong>اسم القالب:</strong></div>
                        <div class="col-sm-9">{{ $template->name }}</div>
                    </div>
                    
                    @if($template->description)
                    <div class="row mb-3">
                        <div class="col-sm-3"><strong>الوصف:</strong></div>
                        <div class="col-sm-9">{{ $template->description }}</div>
                    </div>
                    @endif

                    <div class="row mb-3">
                        <div class="col-sm-3"><strong>الحالة:</strong></div>
                        <div class="col-sm-9">
                            @if($template->is_active)
                                <span class="badge bg-success">نشط</span>
                            @else
                                <span class="badge bg-danger">غير نشط</span>
                            @endif
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-sm-3"><strong>منشئ القالب:</strong></div>
                        <div class="col-sm-9">{{ $template->creator->name }}</div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-sm-3"><strong>تاريخ الإنشاء:</strong></div>
                        <div class="col-sm-9">{{ $template->created_at->format('Y/m/d H:i') }}</div>
                    </div>
                </div>
            </div>

            <!-- أنواع المشاركة -->
            @if(!empty($template->participation_types))
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">أنواع المشاركة</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        @foreach($template->participation_types as $type)
                        <div class="col-md-6 mb-2">
                            <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                                <span>{{ $type['name'] }}</span>
                                <span class="badge bg-primary">{{ $type['points'] ?? 0 }} نقطة</span>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
            @endif

            <!-- مستويات المشاركة -->
            @if(!empty($template->participation_levels))
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">مستويات المشاركة</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        @foreach($template->participation_levels as $level)
                        <div class="col-md-6 mb-2">
                            <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                                <span>{{ $level['name'] }}</span>
                                <span class="badge bg-info">{{ $level['points'] ?? 0 }} نقطة</span>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
            @endif

            <!-- الحقول المخصصة -->
            @if(!empty($template->custom_fields))
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">الحقول المخصصة</h5>
                </div>
                <div class="card-body">
                    @foreach($template->custom_fields as $field)
                    <div class="border rounded p-3 mb-3">
                        <div class="row">
                            <div class="col-md-4">
                                <strong>{{ $field['label'] }}</strong>
                                @if($field['required'])
                                    <span class="text-danger">*</span>
                                @endif
                            </div>
                            <div class="col-md-3">
                                <span class="badge bg-secondary">{{ $field['type'] }}</span>
                            </div>
                            <div class="col-md-5">
                                @if($field['type'] === 'select' && !empty($field['options']))
                                    <small class="text-muted">
                                        الخيارات: {{ implode(', ', $field['options']) }}
                                    </small>
                                @endif
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">إحصائيات القالب</h5>
                </div>
                <div class="card-body">
                    <div class="text-center mb-3">
                        <div class="h4 text-primary">{{ $template->professionalPractices->count() }}</div>
                        <small class="text-muted">ممارسة مهنية تستخدم هذا القالب</small>
                    </div>
                    
                    <div class="text-center mb-3">
                        <div class="h4 text-info">{{ count($template->participation_types) }}</div>
                        <small class="text-muted">نوع مشاركة</small>
                    </div>
                    
                    <div class="text-center mb-3">
                        <div class="h4 text-success">{{ count($template->participation_levels) }}</div>
                        <small class="text-muted">مستوى مشاركة</small>
                    </div>
                    
                    <div class="text-center">
                        <div class="h4 text-warning">{{ count($template->custom_fields) }}</div>
                        <small class="text-muted">حقل مخصص</small>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">إجراءات</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <a href="{{ route('admin.templates.edit', $template) }}" class="btn btn-warning">
                            <i class="fas fa-edit me-2"></i>
                            تعديل القالب
                        </a>
                        
                        <form action="{{ route('admin.templates.toggle', $template) }}" method="POST">
                            @csrf
                            @method('PATCH')
                            <button type="submit" class="btn btn-{{ $template->is_active ? 'outline-warning' : 'outline-success' }} w-100">
                                <i class="fas fa-{{ $template->is_active ? 'pause' : 'play' }} me-2"></i>
                                {{ $template->is_active ? 'إلغاء التفعيل' : 'تفعيل' }}
                            </button>
                        </form>
                        
                        <form action="{{ route('admin.templates.destroy', $template) }}" method="POST" 
                              onsubmit="return confirm('هل أنت متأكد من حذف هذا القالب؟')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline-danger w-100">
                                <i class="fas fa-trash me-2"></i>
                                حذف القالب
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection