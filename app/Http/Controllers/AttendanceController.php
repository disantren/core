<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use App\Models\Kelas;
use App\Models\Santri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $sessions = AttendanceSession::with(['kelas.unit'])
            ->withCount('records')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(50)
            ->get();

        $kelas = Kelas::with('unit')->orderBy('nama_kelas')->get();

        return Inertia::render('attendance/index', [
            'sessions' => $sessions,
            'kelasList' => $kelas->map(fn ($k) => [
                'id' => $k->id,
                'label' => ($k->unit ? ($k->unit->nama_unit . ' - ') : '') . $k->nama_kelas,
            ]),
            'today' => now()->toDateString(),
        ]);
    }

    public function storeSession(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'kelas_id' => 'required|exists:kelas,id',
            'notes' => 'nullable|string',
        ]);

        $exists = AttendanceSession::where('date', $data['date'])
            ->where('kelas_id', $data['kelas_id'])
            ->exists();
        if ($exists) {
            return back()->withErrors(['kelas_id' => 'Sesi pada tanggal dan kelas ini sudah ada.']);
        }

        AttendanceSession::create([
            'date' => $data['date'],
            'kelas_id' => $data['kelas_id'],
            'opened_by' => $request->user()->id,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('attendance.index')->with('success', 'Sesi absensi dibuka.');
    }

    public function lock(AttendanceSession $session, Request $request)
    {
        if ($session->is_locked) {
            return back()->with('info', 'Sesi sudah dikunci.');
        }
        $session->is_locked = true;
        $session->closed_by = $request->user()->id;
        $session->save();
        return back()->with('success', 'Sesi absensi dikunci.');
    }

    public function detail(AttendanceSession $session)
    {
        $session->load(['kelas', 'kelas.unit']);

        // Ambil santri berdasarkan kelas pada sesi
        $santri = Santri::where('kelas_id', $session->kelas_id)
            ->orderBy('nama')
            ->get(['id', 'nama', 'nis', 'nisn']);

        // Mapkan record absensi existing untuk sesi ini
        $records = AttendanceRecord::where('attendance_session_id', $session->id)
            ->get()
            ->keyBy('santri_id');

        return Inertia::render('attendance/session-detail', [
            'session' => $session,
            'santri' => $santri,
            'records' => $records,
            'statusOptions' => ['present', 'late', 'sick', 'permit', 'absent'],
        ]);
    }

    public function mark(AttendanceSession $session, Request $request)
    {
        if ($session->is_locked) {
            return back()->withErrors(['session' => 'Sesi sudah dikunci.']);
        }

        $data = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'status' => 'required|string|in:present,late,sick,permit,absent',
            'checkin_at' => 'nullable|date',
            'checkout_at' => 'nullable|date',
            'late_minutes' => 'nullable|integer|min:0',
            'method' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        // Pastikan santri berada di kelas yang sama
        $santriInKelas = Santri::where('id', $data['santri_id'])
            ->where('kelas_id', $session->kelas_id)
            ->exists();
        if (!$santriInKelas) {
            return back()->withErrors(['santri_id' => 'Santri tidak terdaftar di kelas sesi ini.']);
        }

        DB::transaction(function () use ($request, $session, $data) {
            $record = AttendanceRecord::firstOrNew([
                'attendance_session_id' => $session->id,
                'santri_id' => $data['santri_id'],
            ]);

            $record->status = $data['status'];
            $record->checkin_at = $data['checkin_at'] ?? $record->checkin_at;
            $record->checkout_at = $data['checkout_at'] ?? $record->checkout_at;
            $record->late_minutes = $data['late_minutes'] ?? 0;
            $record->method = $data['method'] ?? 'manual';
            $record->note = $data['note'] ?? null;
            $record->marked_by = $request->user()->id;
            $record->save();
        });

        return back()->with('success', 'Absensi diperbarui.');
    }
}

