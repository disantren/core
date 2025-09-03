import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Account = { id: number; code: string; name: string; type: string; parent_id?: number | null };
type LedgerEntry = { id: number; entry_date: string; description?: string; debit: string; credit: string; reference?: string; account: Account; santri?: { id: number; nama: string } };
type StudentPayment = { id: number; amount: string; status: string; method: string; paid_at?: string | null; created_at: string; santri: { id: number; nama: string } };

export default function AkuntansiDashboard() {
  const { props } = usePage();
  const { stats, accounts, recent_ledger_entries, recent_student_payments, santris } = props as any;

  useEffect(() => {
    const errors = (props as any).errors || {};
    const keys = Object.keys(errors);
    if (keys.length) {
      keys.forEach(k => toast.error(errors[k], { position: "top-right" }));
    }
  }, [props]);

  const currency = (n: number | string) => {
    const v = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
  };

  // Forms state
  const [accountForm, setAccountForm] = useState({ code: "", name: "", type: "asset", parent_id: "" });
  const [entryForm, setEntryForm] = useState({ account_id: "", entry_date: new Date().toISOString().slice(0,10), description: "", debit: "", credit: "", santri_id: "", reference: "" });
  const [paymentForm, setPaymentForm] = useState({ santri_id: "", amount: "", status: "paid", note: "" });

  const accountTypes = [
    { value: "asset", label: "Aset" },
    { value: "liability", label: "Liabilitas" },
    { value: "equity", label: "Ekuitas" },
    { value: "revenue", label: "Pendapatan" },
    { value: "expense", label: "Beban" },
  ];

  const onSubmitAccount = () => {
    const payload: any = { ...accountForm };
    if (!payload.parent_id || payload.parent_id === 'none') delete payload.parent_id;
    router.post(route('akuntansi.create_account'), payload, {
      onSuccess: () => toast.success('Akun berhasil dibuat', { position: "top-right" })
    });
  };

  const onSubmitEntry = () => {
    const payload: any = { ...entryForm };
    if (!payload.santri_id || payload.santri_id === 'none') delete payload.santri_id;
    router.post(route('akuntansi.create_ledger'), payload, {
      onSuccess: () => toast.success('Jurnal berhasil dicatat', { position: "top-right" })
    });
  };

  const onSubmitPayment = () => {
    router.post(route('akuntansi.create_payment'), paymentForm, {
      onSuccess: () => toast.success('Pembayaran dummy tersimpan', { position: "top-right" })
    });
  };

  const accountOptions = useMemo(() => (accounts as Account[]).map(a => ({ value: String(a.id), label: `${a.code} - ${a.name}` })), [accounts]);
  const parentOptions = useMemo(() => [{ value: "none", label: "(Tanpa Induk)" }, ...accountOptions], [accountOptions]);

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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader><CardTitle>Buat Akun</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Kode (mis. 4-100)" value={accountForm.code} onChange={e => setAccountForm(s => ({ ...s, code: e.target.value }))} />
              <Input placeholder="Nama Akun" value={accountForm.name} onChange={e => setAccountForm(s => ({ ...s, name: e.target.value }))} />
              <Select value={accountForm.type} onValueChange={v => setAccountForm(s => ({ ...s, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Tipe Akun" /></SelectTrigger>
                <SelectContent>
                  {accountTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={accountForm.parent_id} onValueChange={v => setAccountForm(s => ({ ...s, parent_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Akun Induk (opsional)" /></SelectTrigger>
                <SelectContent>
                  {parentOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={onSubmitAccount}>Simpan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Catat Jurnal</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={entryForm.account_id} onValueChange={v => setEntryForm(s => ({ ...s, account_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih Akun" /></SelectTrigger>
                <SelectContent>
                  {accountOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="date" value={entryForm.entry_date} onChange={e => setEntryForm(s => ({ ...s, entry_date: e.target.value }))} />
              <Input placeholder="Deskripsi" value={entryForm.description} onChange={e => setEntryForm(s => ({ ...s, description: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Debit" type="number" value={entryForm.debit} onChange={e => setEntryForm(s => ({ ...s, debit: e.target.value }))} />
                <Input placeholder="Kredit" type="number" value={entryForm.credit} onChange={e => setEntryForm(s => ({ ...s, credit: e.target.value }))} />
              </div>
              <Select value={entryForm.santri_id} onValueChange={v => setEntryForm(s => ({ ...s, santri_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Santri (opsional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">(Kosong)</SelectItem>
                  {(santris as { id: number; nama: string }[]).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Referensi (opsional)" value={entryForm.reference} onChange={e => setEntryForm(s => ({ ...s, reference: e.target.value }))} />
              <Button onClick={onSubmitEntry}>Simpan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pembayaran Santri (Dummy)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={paymentForm.santri_id} onValueChange={v => setPaymentForm(s => ({ ...s, santri_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih Santri" /></SelectTrigger>
                <SelectContent>
                  {(santris as { id: number; nama: string }[]).map((s) => (
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
