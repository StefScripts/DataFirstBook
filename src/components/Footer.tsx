import { Link } from 'wouter';
import { Facebook, Linkedin, Mail, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Upper Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">DataFirst SEO</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Helping B2B companies transform their digital presence into a predictable source of revenue.
            </p>
          </div>
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-medium">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/book">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Book a Consultation</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
                </Link>
              </li>

              {/* <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                </Link>
              </li> */}
            </ul>
          </div>
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-medium">Contact Us</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <p>
                  #209-418 East Broadway
                  <br />
                  Vancouver, BC V5T 1X2
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="mailto:stefan@datafirstseo.com" className="hover:text-primary transition-colors">
                  stefan@datafirstseo.com
                </a>
              </div>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/DataFirstSEO"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://ca.linkedin.com/company/datafirstseo"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {currentYear} DataFirst SEO. All rights reserved.</p>
          <div className="flex gap-4 mb-4 sm:mb-0">
            <Link href="/terms">
              <a className="hover:text-primary transition-colors">Terms of Use</a>
            </Link>
            <Link href="/privacy-policy">
              <a className="hover:text-primary transition-colors">Privacy Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
