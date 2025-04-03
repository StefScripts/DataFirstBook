import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // PHP-style variable
  const isHomePage = location === '/';

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle navigation click (closing mobile menu)
  const handleNavigationClick = () => {
    setMobileMenuOpen(false);
  };

  // Main domain URL for links back to PHP site
  const mainDomain = process.env.VITE_MAIN_DOMAIN || 'https://datafirstseo.com';

  // For cross-domain links
  const getFullUrl = (path: string) => {
    return path.startsWith('/book') || path.startsWith('/admin') || path.startsWith('/auth')
      ? path // Keep same-domain links as relative paths
      : `${mainDomain}${path}`; // Make other links absolute to PHP site
  };

  return (
    <nav id="navbar" className="sticky-nav px-6 py-4 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <a href={mainDomain} className="flex items-center">
          <div className="text-3xl font-bold">
            <span className="text-blue-600">Data</span>
            <span className="text-gray-800">First</span>
          </div>
        </a>

        <div className="hidden lg:flex space-x-8">
          <a href={`${mainDomain}/#services`} className="text-gray-800 hover:text-blue-600 font-medium transition-colors">
            Services
          </a>
          <a href={`${mainDomain}/#process`} className="text-gray-800 hover:text-blue-600 font-medium transition-colors">
            Process
          </a>
          <a href={`${mainDomain}/#about`} className="text-gray-800 hover:text-blue-600 font-medium transition-colors">
            About
          </a>
          <a href={`${mainDomain}/#contact`} className="text-gray-800 hover:text-blue-600 font-medium transition-colors">
            Contact
          </a>
          <a href={`${mainDomain}/#faq`} className="text-gray-800 hover:text-blue-600 font-medium transition-colors">
            FAQs
          </a>
        </div>

        <div className="hidden lg:block">
          {user ? (
            <Link href="/admin">
              <a className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors">Admin Dashboard</a>
            </Link>
          ) : (
            <Link href="/book">
              <a className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors">Get Free Consultation</a>
            </Link>
          )}
        </div>

        <button id="mobile-menu-button" className="lg:hidden text-gray-800" onClick={toggleMobileMenu}>
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={cn('lg:hidden bg-white absolute left-0 right-0 shadow-lg z-20', mobileMenuOpen ? '' : 'hidden')}>
        <div className="container mx-auto px-6 py-4 space-y-4">
          <a
            href={`${mainDomain}/#services`}
            className="block text-gray-800 hover:text-blue-600 font-medium transition-colors"
            onClick={handleNavigationClick}
          >
            Services
          </a>
          <a
            href={`${mainDomain}/#process`}
            className="block text-gray-800 hover:text-blue-600 font-medium transition-colors"
            onClick={handleNavigationClick}
          >
            Process
          </a>
          <a
            href={`${mainDomain}/#about`}
            className="block text-gray-800 hover:text-blue-600 font-medium transition-colors"
            onClick={handleNavigationClick}
          >
            About
          </a>
          <a
            href={`${mainDomain}/#contact`}
            className="block text-gray-800 hover:text-blue-600 font-medium transition-colors"
            onClick={handleNavigationClick}
          >
            Contact
          </a>
          <a
            href={`${mainDomain}/#faq`}
            className="block text-gray-800 hover:text-blue-600 font-medium transition-colors"
            onClick={handleNavigationClick}
          >
            FAQs
          </a>

          {user ? (
            <Link href="/admin">
              <a
                className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors text-center"
                onClick={handleNavigationClick}
              >
                Admin Dashboard
              </a>
            </Link>
          ) : (
            <Link href="/book">
              <a
                className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors text-center"
                onClick={handleNavigationClick}
              >
                Get Free Consultation
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
