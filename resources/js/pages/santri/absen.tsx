import React from 'react';
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function SantriAbsen({ today, session, record }: { today: string; session: any; record: any }) {
  const { props } = usePage();
  const authSantri = (props as any)?.auth?.santri;
  const errors = (props as any)?.errors || {};
  const flash = (props as any)?.flash || {};

  const handleAbsen = () => {
    router.post('/santri/absen');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Absensi Santri</h1>
          <p className="text-sm text-gray-500">Tanggal: {today}</p>
        </div>

        {flash?.success && (
          <Alert>
            <AlertTitle>{flash.success}</AlertTitle>
          </Alert>
        )}
        {errors?.session && (
          <Alert variant="destructive">
            <AlertTitle>{errors.session}</AlertTitle>
          </Alert>
        )}

        <div className="border rounded-lg p-4">
          <div className="mb-2">Halo, <span className="font-semibold">{authSantri?.nama}</span></div>
          {!session && (
            <div className="text-sm text-gray-600">Belum ada sesi absensi untuk kelasmu hari ini.</div>
          )}
          {session && !record && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">Sesi ditemukan. Silakan absen sekarang.</div>
              <Button onClick={handleAbsen}>Absen Sekarang</Button>
            </div>
          )}
          {session && record && (
            <div className="space-y-3">
              <div className="text-sm">Status kamu: <span className="font-semibold">{record.status}</span></div>
              <div className="text-sm text-gray-600">Check-in: {record.checkin_at || '-'}</div>
              <Button variant="secondary" onClick={() => router.post('/santri/logout')}>Keluar</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

