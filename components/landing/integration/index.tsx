"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// --- Sub-Component: Terminal Window ---
const CodeWindow = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative rounded-xl border border-white/10 bg-[#0C0C0C] shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            index.html
          </div>
          <button
            onClick={copyToClipboard}
            className="text-[11px] font-medium text-gray-400 hover:text-white transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Code Area */}
        <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto">
          <pre className="text-gray-400">
            <code>
              <span className="text-emerald-400">{"<script"}</span>
              {"\n  "}
              <span className="text-blue-400">src</span>=
              <span className="text-amber-200">
                &quot;https://cdn.mrt-ai.io/widget.js&quot;
              </span>
              {"\n  "}
              <span className="text-blue-400">data-assistant-id</span>=
              <span className="text-amber-200">&quot;rim-corp-001&quot;</span>
              {"\n  "}
              <span className="text-blue-400">data-docs-url</span>=
              <span className="text-amber-200">
                &quot;https://docs.votre-entreprise.mr&quot;
              </span>
              <span className="text-emerald-400">{"\n></script>"}</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function IntegrationSection() {
  const steps = [
    {
      id: "01",
      title: "Scan Your Documentation",
      text: "The AI scans your knowledge base URL and learns your specific business context automatically.",
    },
    {
      id: "02",
      title: "Copy the Embed Snippet",
      text: "Paste a single line of code into your global header. No complex SDKs or npm installs required.",
    },
    {
      id: "03",
      title: "Auto-Resolve Tickets",
      text: "Instantly handle support queries in Hassanya, Arabic, or French without human intervention.",
    },
  ];

  return (
    <section className="bg-[#030303] py-32 px-6 text-white overflow-hidden">
      <div className="max-w-300 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-6">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">
                Drop In Simplicity
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                No complex SDKs, no syncing, and no heavy integrations. Just add
                our script tag and your AI assistant is live in seconds.
              </p>
            </motion.header>

            <div className="space-y-10">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex gap-6"
                >
                  <div className="shrink-0 text-sm font-mono text-emerald-500/50 mt-1">
                    {step.id}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Code Window */}
          <div className="lg:col-span-6 relative">
            {/* Visual layering: Floating elements behind the code window */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <CodeWindow
                code={`<script \n  src="https://oneminutesupport-io.mr/init.js"\n  data-assistant-id="your-id"\n  data-docs-url="https://yourdocs.com">\n</script>`}
              />

              {/* Context Label for Developers */}
              <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                  Compatible with:
                </span>
                <div className="flex gap-6 text-[11px] font-mono">
                  <span>NEXT.JS</span>
                  <span>WORDPRESS</span>
                  <span>SHOPIFY</span>
                  <span>HTML/JS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
