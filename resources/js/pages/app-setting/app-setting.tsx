import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Facebook, Globe, Linkedin, UploadCloud } from 'lucide-react';
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

function AppSetting({ data }: { data: AppSettingsProps }) {

    const { props } = usePage();
    const { errors } = props;

    console.log(props);
    const [formData, setFormData] = useState({
        nama_pondok_pesantren: data.nama_pondok_pesantren,
        logo_img: `/storage/${data.logo_img}`,
        alamat: data.alamat,
        instagram: data.instagram,
        facebook: data.facebook,
        website: data.website,
        linkedin: data.linkedin,
        spp_monthly_price: data.spp_monthly_price ?? 0,
        attendance_enabled: Boolean(data.attendance_enabled ?? false),
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(formData.logo_img);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // @ts-expect-error asf
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const errors = props.errors
        const error_key = Object.keys(errors)
        error_key.forEach(key => {
            toast.error(errors[key], {
                position: "top-right",
            })
        })
    }, [props]) 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.post('/dashboard/app-setting/update', {
            nama_pondok_pesantren: formData.nama_pondok_pesantren,
            logo_img: logoFile,
            alamat: formData.alamat,
            instagram: formData.instagram,
            facebook: formData.facebook,
            website: formData.website,
            linkedin: formData.linkedin,
            spp_monthly_price: formData.spp_monthly_price,
            attendance_enabled: formData.attendance_enabled ? 1 : 0,
        }, {
            onSuccess: () => {
                toast.success('Data berhasil disimpan!', {
                    position: "top-right",
                });
            }
        });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8 bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                    {/* Header Form */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Aplikasi</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Ubah detail informasi mengenai pondok pesantren Anda di sini.
                        </p>
                    </div>

                    {/* Konten Form */}
                    <div className="space-y-6">
                        {/* Feature flags */}
                        <div className="space-y-2">
                            <Label htmlFor="attendance_enabled">Fitur Absensi</Label>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                    <div className="font-medium">Aktifkan Absensi</div>
                                    <div className="text-sm text-gray-500">Nonaktifkan untuk menyembunyikan menu dan memblokir akses absensi.</div>
                                </div>
                                <Switch
                                    id="attendance_enabled"
                                    checked={!!formData.attendance_enabled}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, attendance_enabled: checked }))}
                                />
                            </div>
                        </div>
                        {/* SPP Bulanan */}
                        <div className="space-y-2">
                            <Label htmlFor="spp_monthly_price">Harga SPP Bulanan (Rp)</Label>
                            <Input
                                id="spp_monthly_price"
                                name="spp_monthly_price"
                                type="number"
                                value={String(formData.spp_monthly_price ?? '')}
                                onChange={handleInputChange}
                                placeholder="Contoh: 150000"
                            />
                            {errors?.spp_monthly_price && (
                                <Alert variant="destructive">
                                    <AlertTitle>{errors?.spp_monthly_price}</AlertTitle>
                                </Alert>
                            )}
                        </div>
                        {/* Nama Pondok Pesantren */}
                        <div className="space-y-2">
                            <Label htmlFor="nama_pondok_pesantren">Nama Lembaga</Label>
                            <Input
                                id="nama_pondok_pesantren"
                                name="nama_pondok_pesantren"
                                value={formData.nama_pondok_pesantren}
                                onChange={handleInputChange}
                                placeholder="Contoh: Pondok Pesantren Modern"
                            />
                            {errors?.nama_pondok_pesantren && (
                                <Alert variant="destructive">
                                    <AlertTitle>{errors?.nama_pondok_pesantren}</AlertTitle>
                                </Alert>
                            )}
                        </div>

                        {/* Logo */}
                        <div className="space-y-2">
                            <Label>Logo Pondok Pesantren</Label>
                            <div className="flex items-center gap-4">
                                {logoPreview && (
                                    <img
                                        src={`${logoPreview}`}
                                        alt="Preview Logo"
                                        className="h-20 w-20 rounded-lg object-cover border"
                                    />
                                )}
                                <div className="relative w-full">
                                    <Label htmlFor="logo_img_input" className="cursor-pointer w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                                        <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">Klik untuk mengganti logo</span>
                                    </Label>
                                    <Input
                                        id="logo_img_input"
                                        name="logo_img"
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                            {errors?.logo_img && (
                                <Alert variant="destructive">
                                    <AlertTitle>{errors?.logo_img}</AlertTitle>
                                </Alert>
                            )}
                        </div>

                        {/* Alamat */}
                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat Lengkap</Label>
                            <Textarea
                                id="alamat"
                                name="alamat"
                                value={formData.alamat}
                                // @ts-expect-error asf
                                onChange={handleInputChange}
                                placeholder="Masukkan alamat lengkap pondok pesantren"
                                rows={4}
                            />
                            {errors?.alamat && (
                                <Alert variant="destructive">
                                    <AlertTitle>{errors?.alamat}</AlertTitle>
                                </Alert>
                            )}
                        </div>

                        {/* Social Media Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Website */}
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="relative flex items-center">
                                    <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="website"
                                        name="website"
                                        type="text"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://websiteanda.com"
                                        className="pl-10"
                                    />
                                </div>
                                {errors?.website && (
                                    <Alert variant="destructive">
                                        <AlertTitle>{errors?.website}</AlertTitle>
                                    </Alert>
                                )}
                            </div>

                            {/* Instagram */}
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <div className="relative flex items-center">
                                    <Instagram className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="instagram"
                                        name="instagram"
                                        type="text"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                        placeholder="https://instagram.com/username"
                                        className="pl-10"
                                    />
                                </div>
                                {errors?.instagram && (
                                    <Alert variant="destructive">
                                        <AlertTitle>{errors?.instagram}</AlertTitle>
                                    </Alert>
                                )}
                            </div>

                            {/* Facebook */}
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook</Label>
                                <div className="relative flex items-center">
                                    <Facebook className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="facebook"
                                        name="facebook"
                                        type="text"
                                        value={formData.facebook}
                                        onChange={handleInputChange}
                                        placeholder="https://facebook.com/username"
                                        className="pl-10"
                                    />
                                </div>
                                {errors?.facebook && (
                                    <Alert variant="destructive">
                                        <AlertTitle>{errors?.facebook}</AlertTitle>
                                    </Alert>
                                )}
                            </div>

                            {/* LinkedIn */}
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <div className="relative flex items-center">
                                    <Linkedin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="linkedin"
                                        name="linkedin"
                                        type="text"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="https://linkedin.com/company/..."
                                        className="pl-10"
                                    />
                                </div>
                                {errors?.linkedin && (
                                    <Alert variant="destructive">
                                        <AlertTitle>{errors?.linkedin}</AlertTitle>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Form */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}


export default AppSetting;
