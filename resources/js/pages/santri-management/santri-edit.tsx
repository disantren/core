/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

function SantriEdit() {
  const { props } = usePage();
  const { santri, units, kelas }: {
    santri: Santri;
    units: Unit[];
    kelas: Kelas[];
  } = props as unknown as any;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<Kelas[]>(kelas || []);

  const [formData, setFormData] = useState({
    nama: santri?.nama || "",
    nisn: santri?.nisn || "",
    unit_id: santri?.unit_id?.toString?.() || "",
    kelas_id: santri?.kelas_id?.toString?.() || "",
    status: (santri?.status as string) || "aktif",
    no_hp: santri?.no_hp || "",
    tanggal_lahir: santri?.tanggal_lahir || "",
    alamat: santri?.alamat || "",
    ayah_kandung: santri?.ayah_kandung || "",
    ibu_kandung: santri?.ibu_kandung || "",
    no_hp_orang_tua: santri?.no_hp_orang_tua || "",
    password: "",
  });

  useEffect(() => {
    if (formData.unit_id) {
      axios.get(route("kelas.get_kelas_by_unit", formData.unit_id)).then((res) => {
        setKelasOptions(res.data);
      });
    }
  }, [formData.unit_id]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    router.patch(route("santri.update", santri.id), formData, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Santri</h1>
          <p className="text-gray-600">Perbarui data santri</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Edit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Nama</Label>
                  <Input value={formData.nama} onChange={(e) => handleChange("nama", e.target.value)} />
                </div>

                <div>
                  <Label>NISN</Label>
                  <Input value={formData.nisn} onChange={(e) => handleChange("nisn", e.target.value)} />
                </div>

                <div>
                  <Label>No. HP</Label>
                  <Input value={formData.no_hp} onChange={(e) => handleChange("no_hp", e.target.value)} />
                </div>

                <div>
                  <Label>Tanggal Lahir</Label>
                  <Input type="date" value={formData.tanggal_lahir ?? ""} onChange={(e) => handleChange("tanggal_lahir", e.target.value)} />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                      <SelectItem value="lulus">Lulus</SelectItem>
                      <SelectItem value="pindah">Pindah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Alamat</Label>
                  <Input value={formData.alamat} onChange={(e) => handleChange("alamat", e.target.value)} />
                </div>

                <div>
                  <Label>Ayah Kandung</Label>
                  <Input value={formData.ayah_kandung} onChange={(e) => handleChange("ayah_kandung", e.target.value)} />
                </div>

                <div>
                  <Label>Ibu Kandung</Label>
                  <Input value={formData.ibu_kandung} onChange={(e) => handleChange("ibu_kandung", e.target.value)} />
                </div>

                <div>
                  <Label>No. HP Orang Tua</Label>
                  <Input value={formData.no_hp_orang_tua} onChange={(e) => handleChange("no_hp_orang_tua", e.target.value)} />
                </div>

                <div>
                  <Label>Unit</Label>
                  <Select value={formData.unit_id} onValueChange={(v) => handleChange("unit_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.nama_unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Kelas</Label>
                  <Select value={formData.kelas_id} onValueChange={(v) => handleChange("kelas_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {kelasOptions.map((k) => (
                        <SelectItem key={k.id} value={k.id.toString()}>
                          {k.nama_kelas}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.get(route("santri.index"))}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default SantriEdit;

