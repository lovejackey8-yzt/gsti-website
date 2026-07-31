import type { Metadata } from 'next';
import AdminGate from '@/components/admin/AdminGate';

export const metadata: Metadata = {
  title: 'Not Found',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-night text-white">
      <AdminGate />
    </main>
  );
}
