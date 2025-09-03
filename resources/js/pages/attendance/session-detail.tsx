import React from 'react';
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';

type RecordMap = Record<number, { id: number; status: string; checkin_at?: string | null; checkout_at?: string | null; late_minutes?: number | null; method?: string | null; note?: string | null }>

export default function AttendanceSessionDetail({ session, santri, records, statusOptions }: { session: AttendanceSessionDTO; santri: Santri[]; records: RecordMap; statusOptions: string[] }) {
  const { props } = usePage();
  const errors = (props as any)?.errors || {};

  const updateStatus = (santri_id: number, status: string) => {
    router.post(`/dashboard/attendance/sessions/${session.id}/records`, { santri_id, status });
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Absensi Kelas</h1>
          <p className="text-sm text-gray-500">Tanggal: {session.date} • {session.is_locked ? 'Terkunci' : 'Terbuka'}</p>
        </div>
        {errors?.session && (
          <div className="text-sm text-red-600">{errors.session}</div>
        )}
        <div className="border rounded overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2">NIS</th>
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {santri.map(s => {
                const rec = records[s.id];
                const current = rec?.status || '';
                return (
                  <tr key={s.id} className="border-b">
                    <td className="px-3 py-2">{s.nis || '-'}</td>
                    <td className="px-3 py-2">{s.nama}</td>
                    <td className="px-3 py-2">
                      <select disabled={session.is_locked} value={current} onChange={(e) => updateStatus(s.id, e.target.value)} className="border rounded h-8 px-2">
                        <option value="">Pilih status</option>
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      {!session.is_locked && (
                        <div className="flex gap-2">
                          <Button size="sm" variant={current === 'present' ? 'default' : 'secondary'} onClick={() => updateStatus(s.id, 'present')}>Hadir</Button>
                          <Button size="sm" variant={current === 'late' ? 'default' : 'secondary'} onClick={() => updateStatus(s.id, 'late')}>Telat</Button>
                          <Button size="sm" variant={current === 'sick' ? 'default' : 'secondary'} onClick={() => updateStatus(s.id, 'sick')}>Sakit</Button>
                          <Button size="sm" variant={current === 'permit' ? 'default' : 'secondary'} onClick={() => updateStatus(s.id, 'permit')}>Izin</Button>
                          <Button size="sm" variant={current === 'absent' ? 'default' : 'secondary'} onClick={() => updateStatus(s.id, 'absent')}>Alfa</Button>
                        </div>
                      )}
                      {session.is_locked && (
                        <span className="text-gray-500">Terkunci</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

