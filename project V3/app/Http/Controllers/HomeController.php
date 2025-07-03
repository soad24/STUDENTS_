<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProfessionalPractice;
use App\Models\User;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isStudent()) {
            return $this->studentDashboard();
        } elseif ($user->isReviewer()) {
            return $this->reviewerDashboard();
        } elseif ($user->isApprover()) {
            return $this->approverDashboard();
        } elseif ($user->isCertifier()) {
            return $this->certifierDashboard();
        } elseif ($user->isAdmin()) {
            return $this->adminDashboard();
        }

        return view('home');
    }

    private function studentDashboard()
    {
        $user = auth()->user();
        $practices = $user->professionalPractices()->with(['practiceType', 'participationType', 'participationLevel'])->latest()->get();
        $totalPoints = $user->getTotalPoints();
        $pendingCount = $practices->where('status', 'pending')->count();
        $approvedCount = $practices->where('status', 'approved')->count();

        return view('dashboard.student', compact('practices', 'totalPoints', 'pendingCount', 'approvedCount'));
    }

    private function reviewerDashboard()
    {
        $pendingReviews = ProfessionalPractice::where('status', 'pending')->with(['user', 'practiceType'])->latest()->get();
        $reviewedCount = ProfessionalPractice::where('reviewed_by', auth()->id())->count();

        return view('dashboard.reviewer', compact('pendingReviews', 'reviewedCount'));
    }

    private function approverDashboard()
    {
        $pendingApprovals = ProfessionalPractice::where('status', 'under_review')->with(['user', 'practiceType', 'reviewer'])->latest()->get();
        $approvedCount = ProfessionalPractice::where('approved_by', auth()->id())->count();

        return view('dashboard.approver', compact('pendingApprovals', 'approvedCount'));
    }

    private function certifierDashboard()
    {
        $pendingCertifications = ProfessionalPractice::where('status', 'approved')->with(['user', 'practiceType'])->latest()->get();
        $certifiedCount = ProfessionalPractice::where('certified_by', auth()->id())->count();

        return view('dashboard.certifier', compact('pendingCertifications', 'certifiedCount'));
    }

    private function adminDashboard()
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalPractices = ProfessionalPractice::count();
        $pendingPractices = ProfessionalPractice::where('status', 'pending')->count();
        $approvedPractices = ProfessionalPractice::where('status', 'approved')->count();

        return view('dashboard.admin', compact('totalStudents', 'totalPractices', 'pendingPractices', 'approvedPractices'));
    }
}