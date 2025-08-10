import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"
interface ModalAddSantriProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    units: Array<Unit>;
    tahun_ajaran: Array<TahunAjaran>;
}

function ModalAddSantri({ open, onOpenChange, units, tahun_ajaran }: ModalAddSantriProps) {

    const { props } = usePage()
    const { errors } = props

    console.log(errors)
    const [kelas, setKelas] = useState<Array<Kelas>>([])



    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({  
        nama: "",
        nisn: "",
        unit_id: "",
        kelas_id: "",
        tahun_ajaran_id: "",
        status: "aktif",
        no_hp: "",
        tanggal_lahir: "",
        alamat: "",
        ayah_kandung: "",
        ibu_kandung: "",
        no_hp_orang_tua: "",
        password: "password",
    });

    const handleFormChange = (key: string, value: string) => {
        if (key === "unit_id") {
            axios.get(route("kelas.get_kelas_by_unit", value)).then((response) => {

                console.log(response.data)
                setKelas(response.data)
            })
        }
        setFormData({ ...formData, [key]: value });
    };

    const resetForm = () => {
        setFormData({
            nama: "",
            nisn: "",
            unit_id: "",
            kelas_id: "",
            status: "aktif",
            no_hp: "",
            tanggal_lahir: "",
            alamat: "",
            ayah_kandung: "",
            ibu_kandung: "",
            tahun_ajaran_id: "",
            no_hp_orang_tua: "",
            password: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log(formData)

        router.post(route("santri.create"), formData, {
            onSuccess: () => {
                onOpenChange(false);
                resetForm();
                toast.success("Santri berhasil ditambahkan");
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
        resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Tambah Santri Baru</DialogTitle>
                    <DialogDescription>
                        Isi form di bawah untuk menambahkan santri baru ke sistem
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nama */}
                        <div className="md:col-span-2">
                            <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nama"
                                value={formData.nama}
                                onChange={(e) => handleFormChange("nama", e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                required
                                className="mt-1"
                            />
                            {errors.nama && <p className="text-red-500 mt-1">{errors.nama}</p>}
                        </div>

                        {/* NISN */}
                        <div>
                            <Label htmlFor="nisn" className="text-sm font-medium text-gray-700">
                                NISN 
                            </Label>
                            <Input
                                id="nisn"
                                value={formData.nisn}
                                onChange={(e) => handleFormChange("nisn", e.target.value)}
                                placeholder="Masukkan NISN"
                                required
                                className="mt-1"
                            />
                            {errors.nisn && <p className="text-red-500 mt-1">{errors.nisn}</p>}
                        </div>

                        {/* Tahun Ajaran */}
                        <div>
                            <Label htmlFor="tahun_ajaran_id" className="text-sm font-medium text-gray-700">
                                Tahun Ajaran <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.tahun_ajaran_id} onValueChange={(v) => handleFormChange("tahun_ajaran_id", v)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tahun_ajaran.map((tahun_ajaran) => (
                                        <SelectItem key={tahun_ajaran.id} value={tahun_ajaran.id.toString()}>
                                            {tahun_ajaran.nama_tahun_ajaran}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tahun_ajaran_id && <p className="text-red-500 mt-1">{errors.tahun_ajaran_id}</p>}
                        </div>

                        {/* No. HP */}
                        <div>
                            <Label htmlFor="no_hp" className="text-sm font-medium text-gray-700">
                                No. HP
                            </Label>
                            <Input
                                id="no_hp"
                                value={formData.no_hp}
                                onChange={(e) => handleFormChange("no_hp", e.target.value)}
                                placeholder="Masukkan no. HP"
                                className="mt-1"
                            />
                            {errors.no_hp && <p className="text-red-500 mt-1">{errors.no_hp}</p>}
                        </div>

                        {/* Unit */}
                        <div>
                            <Label htmlFor="unit_id" className="text-sm font-medium text-gray-700">
                                Unit <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.unit_id} onValueChange={(v) => handleFormChange("unit_id", v)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                            {unit.nama_unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unit_id && <p className="text-red-500 mt-1">{errors.unit_id}</p>}
                        </div>

                        {/* Kelas */}
                        <div>
                            <Label htmlFor="kelas_id" className="text-sm font-medium text-gray-700">
                                Kelas <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.kelas_id} onValueChange={(v) => handleFormChange("kelas_id", v)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelas.map((kelas) => (
                                        <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                            {kelas.nama_kelas}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.kelas_id && <p className="text-red-500 mt-1">{errors.kelas_id}</p>}
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <Label htmlFor="tanggal_lahir" className="text-sm font-medium text-gray-700">
                                Tanggal Lahir
                            </Label>
                            <Input
                                id="tanggal_lahir"
                                type="date"
                                value={formData.tanggal_lahir}
                                onChange={(e) => handleFormChange("tanggal_lahir", e.target.value)}
                                className="mt-1"
                            />
                            {errors.tanggal_lahir && <p className="text-red-500 mt-1">{errors.tanggal_lahir}</p>}
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-gray-500 text-xs">Default: <span className="font-medium">password</span></p>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleFormChange("password", e.target.value)}
                                placeholder="Masukkan password"
                                required
                                className="mt-1"
                            />
                            {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Alamat */}
                        <div className="md:col-span-2">
                            <Label htmlFor="alamat" className="text-sm font-medium text-gray-700">
                                Alamat
                            </Label>
                            <Input
                                id="alamat"
                                value={formData.alamat}
                                onChange={(e) => handleFormChange("alamat", e.target.value)}
                                placeholder="Masukkan alamat lengkap"
                                className="mt-1"
                            />
                            {errors.alamat && <p className="text-red-500 mt-1">{errors.alamat}</p>}
                        </div>

                        {/* Ayah Kandung */}
                        <div>
                            <Label htmlFor="ayah_kandung" className="text-sm font-medium text-gray-700">
                                Ayah Kandung
                            </Label>
                            <Input
                                id="ayah_kandung"
                                value={formData.ayah_kandung}
                                onChange={(e) => handleFormChange("ayah_kandung", e.target.value)}
                                placeholder="Masukkan nama ayah kandung"
                                className="mt-1"
                            />
                            {errors.ayah_kandung && <p className="text-red-500 mt-1">{errors.ayah_kandung}</p>}
                        </div>

                        {/* Ibu Kandung */}
                        <div>
                            <Label htmlFor="ibu_kandung" className="text-sm font-medium text-gray-700">
                                Ibu Kandung
                            </Label>
                            <Input
                                id="ibu_kandung"
                                value={formData.ibu_kandung}
                                onChange={(e) => handleFormChange("ibu_kandung", e.target.value)}
                                placeholder="Masukkan nama ibu kandung"
                                className="mt-1"
                            />
                            {errors.ibu_kandung && <p className="text-red-500 mt-1">{errors.ibu_kandung}</p>}
                        </div>

                        {/* No. HP Orang Tua */}
                        <div>
                            <Label htmlFor="no_hp_orang_tua" className="text-sm font-medium text-gray-700">
                                No. HP Orang Tua
                            </Label>
                            <Input
                                id="no_hp_orang_tua"
                                value={formData.no_hp_orang_tua}
                                onChange={(e) => handleFormChange("no_hp_orang_tua", e.target.value)}
                                placeholder="Masukkan no. HP orang tua"
                                className="mt-1"
                            />
                            {errors.no_hp_orang_tua && <p className="text-red-500 mt-1">{errors.no_hp_orang_tua}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status
                            </Label>
                            <Select value={formData.status} onValueChange={(v) => handleFormChange("status", v)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                                    <SelectItem value="lulus">Lulus</SelectItem>
                                    <SelectItem value="pindah">Pindah</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 mt-1">{errors.status}</p>}
                        </div>
                    </div>
                </form>

                <DialogFooter className="flex gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ModalAddSantri;