import { Link } from "react-router-dom";
import { Shield, FileCheck, UserCheck, Eye, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileCheck,
      title: "Document Verification",
      description: "We verify all property documents including ownership papers, registration, and legal clearances.",
      points: 25,
    },
    {
      icon: UserCheck,
      title: "Owner Verification",
      description: "Property owner's identity is verified through government ID and personal verification calls.",
      points: 25,
    },
    {
      icon: Eye,
      title: "Property Inspection",
      description: "Our team physically visits and inspects each property to verify amenities and living conditions.",
      points: 30,
    },
    {
      icon: Shield,
      title: "Safety Certification",
      description: "Properties are checked for fire safety, security measures, and emergency protocols.",
      points: 20,
    },
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Our Trust System</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We Verify Properties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlike reviews that can be biased or fake, our multi-step verification process ensures every property meets our quality standards.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="bg-card rounded-xl p-6 border hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-2xl font-bold text-accent">+{step.points}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Score Explanation */}
        <div className="mt-12 bg-card rounded-2xl p-8 border">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="font-heading text-2xl font-bold mb-4">
                Trust Score = Complete Transparency
              </h3>
              <p className="text-muted-foreground mb-4">
                Every property gets a Trust Score out of 100, calculated from our verification steps. 
                A higher score means more verifications completed, giving you confidence in your booking decision.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-green-500 text-sm font-bold flex items-center justify-center text-primary-foreground">
                    80+
                  </div>
                  <span className="text-sm">Highly Trusted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-emerald-500 text-sm font-bold flex items-center justify-center text-primary-foreground">
                    60+
                  </div>
                  <span className="text-sm">Trusted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-amber-500 text-sm font-bold flex items-center justify-center text-primary-foreground">
                    40+
                  </div>
                  <span className="text-sm">Verified</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link to="/properties?verified=true">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  View Verified Properties
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
