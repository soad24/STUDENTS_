<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProfessionalPractice;
use App\Models\PracticeType;
use App\Models\ParticipationType;
use App\Models\ParticipationLevel;
use Carbon\Carbon;

class ProfessionalPracticeController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isStudent()) {
            $practices = $user->professionalPractices()->with(['practiceType', 'participationType', 'participationLevel'])->latest()->paginate(10);
        } else {
            $practices = ProfessionalPractice::with(['user', 'practiceType', 'participationType', 'participationLevel'])->latest()->paginate(10);
        }

        return view('practices.index', compact('practices'));
    }

    public function create()
    {
        $practiceTypes = PracticeType::where('is_active', true)->get();
        $participationTypes = ParticipationType::where('is_active', true)->get();
        $participationLevels = ParticipationLevel::where('is_active', true)->get();

        return view('practices.create', compact('practiceTypes', 'participationTypes', 'participationLevels'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'practice_type_id' => 'required|exists:practice_types,id',
            'participation_type_id' => 'required|exists:participation_types,id',
            'participation_level_id' => 'required|exists:participation_levels,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'organization' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'duration_hours' => 'nullable|integer|min:1',
            'attachments.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $practice = new ProfessionalPractice($request->all());
        $practice->user_id = auth()->id();
        
        // Handle file uploads
        if ($request->hasFile('attachments')) {
            $attachments = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $attachments[] = [
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                ];
            }
            $practice->attachments = $attachments;
        }

        // Calculate submission deadline (1 month after end date)
        $practice->submission_deadline = Carbon::parse($request->end_date)->addMonth();
        
        // Calculate points
        $practiceType = PracticeType::find($request->practice_type_id);
        $participationType = ParticipationType::find($request->participation_type_id);
        $participationLevel = ParticipationLevel::find($request->participation_level_id);
        
        $practice->calculated_points = $practiceType->base_points * $participationType->multiplier * $participationLevel->multiplier;
        
        $practice->save();

        return redirect()->route('practices.index')->with('success', 'تم إرسال الممارسة المهنية بنجاح');
    }

    public function show(ProfessionalPractice $practice)
    {
        $this->authorize('view', $practice);
        
        return view('practices.show', compact('practice'));
    }

    public function edit(ProfessionalPractice $practice)
    {
        $this->authorize('update', $practice);
        
        $practiceTypes = PracticeType::where('is_active', true)->get();
        $participationTypes = ParticipationType::where('is_active', true)->get();
        $participationLevels = ParticipationLevel::where('is_active', true)->get();

        return view('practices.edit', compact('practice', 'practiceTypes', 'participationTypes', 'participationLevels'));
    }

    public function update(Request $request, ProfessionalPractice $practice)
    {
        $this->authorize('update', $practice);
        
        $request->validate([
            'practice_type_id' => 'required|exists:practice_types,id',
            'participation_type_id' => 'required|exists:participation_types,id',
            'participation_level_id' => 'required|exists:participation_levels,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'organization' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'duration_hours' => 'nullable|integer|min:1',
        ]);

        $practice->update($request->all());
        
        // Recalculate points
        $practice->calculated_points = $practice->calculatePoints();
        $practice->save();

        return redirect()->route('practices.show', $practice)->with('success', 'تم تحديث الممارسة المهنية بنجاح');
    }

    public function review(Request $request, ProfessionalPractice $practice)
    {
        $this->authorize('review', $practice);
        
        $request->validate([
            'action' => 'required|in:approve,reject,return',
            'notes' => 'nullable|string',
        ]);

        $practice->reviewer_notes = $request->notes;
        $practice->reviewed_by = auth()->id();
        $practice->reviewed_at = now();

        switch ($request->action) {
            case 'approve':
                $practice->status = 'under_review';
                break;
            case 'reject':
                $practice->status = 'rejected';
                break;
            case 'return':
                $practice->status = 'pending';
                break;
        }

        $practice->save();

        return redirect()->back()->with('success', 'تم حفظ المراجعة بنجاح');
    }

    public function approve(Request $request, ProfessionalPractice $practice)
    {
        $this->authorize('approve', $practice);
        
        $request->validate([
            'action' => 'required|in:approve,reject,return',
            'notes' => 'nullable|string',
            'points' => 'nullable|integer|min:0',
        ]);

        $practice->approver_notes = $request->notes;
        $practice->approved_by = auth()->id();
        $practice->approved_at = now();

        if ($request->filled('points')) {
            $practice->calculated_points = $request->points;
        }

        switch ($request->action) {
            case 'approve':
                $practice->status = 'approved';
                break;
            case 'reject':
                $practice->status = 'rejected';
                break;
            case 'return':
                $practice->status = 'pending';
                break;
        }

        $practice->save();

        return redirect()->back()->with('success', 'تم حفظ الاعتماد بنجاح');
    }

    public function certify(Request $request, ProfessionalPractice $practice)
    {
        $this->authorize('certify', $practice);
        
        $request->validate([
            'action' => 'required|in:certify,return',
            'notes' => 'nullable|string',
        ]);

        $practice->certifier_notes = $request->notes;
        $practice->certified_by = auth()->id();
        $practice->certified_at = now();

        if ($request->action === 'certify') {
            $practice->status = 'certified';
        } else {
            $practice->status = 'approved';
        }

        $practice->save();

        return redirect()->back()->with('success', 'تم حفظ التصديق بنجاح');
    }
}