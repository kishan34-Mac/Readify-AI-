import { motion } from "framer-motion";

export function DemoPreview() {
  return (
    <section id="demo" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See it <span className="gradient-text">in action</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl overflow-hidden border border-border/50">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">readme-editor.tsx</span>
            </div>

            {/* Editor mock */}
            <div className="grid md:grid-cols-2 divide-x divide-border/30">
              {/* Markdown side */}
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="text-neon-purple"># My Awesome Project</div>
                <div className="text-muted-foreground mt-2">&gt; A blazing-fast CLI tool for developers</div>
                <div className="text-neon-cyan mt-4">## Installation</div>
                <div className="text-muted-foreground mt-1">```bash</div>
                <div className="text-foreground">npm install my-awesome-project</div>
                <div className="text-muted-foreground">```</div>
                <div className="text-neon-cyan mt-4">## Usage</div>
                <div className="text-muted-foreground mt-1">```typescript</div>
                <div className="text-foreground">import {"{ awesome }"} from 'my-project';</div>
                <div className="text-foreground">awesome.init();</div>
                <div className="text-muted-foreground">```</div>
              </div>

              {/* Preview side */}
              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-bold text-foreground">My Awesome Project</h3>
                <blockquote className="border-l-2 border-neon-purple/50 pl-3 text-muted-foreground italic text-sm">
                  A blazing-fast CLI tool for developers
                </blockquote>
                <h4 className="text-lg font-semibold text-foreground mt-4">Installation</h4>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-sm text-foreground">
                  npm install my-awesome-project
                </div>
                <h4 className="text-lg font-semibold text-foreground mt-4">Usage</h4>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-sm text-foreground">
                  <div>import {"{ awesome }"} from 'my-project';</div>
                  <div>awesome.init();</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
