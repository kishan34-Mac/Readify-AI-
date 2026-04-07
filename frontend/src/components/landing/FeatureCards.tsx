import { motion } from "framer-motion";
import { Upload, Cpu, Github, History } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Folder",
    description: "Drag & drop your entire project. We analyze every file to understand your codebase.",
  },
  {
    icon: Cpu,
    title: "AI Generation",
    description: "Our AI reads your code structure, dependencies, and patterns to generate perfect docs.",
  },
  {
    icon: Github,
    title: "GitHub Auto Push",
    description: "Push your README directly to any repository with a single click. Zero friction.",
  },
  {
    icon: History,
    title: "Version History",
    description: "Track every version of your README. Compare, revert, and iterate with confidence.",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to <span className="gradient-text">ship docs fast</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From upload to push — the entire workflow in one place.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-xl p-6 group cursor-default"
            >
              <div className="gradient-primary rounded-lg p-2.5 w-fit mb-4 group-hover:glow-primary transition-shadow duration-300">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
