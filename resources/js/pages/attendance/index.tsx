import React, { useState } from 'react';
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, Link, usePage } from '@inertiajs/react';
import { Alert, AlertTitle } from '@/components/ui/alert';

type Session = AttendanceSessionDTO & { kelas?: Kelas };

export default function AttendanceIndex({ sessions, kelasList, today }: { sessions: Session[]; kelasList: { id: number; label: string }[]; today: string; }) {
  const { props } = usePage();
  const errors = (props as any)?.errors || {};
  const [form, setForm] = useState<{ date: string; kelas_id: string; notes?: string }>({ date: today, kelas_id: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/attendance/sessions', form);
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Absensi</h1>
          <p className="text-sm text-gray-500">Buka sesi dan kelola absensi per kelas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={submit} className="border rounded-lg p-4 space-y-3">
            <div className="text-lg font-semibold">Buka Sesi Baru</div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {errors?.date && (
                <Alert variant="destructive"><AlertTitle>{errors.date}</AlertTitle></Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelas_id">Kelas</Label>
              <select id="kelas_id" className="w-full border rounded h-9 px-2" value={form.kelas_id} onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}>
                <option value="">Pilih kelas</option>
                {kelasList.map(k => (
                  <option key={k.id} value={k.id}>{k.label}</option>
                ))}
              </select>
              {errors?.kelas_id && (
                <Alert variant="destructive"><AlertTitle>{errors.kelas_id}</AlertTitle></Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan (opsional)</Label>
              <Input id="notes" placeholder="Catatan" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button type="submit">Buka Sesi</Button>
          </form>

          <div className="border rounded-lg p-4">
            <div className="text-lg font-semibold mb-3">Sesi Terakhir</div>
            <div className="space-y-2">
              {sessions.length === 0 && (
                <div className="text-sm text-gray-500">Belum ada sesi.</div>
              )}
              {sessions.map(s => (
                <div key={s.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.kelas?.unit ? `${s.kelas.unit?.nama_unit} - ` : ''}{s.kelas?.nama_kelas}</div>
                    <div className="text-xs text-gray-500">{s.date} • {s.is_locked ? 'Terkunci' : 'Terbuka'} • {s.records_count || 0} data</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/attendance/sessions/${s.id}`} className="text-sm text-blue-600 hover:underline">Kelola</Link>
                    {!s.is_locked && (
                      <Button size="sm" variant="secondary" onClick={() => router.post(`/dashboard/attendance/sessions/${s.id}/lock`)}>Kunci</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

