import { getSiteData } from '@/lib/queries';
import PublicSite from '@/components/PublicSite';

export const revalidate = 0;

export default async function Home() {
  const data = await getSiteData();
  return <PublicSite {...data} />;
}
