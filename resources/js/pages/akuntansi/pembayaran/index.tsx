import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Santri = { id: number; nama: string };
type StudentPayment = { 
  id: number; 
  amount: string; 
  status: string; 
  method: string; 
  paid_at?: string | null; 
  created_at: string; 
  santri: Santri 
};

export default function PembayaranIndex() {
  const { props } = usePage();
  const { santris = [], student_payments = [] } = (props as { 
    santris?: Santri[], 
    student_payments?: StudentPayment[] 
  });

  const [paymentForm, setPaymentForm] = useState({ 
    santri_id: "", 
    amount: "", 
    status: "paid", 
    note: "" 
  });

  const onSubmitPayment = () => {
    router.post(route('akuntansi.create_payment'), paymentForm, {
      onSuccess: () => toast.success('Pembayaran tersimpan', { position: "top-right" })
    });
  };

  const currency = (n: number | string) => {
    const v = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 w-full">
        <h1 className="text-2xl font-semibold mb-4">Pembayaran Santri</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Catat Pembayaran</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={paymentForm.santri_id} onValueChange={v => setPaymentForm(s => ({ ...s, santri_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih Santri" /></SelectTrigger>
                <SelectContent>
                  {(Array.isArray(santris) ? santris : []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Jumlah" type="number" value={paymentForm.amount} onChange={e => setPaymentForm(s => ({ ...s, amount: e.target.value }))} />
              <Select value={paymentForm.status} onValueChange={v => setPaymentForm(s => ({ ...s, status: v }))}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="failed">Gagal</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Catatan (opsional)" value={paymentForm.note} onChange={e => setPaymentForm(s => ({ ...s, note: e.target.value }))} />
              <Button onClick={onSubmitPayment}>Simpan</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Riwayat Pembayaran</CardTitle></CardHeader>
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
                  {(Array.isArray(student_payments) ? student_payments : []).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.paid_at ? new Date(p.paid_at).toLocaleDateString('id-ID') : new Date(p.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{p.santri?.nama}</TableCell>
                      <TableCell>{currency(p.amount)}</TableCell>
                      <TableCell className="capitalize">{p.status}</TableCell>
                    </TableRow>
                  ))}
                  {(!student_payments || student_payments.length === 0) && (
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
