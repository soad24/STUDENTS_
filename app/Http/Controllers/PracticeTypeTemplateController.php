<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PracticeTypeTemplate;

class PracticeTypeTemplateController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware(function ($request, $next) {
            if (!auth()->user()->isAdmin()) {
                abort(403, 'غير مصرح لك بالوصول لهذه الصفحة');
            }
            return $next($request);
        });
    }

    public function index()
    {
        $templates = PracticeTypeTemplate::with('creator')->latest()->paginate(10);
        return view('admin.templates.index', compact('templates'));
    }

    public function create()
    {
        return view('admin.templates.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Parse JSON data from the form
        $participationTypes = json_decode($request->input('participation_types', '[]'), true);
        $participationLevels = json_decode($request->input('participation_levels', '[]'), true);
        $customFields = json_decode($request->input('custom_fields', '[]'), true);

        $template = PracticeTypeTemplate::create([
            'name' => $request->name,
            'description' => $request->description,
            'participation_types' => $participationTypes,
            'participation_levels' => $participationLevels,
            'custom_fields' => $customFields,
            'point_calculation_rules' => [],
            'created_by' => auth()->id(),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'template' => $template]);
        }

        return redirect()->route('admin.templates.index')
            ->with('success', 'تم إنشاء قالب الممارسة المهنية بنجاح');
    }

    public function show(PracticeTypeTemplate $template)
    {
        return view('admin.templates.show', compact('template'));
    }

    public function edit(PracticeTypeTemplate $template)
    {
        return view('admin.templates.edit', compact('template'));
    }

    public function update(Request $request, PracticeTypeTemplate $template)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Parse JSON data from the form
        $participationTypes = json_decode($request->input('participation_types', '[]'), true);
        $participationLevels = json_decode($request->input('participation_levels', '[]'), true);
        $customFields = json_decode($request->input('custom_fields', '[]'), true);

        $template->update([
            'name' => $request->name,
            'description' => $request->description,
            'participation_types' => $participationTypes,
            'participation_levels' => $participationLevels,
            'custom_fields' => $customFields,
        ]);

        return redirect()->route('admin.templates.index')
            ->with('success', 'تم تحديث قالب الممارسة المهنية بنجاح');
    }

    public function destroy(PracticeTypeTemplate $template)
    {
        $template->delete();
        return redirect()->route('admin.templates.index')
            ->with('success', 'تم حذف قالب الممارسة المهنية بنجاح');
    }

    public function toggle(PracticeTypeTemplate $template)
    {
        $template->update(['is_active' => !$template->is_active]);
        
        $status = $template->is_active ? 'تفعيل' : 'إلغاء تفعيل';
        return redirect()->back()->with('success', "تم {$status} القالب بنجاح");
    }
}