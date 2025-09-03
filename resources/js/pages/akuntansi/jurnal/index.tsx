import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Account = { id: number; code: string; name: string; type: string; parent_id?: number | null };
type LedgerEntry = { id: number; entry_date: string; description?: string; debit: string; credit: string; reference?: string; account: Account; santri?: { id: number; nama: string } };
type Santri = { id: number; nama: string };

export default function JurnalIndex() {
  const { props } = usePage();
  const { accounts = [], santris = [], ledger_entries = [] } = (props as {
    accounts?: Account[],
    santris?: Santri[],
    ledger_entries?: Array<LedgerEntry>
  });

  const [entryForm, setEntryForm] = useState({ 
    account_id: "", 
    entry_date: new Date().toISOString().slice(0,10), 
    description: "", 
    debit: "", 
    credit: "", 
    santri_id: "", 
    reference: "" 
  });

  const onSubmitEntry = () => {
    const payload = { ...entryForm };
    if (!payload.santri_id || payload.santri_id === 'none') delete payload.santri_id;
    router.post(route('akuntansi.create_ledger'), payload, {
      onSuccess: () => toast.success('Jurnal berhasil dicatat', { position: "top-right" })
    });
  };

  const currency = (n: number | string) => {
    const v = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
  };

  const accountOptions = useMemo(() => (Array.isArray(accounts) ? accounts : []).map(a => ({ value: String(a.id), label: `${a.code} - ${a.name}` })), [accounts]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 w-full">
        <h1 className="text-2xl font-semibold mb-4">Jurnal Akuntansi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Catat Jurnal Baru</CardTitle></CardHeader>
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
                  {(Array.isArray(santris) ? santris : []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Referensi (opsional)" value={entryForm.reference} onChange={e => setEntryForm(s => ({ ...s, reference: e.target.value }))} />
              <Button onClick={onSubmitEntry}>Simpan</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Daftar Jurnal</CardTitle></CardHeader>
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
                  {(Array.isArray(ledger_entries) ? ledger_entries : []).map((e) => (
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
                  {(!ledger_entries || ledger_entries.length === 0) && (
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
