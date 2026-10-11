import { redirect } from 'next/navigation';

const AdminIndex = () => {
  redirect('/admin/Dashboard');
};

export default AdminIndex;