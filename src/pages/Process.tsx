import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LineChart, Users, BarChart, Search, Target, Globe } from "lucide-react";

const processSteps = [
  {
    step: 1,
    icon: Search,
    title: "Strategic Analysis & Market Gap Discovery",
    description: "We begin by analyzing your current market position and identifying untapped opportunities in your industry.",
    details: [
      "Comprehensive competitor analysis and market positioning",
      "Identification of high-value search terms your competitors are missing",
      "Technical audit of your current digital presence",
      "Development of a custom 12-month growth roadmap"
    ],
    timeline: "Weeks 1-2",
    outcome: "Clear roadmap to capture market share from competitors"
  },
  {
    step: 2,
    icon: Target,
    title: "Authority Content Development",
    description: "Position your company as the go-to authority in your industry with expert-level content.",
    details: [
      "Creation of in-depth technical content that showcases your expertise",
      "Development of decision-maker focused resources",
      "Implementation of content clusters that establish topical authority",
      "Strategic content distribution to reach B2B decision makers"
    ],
    timeline: "Months 1-3",
    outcome: "Establish thought leadership in your industry"
  },
  {
    step: 3,
    icon: LineChart,
    title: "Technical Excellence Implementation",
    description: "Optimize your website's infrastructure to ensure maximum visibility to B2B buyers.",
    details: [
      "Implementation of enterprise-grade technical SEO architecture",
      "Enhancement of site speed and performance metrics",
      "Structured data implementation for rich search results",
      "Mobile optimization for B2B users"
    ],
    timeline: "Months 1-2",
    outcome: "Superior technical foundation for sustained growth"
  },
  {
    step: 4,
    icon: BarChart,
    title: "Lead Generation Optimization",
    description: "Convert more visitors into qualified leads through optimized conversion funnels.",
    details: [
      "Implementation of B2B-specific conversion tracking",
      "Creation of high-converting landing pages for each service",
      "Setup of marketing automation workflows",
      "A/B testing of conversion elements"
    ],
    timeline: "Months 2-4",
    outcome: "Increased conversion of qualified B2B leads"
  },
  {
    step: 5,
    icon: Users,
    title: "Industry Authority Building",
    description: "Establish your brand through strategic partnerships and industry recognition.",
    details: [
      "Development of strategic partnership programs",
      "Placement in industry-leading publications",
      "Creation of authoritative research reports",
      "Implementation of digital PR campaigns"
    ],
    timeline: "Months 3-6",
    outcome: "Recognized authority status in your industry"
  },
  {
    step: 6,
    icon: Globe,
    title: "Market Share Expansion",
    description: "Scale your digital presence to capture regional and global opportunities.",
    details: [
      "Geographic market expansion planning",
      "Multi-location SEO implementation",
      "International market optimization",
      "Ongoing growth optimization"
    ],
    timeline: "Months 6-12",
    outcome: "Sustained market leadership and growth"
  }
];

export default function Process() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Your Path to B2B Market Leadership</h1>
          <p className="text-xl text-muted-foreground">
            Our proven six-step process transforms your digital presence into a predictable source of B2B revenue. Here's exactly how we'll get you there.
          </p>
        </div>

        <div className="space-y-12">
          {processSteps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/10" />
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">Step {step.step}</Badge>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">What We'll Do:</h3>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Timeline:</h3>
                      <p className="text-muted-foreground">{step.timeline}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Expected Outcome:</h3>
                      <p className="text-muted-foreground">{step.outcome}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
