import { useEffect } from 'react';

interface MetadataProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  keywords?: string;
  noindex?: boolean;
}

/**
 * Component to manage page metadata
 * Use this component within each page to set appropriate SEO tags
 */
export default function Metadata({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage = 'https://datafirstseo.com/og-image.png', // Default OG image
  ogUrl,
  canonicalUrl,
  keywords,
  noindex = false
}: MetadataProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | DataFirst SEO`;

    // Find or create meta description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Open Graph tags
    updateMetaTag('property', 'og:title', ogTitle || title);
    updateMetaTag('property', 'og:description', ogDescription || description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', ogUrl || window.location.href);
    updateMetaTag('property', 'og:type', 'website');

    // Additional SEO tags
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // Canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    } else if (canonicalTag) {
      canonicalTag.remove();
    }

    // Robots tag for noindex
    if (noindex) {
      updateMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      updateMetaTag('name', 'robots', 'index, follow');
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'DataFirst SEO';
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, keywords, noindex]);

  // Helper function to update or create meta tags
  function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
    let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attributeName, attributeValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  // This component doesn't render anything
  return null;
}
