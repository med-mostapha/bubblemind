"use client";

import React from "react";
import { motion } from "framer-motion";

// --- Assets: Define the Partners ---
const PARTNERS = [
  {
    name: "SNIM",
    label: "National Industrial & Mining Co.",
    logo: "https://upload.wikimedia.org/wikipedia/fr/0/02/Logo_SNIM.png"
  },
  {
    name: "SOMELEC",
    label: "National Electricity Company",
    logo: "https://www.somelec.mr/sites/default/files/logo_0.png"
  },
  {
    name: "BCM",
    label: "Central Bank of Mauritania",
    logo: "https://www.bcm.mr/logo.png"
  },
  {
    name: "APIM",
    label: "Investment Promotion Agency",
    logo: "https://apim.gov.mr/wp-content/uploads/2021/05/logo-apim.png"
  },
  {
    name: "Mauritel",
    label: "Mauritel SA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mauritel_logo.svg/1200px-Mauritel_logo.svg.png"
  }
];

export default function SocialProofSection() {
  return (
    <section className="relative w-full py-24 bg-[#030303] border-y border-white/5">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-20" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left: Authority Statement */}
          <div className="lg:w-1/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold tracking-widest uppercase"
            >
              <span className="w-8 h-[1px] bg-emerald-500" />
              Institutional Trust
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-white leading-tight"
            >
              The AI Backbone for Mauritania's{" "}
              <span className="text-gray-500">Leading Institutions.</span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-sm leading-relaxed"
            >
              From banking compliance to industrial automation, our platform is
              engineered to meet the security and linguistic standards of the
              country's largest entities.
            </motion.p>
          </div>

          {/* Right: Modern Logo Mosaic */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {PARTNERS.map((partner, idx) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#080808] p-8 flex flex-col items-center justify-center group hover:bg-[#0A0A0A] transition-colors duration-500"
              >
                {/* Logo Placeholder - Since remote images might fail, we use a styled text logo that feels premium */}
                <div className="h-12 flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-xl font-black tracking-tighter text-white">
                    {partner.name}
                  </span>
                </div>
                <span className="mt-4 text-[10px] text-gray-600 font-medium uppercase tracking-widest text-center group-hover:text-emerald-500 transition-colors">
                  {partner.label}
                </span>
              </motion.div>
            ))}

            {/* CTA Box inside the mosaic */}
            <div className="bg-emerald-500/5 p-8 flex flex-col items-center justify-center border-l border-white/5">
              <span className="text-emerald-400 font-bold text-xl leading-none">
                99.9%
              </span>
              <span className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-tighter mt-2">
                Uptime Secure
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center md:justify-between gap-8"
        >
          <div className="flex flex-col">
            <span className="text-white font-bold">Compliant</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              Mauritanian Data Laws
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold">Certified</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              Secure Cloud Gateway
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold">24/7 Support</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              Localized HQ Nouakchott
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
