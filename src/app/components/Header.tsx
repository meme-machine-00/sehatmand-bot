"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const path = usePathname();
  return (
    <header className="bg-primary-100 p-4 border-accent-200 border-2 rounded-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/" className="text-accent-200 hover:text-text-200">
            sehatmand.ai
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/assistant" hidden={path === '/assistant'} className="text-text-200 font-bold hover:text-accent-200">
                Assistant
              </Link>
            </li>
            <li>
              <Link href="/dashboard" hidden={path !== '/assistant'} className="text-text-200 font-bold hover:text-accent-200">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;