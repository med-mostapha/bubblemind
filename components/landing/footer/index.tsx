"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative bg-[#030303] pt-40 pb-10 px-6 overflow-hidden">
      {/* THE BIG BACKGROUND TEXT */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none">
        <h1 className="text-[15vw] font-black text-white/[0.02] leading-none tracking-tighter whitespace-nowrap">
          ONE MINUTE SUPPORT • ONE MINUTE SUPPORT
        </h1>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* SINGLE LINE CTA SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-20 border-b border-white/10 group">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-white"
          >
            Ready to automate?{" "}
            <span className="text-emerald-500">Let's talk.</span>
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 md:mt-0 px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-emerald-400 transition-colors duration-300"
          >
            Get Started
          </motion.button>
        </div>

        {/* CLEAN MINIMALIST NAV */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
              Mauritania
            </span>
            <p className="text-sm text-gray-400">
              Tevragh Zeina, Nouakchott
              <br />
              Available 24/7
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
              Inquiries
            </span>
            <p className="text-sm text-gray-400 hover:text-white cursor-pointer">
              hello@mrt-ai.io
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
              Legal
            </span>
            <p className="text-sm text-gray-400 hover:text-white cursor-pointer">
              Privacy & Terms
            </p>
          </div>

          <div className="flex justify-end items-end">
            <div className="text-right">
              <div className="text-2xl font-black italic text-white tracking-tighter">
                MRT.AI
              </div>
              <div className="text-[9px] text-gray-600 font-mono mt-1">
                EST. 2024 • NOUAKCHOTT
              </div>
            </div>
          </div>
        </div>

        {/* FINAL BOTTOM LINE */}
        <div className="flex justify-between items-center text-[10px] text-gray-700 font-medium tracking-widest pt-8 border-t border-white/[0.03]">
          <span>© 2024 ALL RIGHTS RESERVED</span>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">
              LINKEDIN
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              TWITTER
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Ambient Light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </footer>
  );
};

export default Footer;
