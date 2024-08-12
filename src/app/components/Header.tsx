import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-primary-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/" className="text-accent-200 hover:text-text-200">
            sehatmand.ai
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard" className="text-text-200 hover:text-accent-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/assistant" className="text-text-200 hover:text-accent-200">
                Assistant
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;