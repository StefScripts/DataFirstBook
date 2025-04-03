import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/sections/ContactForm';
import Services from '@/components/sections/ServicesNew';
import Metadata from '@/components/Metadata';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Metadata
        title="DataFirst SEO | Data-Driven SEO Services Vancouver"
        description="Transform your B2B company's digital presence into a predictable source of revenue with DataFirst SEO's strategic search engine optimization services."
        keywords="DataFirst SEO, DataFirstSEO, Data First SEO, B2B SEO, SEO services"
        canonicalUrl="https://datafirstseo.com"
      />
      <Hero />
      <Services />
      <ContactForm />
    </div>
  );
}
