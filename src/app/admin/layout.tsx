'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Users, UserCircle, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' && pathname !== '/admin/login') {
    router.push('/admin/login');
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Calendar },
    { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar }, 
    { name: 'Patients', href: '/admin/patients', icon: UserCircle },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  if (!session && pathname !== '/admin/login') {
    return null;
  }

  const userEmail = session?.user?.email ?? 'Admin User';

  return (
    <div className="mt-16 bg-gray-50">
      {/* Admin Navigation Bar */}
      <nav className="bg-sky-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-white mr-4">Welcome, {userEmail}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-white hover:text-sky-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex bg-gray-50">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg min-h-[calc(100vh-8rem)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-sky-500 text-white'
                      : 'text-gray-700 hover:bg-sky-50'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-sky-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}