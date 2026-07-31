import { getSiteData } from '@/lib/queries';
import AdminDashboard from '@/components/AdminDashboard';

export const revalidate = 0;

export default async function DashboardPage() {
  const data = await getSiteData();
  return <AdminDashboard initial={data} />;
}
