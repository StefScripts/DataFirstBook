import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import Metadata from '@/components/Metadata';

export default function PrivacyPolicy() {
  return (
    <div>
      <main className="min-h-screen py-20">
        <Metadata
          title="Privacy Policy | DataFirst SEO"
          description="Learn how DataFirst SEO collects, uses, and protects your personal information when you visit our website or use our SEO services."
          keywords=""
          canonicalUrl="https://datafirstseo.com/privacy-policy"
        />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

            <Card className="mb-8">
              <CardContent className="pt-6 prose prose-slate max-w-none">
                <h4>Your Privacy Matters</h4>
                <p>
                  DataFirst SEO is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard
                  your personal information when you visit our website datafirstseo.com or engage with our SEO services. By using our website, you
                  consent to the practices described herein.
                </p>
                <h3>1. Information We Collect</h3>
                <p>
                  We collect information you provide directly to us, including name, email, company name, and any messages you send through our
                  contact or booking forms.
                </p>

                <h3>2. Use of Information</h3>
                <p>
                  We use the information we collect to provide and improve our services, communicate with you, and send you marketing materials (with
                  your consent).
                </p>

                <h3>3. Information Sharing</h3>
                <p>
                  We do not sell or share your personal information with third parties except as necessary to provide our services or as required by
                  law.
                </p>

                <h3>4. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>

                <h3>5. Cookies</h3>
                <p>We use cookies and similar technologies to analyze website traffic and improve your browsing experience.</p>

                <h3>6. Your Rights</h3>
                <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>

                <h3>7. Contact Us</h3>
                <p>For privacy-related inquiries, please contact us at stefan@datafirstseo.com.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
