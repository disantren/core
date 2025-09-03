import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Santri = { id: number; nama: string; unit_id?: number };
type StudentPayment = { 
  id: number; 
  amount: string; 
  status: string; 
  method: string; 
  paid_at?: string | null; 
  created_at: string; 
  santri: Santri 
};
type Arrear = {
  id: number;
  nama: string;
  unit_id?: number;
  months_unpaid: number;
  months: string[]; // like ['01-2025']
  total_due: number;
  unit_price: number;
};

export default function PembayaranIndex() {
  const { props } = usePage();
  const { santris = [], student_payments = [], unpaid_this_month = [], spp_price = 0, unit_prices = {}, arrears = [] } = (props as any);

  const [paymentForm, setPaymentForm] = useState({ 
    santri_id: "", 
    amount: spp_price ? String(spp_price) : "", 
    status: "paid", 
    note: "" 
  });

  // Search unpaid this month
  const [searchUnpaid, setSearchUnpaid] = useState("");
  const filteredUnpaid = useMemo(() => {
    const list: Santri[] = Array.isArray(unpaid_this_month) ? unpaid_this_month : [];
    const q = searchUnpaid.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) => (s.nama || "").toLowerCase().includes(q));
  }, [unpaid_this_month, searchUnpaid]);

  // Normalize paginated payments to a simple array
  const payments: StudentPayment[] = useMemo(() => {
    if (Array.isArray(student_payments)) return student_payments as StudentPayment[];
    if (student_payments && Array.isArray(student_payments.data)) return student_payments.data as StudentPayment[];
    return [] as StudentPayment[];
  }, [student_payments]);

  const arrearsList: Arrear[] = useMemo(() => {
    if (Array.isArray(arrears)) return arrears as Arrear[];
    return [] as Arrear[];
  }, [arrears]);

  const formatDate = (s?: string | null) => {
    if (!s) return '';
    try {
      const iso = s.includes('T') ? s : s.replace(' ', 'T') + (s.length === 10 ? 'T00:00:00' : '');
      const d = new Date(iso);
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const yyyy = d.getUTCFullYear();
      return `${dd}-${mm}-${yyyy}`;
    } catch {
      return s as string;
    }
  };

  // If user selects a santri and amount is empty, prefill with spp_price
  // Helper to get default amount by santri's unit
  const getDefaultAmountBySantri = (santriId: string | number) => {
    const sObj: Santri | undefined = (Array.isArray(santris) ? santris : []).find((s: Santri) => String(s.id) === String(santriId));
    const uIdAny = sObj?.unit_id as any;
    const priceFromUnit = uIdAny != null ? (unit_prices?.[String(uIdAny)] ?? unit_prices?.[uIdAny]) : undefined;
    const fallback = spp_price ? String(spp_price) : "";
    return priceFromUnit != null ? String(priceFromUnit) : fallback;
  };

  const onSelectSantri = (v: string) => {
    // Always set amount based on selected santri's unit
    const defaultAmount = getDefaultAmountBySantri(v);
    setPaymentForm(s => ({ ...s, santri_id: v, amount: defaultAmount }));
  };

  const onSubmitPayment = () => {
    // Basic client-side validation
    if (!paymentForm.santri_id) {
      toast.error('Pilih santri terlebih dahulu', { position: 'top-right' });
      return;
    }
    const amount = parseFloat(paymentForm.amount || '0');
    if (!(amount > 0)) {
      toast.error('Jumlah pembayaran harus > 0', { position: 'top-right' });
      return;
    }
    if (!paymentForm.status) {
      toast.error('Status pembayaran harus dipilih', { position: 'top-right' });
      return;
    }

    router.post(route('akuntansi.create_payment'), paymentForm, {
      onSuccess: () => toast.success('Pembayaran tersimpan', { position: 'top-right' }),
      onError: (errors: Record<string, string>) => {
        const first = Object.values(errors)[0] || 'Gagal menyimpan pembayaran';
        toast.error(String(first), { position: 'top-right' });
      },
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
              <Select value={paymentForm.santri_id} onValueChange={onSelectSantri}>
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
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.paid_at ? formatDate(p.paid_at) : formatDate(p.created_at)}</TableCell>
                      <TableCell>{p.santri?.nama}</TableCell>
                      <TableCell>{currency(p.amount)}</TableCell>
                      <TableCell className="capitalize">{p.status}</TableCell>
                    </TableRow>
                  ))}
                  {(payments.length === 0) && (
                    <TableRow><TableCell colSpan={4} className="text-center">Belum ada data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Kekurangan SPP (Sejak Awal Tahun)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Santri</TableHead>
                    <TableHead>Bulan Tertunggak</TableHead>
                    <TableHead>Harga/Unit</TableHead>
                    <TableHead>Total Kekurangan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arrearsList.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.nama}</TableCell>
                      <TableCell>
                        <div className="text-sm">{r.months_unpaid} bulan</div>
                        <div className="text-xs text-muted-foreground">{r.months.join(', ')}</div>
                      </TableCell>
                      <TableCell>{currency(r.unit_price)}</TableCell>
                      <TableCell>{currency(r.total_due)}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => setPaymentForm({ santri_id: String(r.id), amount: String(r.total_due), status: 'paid', note: 'Pembayaran tunggakan SPP' })}>
                          Isi Form Total Tunggakan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {arrearsList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Tidak ada tunggakan</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Belum Bayar Bulan Ini ({Array.isArray(filteredUnpaid) ? filteredUnpaid.length : 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <Input
                  placeholder="Cari santri..."
                  value={searchUnpaid}
                  onChange={(e) => setSearchUnpaid(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Santri</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(filteredUnpaid) ? filteredUnpaid : []).map((s: Santri) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.nama}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => {
                          const defaultAmount = getDefaultAmountBySantri(s.id);
                          setPaymentForm({ santri_id: String(s.id), amount: defaultAmount, status: "paid", note: "Pembayaran SPP" });
                        }}>
                          Isi Form Pembayaran
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!filteredUnpaid || filteredUnpaid.length === 0) && (
                    <TableRow><TableCell colSpan={2} className="text-center">Semua santri sudah membayar bulan ini</TableCell></TableRow>
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
