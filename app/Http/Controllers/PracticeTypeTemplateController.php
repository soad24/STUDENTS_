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
            'participation_types' => 'required|array',
            'participation_levels' => 'required|array',
            'custom_fields' => 'nullable|array',
            'point_calculation_rules' => 'nullable|array',
        ]);

        $template = PracticeTypeTemplate::create([
            'name' => $request->name,
            'description' => $request->description,
            'participation_types' => $request->participation_types,
            'participation_levels' => $request->participation_levels,
            'custom_fields' => $request->custom_fields ?? [],
            'point_calculation_rules' => $request->point_calculation_rules ?? [],
            'created_by' => auth()->id(),
        ]);

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
            'participation_types' => 'required|array',
            'participation_levels' => 'required|array',
            'custom_fields' => 'nullable|array',
            'point_calculation_rules' => 'nullable|array',
        ]);

        $template->update([
            'name' => $request->name,
            'description' => $request->description,
            'participation_types' => $request->participation_types,
            'participation_levels' => $request->participation_levels,
            'custom_fields' => $request->custom_fields ?? [],
            'point_calculation_rules' => $request->point_calculation_rules ?? [],
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