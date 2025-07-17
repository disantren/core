import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal} from "lucide-react";
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { usePage } from "@inertiajs/react";


export default function RoleManagement() {

    const props = usePage()

    const { units }: { units: Array<Unit> } = props.props as unknown as { units: Array<Unit> }


    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Units Management</h1>
                        <p className="text-gray-500 mt-1">Atur units untuk pondok pesantren</p>
                    </header>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead className="w-[50%]">Nama Unit</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.length > 0 ? (
                                    units.map((unit) => (
                                        <TableRow key={unit.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{unit.nama_unit}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Buka menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            Unit tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
