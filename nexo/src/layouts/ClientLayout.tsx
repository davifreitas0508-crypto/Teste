import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function ClientLayout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-1 flex-col bg-cream">
      <div className="flex-1 pb-2">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
