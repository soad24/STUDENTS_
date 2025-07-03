@extends('layouts.app')

@section('title', 'لوحة تحكم الطالب - نظام أثر')

@section('content')
<div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">مرحباً {{ auth()->user()->name }}</h1>
        <span class="badge bg-primary fs-6">{{ auth()->user()->student_id }}</span>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card stats-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <div class="text-white-75 small">إجمالي النقاط</div>
                            <div class="text-white h4">{{ number_format($totalPoints) }}</div>
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
                            <div class="text-white h4">{{ $approvedCount }}</div>
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
                            <div class="text-white h4">{{ $pendingCount }}</div>
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
                            <div class="text-white h4">{{ $practices->count() }}</div>
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
                            <a href="{{ route('practices.create') }}" class="btn btn-success w-100">
                                <i class="fas fa-plus me-2"></i>
                                إضافة ممارسة جديدة
                            </a>
                        </div>
                        <div class="col-md-3 mb-3">
                            <a href="{{ route('practices.index') }}" class="btn btn-primary w-100">
                                <i class="fas fa-list me-2"></i>
                                عرض جميع الممارسات
                            </a>
                        </div>
                        <div class="col-md-3 mb-3">
                            <a href="#" class="btn btn-info w-100">
                                <i class="fas fa-download me-2"></i>
                                تحميل السجل
                            </a>
                        </div>
                        <div class="col-md-3 mb-3">
                            <a href="#" class="btn btn-warning w-100">
                                <i class="fas fa-chart-bar me-2"></i>
                                التقارير
                            </a>
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
            <a href="{{ route('practices.index') }}" class="btn btn-sm btn-outline-primary">عرض الكل</a>
        </div>
        <div class="card-body">
            @if($practices->count() > 0)
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
                            @foreach($practices->take(5) as $practice)
                                <tr>
                                    <td>
                                        <strong>{{ $practice->title }}</strong>
                                        @if(!$practice->isWithinSubmissionDeadline())
                                            <span class="badge bg-danger ms-2">متأخر</span>
                                        @endif
                                    </td>
                                    <td>{{ $practice->practiceType->name_ar }}</td>
                                    <td>{{ $practice->organization }}</td>
                                    <td>
                                        <span class="badge {{ $practice->getStatusBadgeClass() }}">
                                            {{ $practice->getStatusText() }}
                                        </span>
                                    </td>
                                    <td>
                                        <strong class="text-primary">{{ $practice->calculated_points }}</strong>
                                    </td>
                                    <td>{{ $practice->created_at->format('Y/m/d') }}</td>
                                    <td>
                                        <a href="{{ route('practices.show', $practice) }}" class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        @if($practice->status === 'pending')
                                            <a href="{{ route('practices.edit', $practice) }}" class="btn btn-sm btn-outline-warning">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-5">
                    <i class="fas fa-clipboard-list text-muted" style="font-size: 4rem;"></i>
                    <h4 class="text-muted mt-3">لا توجد ممارسات مهنية</h4>
                    <p class="text-muted">ابدأ بإضافة أول ممارسة مهنية لك</p>
                    <a href="{{ route('practices.create') }}" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>
                        إضافة ممارسة جديدة
                    </a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .stats-card {
        transition: transform 0.3s ease;
    }
    
    .stats-card:hover {
        transform: translateY(-5px);
    }
    
    .table th {
        font-weight: 600;
        color: #495057;
        border-top: none;
    }
    
    .badge-warning {
        background-color: #ffc107 !important;
        color: #212529 !important;
    }
    
    .badge-info {
        background-color: #0dcaf0 !important;
        color: #212529 !important;
    }
    
    .badge-success {
        background-color: #198754 !important;
    }
    
    .badge-danger {
        background-color: #dc3545 !important;
    }
    
    .badge-primary {
        background-color: #0d6efd !important;
    }
</style>
@endpush