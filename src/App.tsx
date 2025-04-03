import { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/lib/protected-route';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Book from '@/pages/Book';
import Admin from '@/pages/Admin';
import AuthPage from '@/pages/auth';
import ResetPasswordPage from '@/pages/reset-password';
import ManageBooking from '@/pages/ManageBooking';

// import NotFound from './pages/not-found';

import '@fortawesome/fontawesome-free/css/all.min.css';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Book} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <ProtectedRoute path="/admin" component={Admin} />
      <Route path="/booking/confirm/:token" component={ManageBooking} />
      <Route path="/booking/manage/:token" component={ManageBooking} />
      {/* <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} /> */}
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Register the service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }

    // Set default metadata
    setupDefaultMetadata();
  }, []);

  // Setup default metadata for the site
  const setupDefaultMetadata = () => {
    // Default title (will be overridden by page-specific titles)
    document.title = 'Book a Consultation - DataFirst SEO';

    // Create meta description if it doesn't exist
    if (!document.querySelector('meta[name="description"]')) {
      const metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', "Book a consultation with DataFirst SEO to improve your B2B company's search visibility.");
      document.head.appendChild(metaDescription);
    }

    // Create viewport meta tag if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }

    // Set favicon if it doesn't exist
    if (!document.querySelector('link[rel="icon"]')) {
      const favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      favicon.setAttribute('href', '/favicon.ico');
      document.head.appendChild(favicon);
    }

    // Set default Open Graph tags
    setupMetaTag('property', 'og:site_name', 'DataFirst SEO');
    setupMetaTag('property', 'og:type', 'website');
  };

  // Helper function to create meta tags
  const setupMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attributeName, attributeValue);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
