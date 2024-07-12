"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUsers, FiList, FiActivity } from 'react-icons/fi';

const Sidebar = () => {
  const router = useRouter();

  const navItems = [
    { href: '/user', label: 'Users', icon: FiUsers },
    { href: '/categories', label: 'Categories', icon: FiList },
    { href: '/activities', label: 'Activities', icon: FiActivity },
  ];

  return (
    <nav className="w-64 bg-white shadow-md">
      <ul className="p-4">
        {navItems.map((item) => (
          <li key={item.href} className="mb-4">
            <Link href={item.href} className={`flex items-center p-2 rounded ${router.pathname === item.href ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}>
                <item.icon className="mr-2" />
                {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
