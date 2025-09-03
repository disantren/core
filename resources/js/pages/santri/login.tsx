import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function SantriLogin() {
  const { props } = usePage();
  const errors = (props as any)?.errors || {};
  const [form, setForm] = useState({ identifier: '', password: '' });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.post('/santri/login', form);
  };

  return (
    <AuthLayout title="Login Santri" description="Masuk menggunakan NIS/NISN dan password">
      <Head title="Santri Login" />
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="identifier">NIS atau NISN</Label>
            <Input id="identifier" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} placeholder="Contoh: 1023" />
            {errors?.identifier && (
              <Alert variant="destructive"><AlertTitle>{errors.identifier}</AlertTitle></Alert>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            {errors?.password && (
              <Alert variant="destructive"><AlertTitle>{errors.password}</AlertTitle></Alert>
            )}
          </div>
          <Button type="submit">Masuk</Button>
        </div>
      </form>
    </AuthLayout>
  );
}

