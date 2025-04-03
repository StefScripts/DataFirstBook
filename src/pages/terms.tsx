import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import Metadata from '@/components/Metadata';

export default function TermsOfUse() {
  return (
    <div>
      <main className="min-h-screen py-20">
        <Metadata
          title="Terms of Use | DataFirst SEO"
          description="Learn about the terms and conditions of using DataFirst SEO's website and services."
          keywords=""
          canonicalUrl="https://datafirstseo.com/terms"
        />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

            <Card className="mb-8">
              <CardContent className="pt-6 prose prose-slate max-w-none">
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.</p>

                <h3>2. Services</h3>
                <p>
                  DataFirst SEO provides B2B SEO consulting and optimization services. We reserve the right to modify or discontinue any service at
                  any time.
                </p>

                <h3>3. User Conduct</h3>
                <p>
                  You agree to use our website and services for lawful purposes only and in a way that does not infringe upon or restrict others' use
                  and enjoyment. This includes but is not limited to:
                </p>
                <ul>
                  <li>Provide accurate information when contacting us.</li>
                  <li>Avoid unauthorized use of Site content, including copying text, images, or code.</li>
                  <li>Refrain from harmful activities (e.g., hacking, spamming).</li>
                </ul>

                <h3>4. Intellectual Property</h3>
                <p>
                  All content on this website, including text, graphics, logos, and images, is the property of DataFirst SEO and protected by
                  copyright laws.
                </p>

                <h3>5. Limitation of Liability</h3>
                <p>
                  DataFirst SEO shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or
                  inability to use our services.
                </p>

                <h3>6. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these terms at any time. Your continued use of the website constitutes acceptance of any changes.
                </p>

                <h3>7. Governing Law</h3>
                <p>These Terms are governed by British Columbia and Canadian federal laws. Disputes will be resolved in BC courts.</p>

                <h3>8. Contact Information</h3>
                <p>For questions about these Terms of Use, please contact us at stefan@datafirstseo.com.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
