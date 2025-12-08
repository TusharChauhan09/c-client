import { motion } from "motion/react";
import { 
  IconMapPin, 
  IconUsers, 
  IconSparkles, 
  IconRocket, 
  IconHeart,
  IconBrandGithub,
  IconBrandLinkedin
} from "@tabler/icons-react";

const stats = [
  { value: "50K+", label: "Happy Travelers" },
  { value: "120+", label: "Countries" },
  { value: "4.9", label: "App Rating" },
  { value: "24/7", label: "AI Support" },
];

const values = [
  {
    icon: IconSparkles,
    title: "Innovation First",
    description: "We leverage cutting-edge AI to revolutionize how you plan and experience travel."
  },
  {
    icon: IconHeart,
    title: "Traveler Focused",
    description: "Every feature is designed with your journey in mind, making travel planning effortless."
  },
  {
    icon: IconUsers,
    title: "Community Driven",
    description: "Join thousands of travelers sharing experiences and discovering hidden gems together."
  },
];

const team = [
  { name: "Alex Chen", role: "Founder & CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  { name: "Sarah Johnson", role: "Head of Product", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Mike Wilson", role: "Lead Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <IconRocket size={16} />
            Our Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Making Travel Planning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-500">
              Effortless
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We're on a mission to transform how people discover and experience the world. 
            Our AI-powered platform makes planning your dream trip as exciting as the journey itself.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-muted/30 border border-border"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">What We Believe In</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our core values guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Meet the Team</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The passionate people behind Travel Planner
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-background border border-border"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 bg-muted"
                />
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                <div className="flex justify-center gap-2">
                  <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                    <IconBrandLinkedin size={16} className="text-muted-foreground" />
                  </a>
                  <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                    <IconBrandGithub size={16} className="text-muted-foreground" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-emerald-500/10 to-teal-500/10 border border-primary/20"
        >
          <IconMapPin size={40} className="mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of travelers who are already discovering the world with AI-powered planning.
          </p>
          <a
            href="/travel-ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            <IconSparkles size={18} />
            Try Travel AI
          </a>
        </motion.div>
      </section>
    </div>
  );
}
