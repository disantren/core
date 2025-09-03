/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type Stats = { total_santri: number; total_kas: number; total_tunggak: number };
type ChartPoint = { month: string; total: number };

const currency = (n: number | string) => {
  const v = typeof n === 'string' ? parseFloat(n) : n;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
};

function Dashboard() {
  const { props } = usePage();
  const stats: Stats = (props as any).stats || { total_santri: 0, total_kas: 0, total_tunggak: 0 };
  const chartData: ChartPoint[] = ((props as any).charts?.payments_last_6_months || []) as ChartPoint[];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 w-full">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Santri</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.total_santri}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Kas</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{currency(stats.total_kas)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Santri Menunggak</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.total_tunggak}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pembayaran 6 Bulan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ total: { label: 'Total Pembayaran', color: 'hsl(222.2 47.4% 11.2%)' } }}
              className="w-full"
            >
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
