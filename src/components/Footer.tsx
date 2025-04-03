// import { Link } from 'wouter';
// import { Facebook, Linkedin, Mail, MapPin } from 'lucide-react';
// import { Separator } from '@/components/ui/separator';

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-muted">
//       <div className="container mx-auto px-4 py-12">
//         {/* Upper Footer */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Company Info */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <MapPin className="h-6 w-6 text-primary" />
//               <span className="text-xl font-bold">DataFirst SEO</span>
//             </div>
//             <p className="text-muted-foreground max-w-xs">
//               Helping B2B companies transform their digital presence into a predictable source of revenue.
//             </p>
//           </div>
//           {/* Quick Links */}
//           <div className="space-y-4">
//             <h4 className="text-base font-medium">Quick Links</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/book">
//                   <a className="text-muted-foreground hover:text-primary transition-colors">Book a Consultation</a>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/blog">
//                   <a className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contact">
//                   <a className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
//                 </Link>
//               </li>

//               {/* <li>
//                 <Link href="/terms">
//                   <a className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</a>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/privacy-policy">
//                   <a className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
//                 </Link>
//               </li> */}
//             </ul>
//           </div>
//           {/* Contact Info */}
//           <div className="space-y-4">
//             <h4 className="text-base font-medium">Contact Us</h4>
//             <div className="space-y-2 text-muted-foreground">
//               <div className="flex items-start gap-2">
//                 <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
//                 <p>
//                   #209-418 East Broadway
//                   <br />
//                   Vancouver, BC V5T 1X2
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
//                 <a href="mailto:stefan@datafirstseo.com" className="hover:text-primary transition-colors">
//                   stefan@datafirstseo.com
//                 </a>
//               </div>
//               <div className="flex gap-4">
//                 <a
//                   href="https://www.facebook.com/DataFirstSEO"
//                   target="_blank"
//                   rel="noopener noreferrer nofollow"
//                   className="hover:text-primary transition-colors"
//                   aria-label="Facebook"
//                 >
//                   <Facebook className="h-5 w-5" />
//                 </a>
//                 <a
//                   href="https://ca.linkedin.com/company/datafirstseo"
//                   target="_blank"
//                   rel="noopener noreferrer nofollow"
//                   className="hover:text-primary transition-colors"
//                   aria-label="LinkedIn"
//                 >
//                   <Linkedin className="h-5 w-5" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Separator className="my-8" />

//         {/* Bottom Footer */}
//         <div className="flex flex-col-reverse sm:flex-row justify-between items-center text-xs text-muted-foreground">
//           <p>© {currentYear} DataFirst SEO. All rights reserved.</p>
//           <div className="flex gap-4 mb-4 sm:mb-0">
//             <Link href="/terms">
//               <a className="hover:text-primary transition-colors">Terms of Use</a>
//             </Link>
//             <Link href="/privacy-policy">
//               <a className="hover:text-primary transition-colors">Privacy Policy</a>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { Link } from 'wouter';
import { Facebook, Linkedin, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // For simplicity in the React version, we'll assume we're not on the homepage
  const isHomePage = false;

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-12">
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <span className="text-blue-400 text-3xl font-bold">DataFirst</span>
              <span className="text-sm"> </span>
              <span className="text-3xl">SEO</span>
            </div>
            <p className="text-gray-400 mb-6">Helping B2B companies transform their digital presence into a predictable source of revenue.</p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://book.datafirstseo.com" className="text-gray-400 hover:text-white footer-link block">
                  Book a Free Consultation
                </a>
              </li>
              <li>
                <a href="https://datafirstseo.com/index.php#services" className="text-gray-400 hover:text-white footer-link block">
                  SEO Services
                </a>
              </li>
              <li>
                <a href="https://datafirstseo.com/index.php#process" className="text-gray-400 hover:text-white footer-link block">
                  Our Process
                </a>
              </li>
              <li>
                <a href="https://datafirstseo.com/index.php#about" className="text-gray-400 hover:text-white footer-link block">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://datafirstseo.com/index.php#faq" className="text-gray-400 hover:text-white footer-link block">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="https://datafirstseo.com/contact.php" className="text-gray-400 hover:text-white footer-link block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white footer-link block">Technical SEO</li>
              <li className="text-gray-400 hover:text-white footer-link block">Keyword Research</li>
              <li className="text-gray-400 hover:text-white footer-link block">Content Strategy</li>
              <li className="text-gray-400 hover:text-white footer-link block">On-Page Optimization</li>
              <li className="text-gray-400 hover:text-white footer-link block">Link Building</li>
              <li className="text-gray-400 hover:text-white footer-link block">Analytics & Reporting</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3" />
                <span>
                  209-418 East Broadway
                  <br />
                  Vancouver, BC V5T 1X2
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-3" />
                <a href="mailto:stefan@datafirstseo.com" className="hover:text-white transition-colors">
                  stefan@datafirstseo.com
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 py-6">
              <a
                href="https://ca.linkedin.com/company/datafirstseo"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/DataFirstSEO"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">&copy; {currentYear} DataFirst SEO. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="https://datafirstseo.com/terms-of-service.php" className="text-gray-400 hover:text-white footer-link block">
              Terms of Service
            </a>
            <a href="https://datafirstseo.com/privacy-policy.php" className="text-gray-400 hover:text-white footer-link block">
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
