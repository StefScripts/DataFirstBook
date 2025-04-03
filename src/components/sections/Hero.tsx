import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

export default function Hero() {
  const benefits = ['Increase new website visitors', 'Convert more high-value contracts', 'Outrank your competitors consistently'];

  return (
    <section className="hero-section relative overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <div className="w-96 h-96 rounded-full bg-primary/30 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-5">
        <div className="w-80 h-80 rounded-full bg-primary/30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gradient mb-4">Transform Your B2B Revenue Through Strategic SEO</h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Stop losing high-value contracts to competitors, and stop wasting time with cookie-cutter SEO tactics.
            </p>

            <div className="mt-8 space-y-4">
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/book">
                  <Button size="lg" className="group">
                    Get Your Custom Growth Plan
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Card className="relative overflow-hidden rounded-xl border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/10 opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                alt="B2B Growth Analytics Dashboard"
                className="w-full h-auto rounded-lg shadow-lg transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
