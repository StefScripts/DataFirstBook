import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ServiceItem {
  title: string;
  items: string[];
  icon: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    title: 'Technical SEO Audits & Implementation',
    icon: '⚙️',
    description: 'Identify and fix technical issues preventing your site from reaching its full potential.',
    items: [
      'Fix site structure issues that hide your best content from search results',
      'Implement structured data that helps search engines understand your business offerings',
      'Ensure no website errors are negatively impacting user experience and search rankings'
    ]
  },
  {
    title: 'Strategic Keyword Research & Targeting',
    icon: '🔍',
    description: 'Discover the exact terms your B2B customers use when searching for solutions.',
    items: [
      'Discover the exact terms your potential B2B customers use when searching for solutions',
      "Analyze what keywords are working for your competitors (and where they're missing opportunities)",
      'Map keywords to different stages of your sales funnel, from awareness to decision',
      'Identify specialized long-tail terms with less competition but higher conversion potential'
    ]
  },
  {
    title: 'Content Strategy & Creation',
    icon: '📝',
    description: 'Build authoritative content that establishes your company as the industry expert.',
    items: [
      'Identify content gaps where competitors are winning business you should be getting',
      'Develop authoritative content that positions your company as the go-to expert in your field',
      'Create in-depth resources like white papers and case studies that support complex B2B decisions',
      'Build thought leadership content that gets shared among industry decision-makers'
    ]
  },
  {
    title: 'On-Page SEO Optimization',
    icon: '📊',
    description: 'Optimize your pages to maximize relevance and conversion potential.',
    items: [
      'Craft compelling meta titles and descriptions that increase click-through rates from search results',
      'Optimize page content to clearly signal relevance for your target keywords',
      'Develop strategic internal linking to guide visitors through your most valuable content',
      'Enhance page elements to convert more visitors into qualified leads'
    ]
  },
  {
    title: 'Link Building & Authority Development',
    icon: '🔗',
    description: 'Earn quality backlinks that establish your domain authority and credibility.',
    items: [
      'Earn quality backlinks from respected industry websites your prospects actually visit',
      'Generate digital PR opportunities that put your business in front of the right audiences',
      'Secure guest posting opportunities on trusted B2B publications in your sector',
      'Monitor and capitalize on unlinked brand mentions across the web'
    ]
  },
  {
    title: 'Analytics & Reporting',
    icon: '📈',
    description: 'Track real ROI metrics and make data-driven optimization decisions.',
    items: [
      'Build custom dashboards showing the metrics that actually matter to your business',
      'Track and report on real ROI, not just rankings or traffic numbers',
      'Benchmark your performance against key competitors in your space',
      'Provide regular, jargon-free reviews that tie SEO performance to business outcomes'
    ]
  }
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive B2B SEO Solutions</h2>
          <p className="text-muted-foreground text-lg">
            Tailored strategies designed specifically for B2B companies looking to drive high-value leads and revenue
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card
                className={cn(
                  'h-full group transition-all duration-300 hover:shadow-lg border-primary/5 overflow-hidden',
                  hoveredIndex === index ? 'border-primary/20' : ''
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="mb-4 text-4xl">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-3 mt-2 flex-grow">
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start group/item">
                        <span className="bg-primary/10 p-1 rounded-full flex-shrink-0 mr-2 mt-0.5 ">
                          <Check className="h-3 w-3 text-primary flex-shrink-0" />
                        </span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
