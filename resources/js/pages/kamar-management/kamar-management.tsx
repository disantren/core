import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout'
import { useEffect, useState } from "react"
import { usePage } from "@inertiajs/react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"


export default function RoomManagement() {

    const { props } = usePage()

    const { kamar }: { kamar: Array<Kamar> } = props as unknown as { kamar: Array<Kamar> }
    const [rooms, setRooms] = useState(kamar)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ id: 0, nama_kamar: "" })


    useEffect(() => {
        const errors = props.errors
        const error_key = Object.keys(errors)
        error_key.forEach(key => {
            toast.error(errors[key], {
                position: "top-right",
            })
        })
    }, [props])

    const handleOpenCreate = () => {
        setForm({ id: 0, nama_kamar: "" })
        setOpen(true)
    }

    const handleOpenEdit = (kamar: Kamar) => {
        setForm(kamar)
        setOpen(true)
    }

    const handleSubmit = () => {
        if (form.id) {

            router.patch(route('kamar.edit'), form, {
                onSuccess: () => {
                    toast.success('Kamar berhasil diupdate', {
                        position: "top-right",
                    })
                }
            });
        } else {
            router.post(route('kamar.create'), form, {
                onSuccess: () => {
                    toast.success('Kamar berhasil dibuat', {
                        position: "top-right",
                    })
                }
            });
        }
        setOpen(false)
    }

    const handleDelete = (id: number) => {
        setRooms(prev => prev.filter(r => r.id !== id))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Manajemen Kamar</h1>
                        <p className="text-gray-500 mt-1">Kelola daftar kamar</p>
                    </header>

                    <div className="mb-4 flex items-center gap-4">
                        <Button onClick={handleOpenCreate}>Tambah Kamar</Button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead>Nama Kamar</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.length > 0 ? (
                                    rooms.map(kamar => (
                                        <TableRow key={kamar.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{kamar.nama_kamar}</div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(kamar)}>Edit</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(kamar.id)}>Hapus</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center text-gray-500">
                                            Tidak ada kamar.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{form.id ? "Edit Kamar" : "Tambah Kamar"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            name="nama_kamar"
                            placeholder="Nama kamar"
                            value={form.nama_kamar}
                            onChange={handleChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>{form.id ? "Update" : "Simpan"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
