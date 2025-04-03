import { Link, useLocation } from 'wouter';

export default function Footer() {
  const [location] = useLocation();
  const currentYear = new Date().getFullYear();

  // PHP-style variables
  const currentPage = location.startsWith('/terms') ? 'terms' : location.startsWith('/privacy') ? 'privacy' : '';

  // Main domain URL for links back to PHP site
  const mainDomain = process.env.VITE_MAIN_DOMAIN || 'https://datafirstseo.com';

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-12">
          <div className="col-span-1 lg:col-span-1">
            <div className="text-3xl font-bold mb-6">
              <span className="text-blue-400">Data</span>
              <span>First</span>
            </div>
            <p className="text-gray-400 mb-6">Helping B2B companies transform their digital presence into a predictable source of revenue.</p>
            <div className="flex space-x-4">
              <a
                href="https://ca.linkedin.com/company/datafirstseo"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://www.facebook.com/DataFirstSEO"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href={`${mainDomain}/#services`} className="text-gray-400 hover:text-white footer-link block">
                  Technical SEO
                </a>
              </li>
              <li>
                <a href={`${mainDomain}/#services`} className="text-gray-400 hover:text-white footer-link block">
                  Keyword Research
                </a>
              </li>
              <li>
                <a href={`${mainDomain}/#services`} className="text-gray-400 hover:text-white footer-link block">
                  Content Strategy
                </a>
              </li>
              <li>
                <a href={`${mainDomain}/#services`} className="text-gray-400 hover:text-white footer-link block">
                  On-Page Optimization
                </a>
              </li>
              <li>
                <a href={`${mainDomain}/#services`} className="text-gray-400 hover:text-white footer-link block">
                  Link Building
                </a>
              </li>
              <li>
                <a href={`${mainDomain}/#services`} className="text-gray-400 hover:text-white footer-link block">
                  Analytics & Reporting
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href={`${mainDomain}/blog.php`} className="text-gray-400 hover:text-white footer-link block">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white footer-link block">
                  Guides & Ebooks
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white footer-link block">
                  SEO Calculator
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white footer-link block">
                  Industry Reports
                </a>
              </li>
              <li>
                <Link href="/book">
                  <a className="text-gray-400 hover:text-white footer-link block">Book a Consultation</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>
                  #209-418 East Broadway
                  <br />
                  Vancouver, BC V5T 1X2
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3"></i>
                <a href="mailto:stefan@datafirstseo.com" className="hover:text-white transition-colors">
                  stefan@datafirstseo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">&copy; {currentYear} DataFirst SEO. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href={`${mainDomain}/terms-of-service.php`}
              className={`text-sm ${currentPage === 'terms' ? 'text-white hover:text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              Terms of Service
            </a>
            <a
              href={`${mainDomain}/privacy-policy.php`}
              className={`text-sm ${currentPage === 'privacy' ? 'text-white hover:text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
