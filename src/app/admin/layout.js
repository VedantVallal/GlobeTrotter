import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'GlobeTrotter Admin — Travel Operations Console',
  description: 'Manage users, trips, destination catalog, activities, and growth analytics for GlobeTrotter.',
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
