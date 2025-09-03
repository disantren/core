/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Account = { id: number; code: string; name: string; type: string; parent_id?: number | null };
type LedgerEntry = { id: number; entry_date: string; description?: string; debit: string; credit: string; reference?: string; account: Account; santri?: { id: number; nama: string } };
type StudentPayment = { id: number; amount: string; status: string; method: string; paid_at?: string | null; created_at: string; santri: { id: number; nama: string } };


export default function AkuntansiDashboard() {
  const { props } = usePage();
  const { stats, recent_ledger_entries, recent_student_payments } = props as any;

  const currency = (n: number | string) => {
    const v = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 w-full">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Akuntansi</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader><CardTitle>Total Akun</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{stats.total_accounts}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Entri Buku Besar</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{stats.total_entries}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Pendapatan</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{currency(stats.total_revenue)}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pembayaran (Paid)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-lg">{currency(stats.payments.paid_amount)}</div>
              <div className="text-sm text-muted-foreground">{stats.payments.paid_count} transaksi</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lg:col-span-2 mb-4">
            <CardHeader>
              <CardTitle>Menu Akuntansi</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={() => window.location.href = route('akuntansi.akun')}>Manajemen Akun</Button>
              <Button onClick={() => window.location.href = route('akuntansi.jurnal')}>Jurnal</Button>
              <Button onClick={() => window.location.href = route('akuntansi.pembayaran')}>Pembayaran</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Entri Buku Besar Terbaru</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Akun</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Kredit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recent_ledger_entries as LedgerEntry[]).map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.entry_date}</TableCell>
                      <TableCell>
                        <div className="font-medium">{e.account.code} - {e.account.name}</div>
                        <div className="text-xs text-muted-foreground">{e.description}{e.santri ? ` • ${e.santri.nama}` : ''}</div>
                      </TableCell>
                      <TableCell>{currency(e.debit)}</TableCell>
                      <TableCell>{currency(e.credit)}</TableCell>
                    </TableRow>
                  ))}
                  {(!recent_ledger_entries || recent_ledger_entries.length === 0) && (
                    <TableRow><TableCell colSpan={4} className="text-center">Belum ada data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pembayaran Santri Terbaru</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Santri</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recent_student_payments as StudentPayment[]).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.paid_at ? new Date(p.paid_at).toLocaleDateString('id-ID') : new Date(p.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{p.santri?.nama}</TableCell>
                      <TableCell>{currency(p.amount)}</TableCell>
                      <TableCell className="capitalize">{p.status}</TableCell>
                    </TableRow>
                  ))}
                  {(!recent_student_payments || recent_student_payments.length === 0) && (
                    <TableRow><TableCell colSpan={4} className="text-center">Belum ada data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
