@extends('layouts.app')

@section('title', 'ممارساتي المهنية - نظام أثر')

@section('content')
<div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">ممارساتي المهنية</h1>
        @if(auth()->user()->isStudent())
            <a href="{{ route('practices.create') }}" class="btn btn-success">
                <i class="fas fa-plus me-2"></i>
                إضافة ممارسة جديدة
            </a>
        @endif
    </div>

    <!-- Filters -->
    <div class="card mb-4">
        <div class="card-body">
            <form method="GET" class="row g-3">
                <div class="col-md-3">
                    <label class="form-label">البحث</label>
                    <input type="text" class="form-control" name="search" value="{{ request('search') }}" placeholder="ابحث في العنوان أو المؤسسة...">
                </div>
                <div class="col-md-2">
                    <label class="form-label">الحالة</label>
                    <select class="form-select" name="status">
                        <option value="">جميع الحالات</option>
                        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>في الانتظار</option>
                        <option value="under_review" {{ request('status') === 'under_review' ? 'selected' : '' }}>قيد المراجعة</option>
                        <option value="approved" {{ request('status') === 'approved' ? 'selected' : '' }}>معتمد</option>
                        <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>مرفوض</option>
                        <option value="certified" {{ request('status') === 'certified' ? 'selected' : '' }}>مصدق</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">من تاريخ</label>
                    <input type="date" class="form-control" name="from_date" value="{{ request('from_date') }}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">إلى تاريخ</label>
                    <input type="date" class="form-control" name="to_date" value="{{ request('to_date') }}">
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Practices List -->
    <div class="card">
        <div class="card-body">
            @if($practices->count() > 0)
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
                            @foreach($practices as $practice)
                                <tr>
                                    <td>
                                        <div>
                                            <strong>{{ $practice->title }}</strong>
                                            @if(!$practice->isWithinSubmissionDeadline())
                                                <span class="badge bg-danger ms-2">متأخر</span>
                                            @endif
                                        </div>
                                        @if($practice->description)
                                            <small class="text-muted">{{ Str::limit($practice->description, 50) }}</small>
                                        @endif
                                    </td>
                                    <td>{{ $practice->practiceType->name_ar }}</td>
                                    <td>{{ $practice->participationType->name_ar }}</td>
                                    <td>{{ $practice->participationLevel->name_ar }}</td>
                                    <td>{{ $practice->organization }}</td>
                                    <td>
                                        <small>
                                            من: {{ $practice->start_date->format('Y/m/d') }}<br>
                                            إلى: {{ $practice->end_date->format('Y/m/d') }}
                                        </small>
                                    </td>
                                    <td>
                                        <span class="badge {{ $practice->getStatusBadgeClass() }}">
                                            {{ $practice->getStatusText() }}
                                        </span>
                                    </td>
                                    <td>
                                        <strong class="text-primary">{{ $practice->calculated_points }}</strong>
                                    </td>
                                    <td>
                                        <div class="btn-group btn-group-sm" role="group">
                                            <a href="{{ route('practices.show', $practice) }}" class="btn btn-outline-primary" title="عرض">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            @if($practice->status === 'pending' && auth()->user()->isStudent())
                                                <a href="{{ route('practices.edit', $practice) }}" class="btn btn-outline-warning" title="تعديل">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                            @endif
                                            @if(auth()->user()->isReviewer() && $practice->status === 'pending')
                                                <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#reviewModal{{ $practice->id }}" title="مراجعة">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            @endif
                                            @if(auth()->user()->isApprover() && $practice->status === 'under_review')
                                                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#approveModal{{ $practice->id }}" title="اعتماد">
                                                    <i class="fas fa-stamp"></i>
                                                </button>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-center mt-4">
                    {{ $practices->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-5">
                    <i class="fas fa-clipboard-list text-muted" style="font-size: 4rem;"></i>
                    <h4 class="text-muted mt-3">لا توجد ممارسات مهنية</h4>
                    <p class="text-muted">لم يتم العثور على ممارسات مهنية تطابق معايير البحث</p>
                    @if(auth()->user()->isStudent())
                        <a href="{{ route('practices.create') }}" class="btn btn-primary">
                            <i class="fas fa-plus me-2"></i>
                            إضافة ممارسة جديدة
                        </a>
                    @endif
                </div>
            @endif
        </div>
    </div>
</div>

<!-- Review Modals -->
@foreach($practices as $practice)
    @if(auth()->user()->isReviewer() && $practice->status === 'pending')
        <div class="modal fade" id="reviewModal{{ $practice->id }}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">مراجعة الممارسة المهنية</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form action="{{ route('practices.review', $practice) }}" method="POST">
                        @csrf
                        <div class="modal-body">
                            <h6>{{ $practice->title }}</h6>
                            <p class="text-muted">{{ $practice->organization }}</p>
                            
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
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                            <button type="submit" class="btn btn-primary">حفظ المراجعة</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif
@endforeach
@endsection