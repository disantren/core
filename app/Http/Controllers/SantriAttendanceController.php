<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SantriAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $santri = $request->user('santri');

        $today = now()->toDateString();
        $session = AttendanceSession::where('date', $today)
            ->where('kelas_id', $santri->kelas_id)
            ->where('is_locked', false)
            ->first();

        $record = null;
        if ($session) {
            $record = AttendanceRecord::where('attendance_session_id', $session->id)
                ->where('santri_id', $santri->id)
                ->first();
        }

        return Inertia::render('santri/absen', [
            'today' => $today,
            'session' => $session,
            'record' => $record,
        ]);
    }

    public function mark(Request $request)
    {
        $santri = $request->user('santri');
        $today = now();

        $session = AttendanceSession::whereDate('date', $today->toDateString())
            ->where('kelas_id', $santri->kelas_id)
            ->where('is_locked', false)
            ->first();

        if (!$session) {
            return back()->withErrors(['session' => 'Belum ada sesi absensi hari ini.']);
        }

        $record = AttendanceRecord::firstOrNew([
            'attendance_session_id' => $session->id,
            'santri_id' => $santri->id,
        ]);

        $record->status = 'present';
        $record->checkin_at = $record->checkin_at ?: $today;
        $record->method = 'manual';
        $record->save();

        return Redirect::back()->with('success', 'Absensi berhasil.');
    }
}

