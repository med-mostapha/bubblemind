"use client";

import React from "react";
import { motion } from "framer-motion";

// --- Utility for Tailwind Class Merging ---
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// --- Sub-Component: Chat Preview ---
// This mimics a high-end AI interface with local Mauritanian context.
const ChatPreview = () => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="relative group/chat"
    Wall-of-text-avoidance-layer
  >
    <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden max-w-[320px] ml-auto transform rotate-2 group-hover/chat:rotate-0 transition-transform duration-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">
          AI Assistant • Live
        </span>
      </div>

      {/* Messages */}
      <div className="p-5 space-y-4 text-[13px] leading-relaxed">
        <div className="flex justify-end">
          <div className="bg-emerald-500/10 text-emerald-100 px-4 py-2 rounded-2xl rounded-tr-none border border-emerald-500/20">
            Offrez-vous la livraison à Nouakchott ?
          </div>
        </div>

        <div className="flex justify-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex-shrink-0" />
          <div className="bg-white/5 text-gray-300 px-4 py-2 rounded-2xl rounded-tl-none border border-white/10">
            Oui, nous livrons partout à{" "}
            <span className="text-white font-medium">Nouakchott</span>, y
            compris Tevragh Zeina et Dar Naim.
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Sub-Component: Feature Card ---
const FeatureCard = ({
  title,
  description,
  children,
  variant = "small",
  className = ""
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  variant?: "small" | "medium" | "large";
  className?: string;
}) => (
  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={cn(
      "relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] p-8 md:p-10 flex flex-col justify-between group",
      variant === "large" && "md:col-span-7 min-h-[540px]",
      variant === "medium" && "md:col-span-8 min-h-[380px]",
      variant === "small" && "md:col-span-4 min-h-[320px]",
      variant === "side" && "md:col-span-5 min-h-[260px]", // specific for the right stack
      className
    )}
  >
    {/* Background Glow */}
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors duration-700" />

    <div className="relative z-10">
      <h3 className="text-2xl font-bold tracking-tight text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-400 text-base leading-relaxed max-w-[320px]">
        {description}
      </p>
    </div>

    {children && <div className="relative z-10 mt-6">{children}</div>}

    {/* Subtle Glass Border Effect */}
    <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none" />
  </motion.div>
);

// --- Main Component: FeaturesSection ---
export default function FeaturesSection() {
  return (
    <section className="relative w-full py-32 px-6 bg-[#030303] text-white overflow-hidden">
      {/* Background Depth Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]"
          >
            Built for the modern <br />
            <span className="text-gray-500">Mauritanian enterprise.</span>
          </motion.h2>
        </header>

        {/* The Grid: Editorial Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Large Card */}
          <FeatureCard
            variant="large"
            title="Multilingual Communication"
            description="Bridge the gap with your customers using AI that speaks Arabic, French, English, and local dialects fluently."
          >
            <ChatPreview />
          </FeatureCard>

          {/* Right Stack (Side Cards) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <FeatureCard
              variant="side"
              className="h-full"
              title="WhatsApp Automation"
              description="Deploy your AI directly where your customers are. Fully integrated with the WhatsApp Business API."
            />
            <FeatureCard
              variant="side"
              className="h-full"
              title="Knowledge Assistant"
              description="Feed the AI your internal manuals and let it handle technical support instantly."
            />
          </div>

          {/* Bottom Row */}
          <FeatureCard
            variant="small"
            title="Business Process Automation"
            description="From booking appointments to verifying orders, automate the repetitive tasks."
          />

          <FeatureCard
            variant="medium"
            title="Analytics & Deep Insights"
            description="Visualize trends in customer queries to stay ahead of market demands in Nouakchott and beyond."
          >
            {/* Visual element for analytics */}
            <div className="mt-4 flex gap-2 items-end h-16">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-500/5 rounded-t-sm"
                />
              ))}
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
