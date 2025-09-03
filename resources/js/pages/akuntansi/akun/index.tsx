import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage, router } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Account = { id: number; code: string; name: string; type: string; parent_id?: number | null };

export default function AkunIndex() {
  const { props } = usePage();
  const { accounts } = props as any;

  const [accountForm, setAccountForm] = useState({ code: "", name: "", type: "asset", parent_id: "" });

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

  const accountOptions = useMemo(() => (accounts as Account[]).map(a => ({ value: String(a.id), label: `${a.code} - ${a.name}` })), [accounts]);
  const parentOptions = useMemo(() => [{ value: "none", label: "(Tanpa Induk)" }, ...accountOptions], [accountOptions]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 w-full">
        <h1 className="text-2xl font-semibold mb-4">Manajemen Akun</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Buat Akun Baru</CardTitle></CardHeader>
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

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Daftar Akun</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(accounts as Account[]).map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className="capitalize">{account.type}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
