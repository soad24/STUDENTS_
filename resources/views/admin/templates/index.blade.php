@extends('layouts.app')

@section('title', 'قوالب الممارسات المهنية - نظام أثر')

@section('content')
<div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">قوالب الممارسات المهنية</h1>
        <a href="{{ route('admin.templates.create') }}" class="btn btn-success">
            <i class="fas fa-plus me-2"></i>
            إنشاء قالب جديد
        </a>
    </div>

    <div class="card">
        <div class="card-body">
            @if($templates->count() > 0)
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
                            @foreach($templates as $template)
                                <tr>
                                    <td>
                                        <strong>{{ $template->name }}</strong>
                                    </td>
                                    <td>
                                        {{ Str::limit($template->description, 50) }}
                                    </td>
                                    <td>
                                        <span class="badge bg-primary">{{ count($template->participation_types) }}</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-info">{{ count($template->participation_levels) }}</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-secondary">{{ count($template->custom_fields) }}</span>
                                    </td>
                                    <td>
                                        @if($template->is_active)
                                            <span class="badge bg-success">نشط</span>
                                        @else
                                            <span class="badge bg-danger">غير نشط</span>
                                        @endif
                                    </td>
                                    <td>{{ $template->creator->name }}</td>
                                    <td>{{ $template->created_at->format('Y/m/d') }}</td>
                                    <td>
                                        <div class="btn-group btn-group-sm" role="group">
                                            <a href="{{ route('admin.templates.show', $template) }}" class="btn btn-outline-primary" title="عرض">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="{{ route('admin.templates.edit', $template) }}" class="btn btn-outline-warning" title="تعديل">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form action="{{ route('admin.templates.toggle', $template) }}" method="POST" class="d-inline">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit" class="btn btn-outline-{{ $template->is_active ? 'warning' : 'success' }}" title="{{ $template->is_active ? 'إلغاء التفعيل' : 'تفعيل' }}">
                                                    <i class="fas fa-{{ $template->is_active ? 'pause' : 'play' }}"></i>
                                                </button>
                                            </form>
                                            <form action="{{ route('admin.templates.destroy', $template) }}" method="POST" class="d-inline" onsubmit="return confirm('هل أنت متأكد من حذف هذا القالب؟')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-outline-danger" title="حذف">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-center mt-4">
                    {{ $templates->links() }}
                </div>
            @else
                <div class="text-center py-5">
                    <i class="fas fa-file-alt text-muted" style="font-size: 4rem;"></i>
                    <h4 class="text-muted mt-3">لا توجد قوالب</h4>
                    <p class="text-muted">لم يتم إنشاء أي قوالب للممارسات المهنية بعد</p>
                    <a href="{{ route('admin.templates.create') }}" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>
                        إنشاء قالب جديد
                    </a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection