import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Website URL constant
const WEBSITE_URL = 'https://datafirstseo.com';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll detection for navigation styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="navbar" className={cn('sticky top-0 z-50 w-full px-6 py-4', scrolled ? 'bg-white shadow-lg' : 'bg-transparent')}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo as an external link */}
        <a href={WEBSITE_URL} className="flex items-center">
          <div>
            <span className="text-gray-800 text-3xl font-bold">DataFirst</span>
            <span className="text-sm"> </span>
            <span className="text-blue-600 text-3xl">SEO</span>
          </div>
        </a>
      </div>
    </nav>
  );
}
