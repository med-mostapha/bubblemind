"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    id: "name",
    question: "Business Name",
    field: "businessName",
    placeholder: "e.g. SNIM"
  },
  {
    id: "website",
    question: "Website URL",
    field: "websiteUrl",
    placeholder: "https://votre-entreprise.mr"
  },
  {
    id: "links",
    question: "External Links",
    field: "externaleLinks",
    placeholder: "Social media or PDF docs..."
  }
];

export default function HighVisibilityOnboarding() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    websiteUrl: "",
    externaleLinks: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [step, isSubmitting]);

  // --- SUBMISSION HANDLER ---
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const response = await fetch("/api/metadata/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name: formData.businessName,
        website_url: formData.websiteUrl,
        external_links: formData.externaleLinks
      })
    });

    await response.json();
    setIsSubmitting(false);
    window.location.reload();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="fixed inset-0 bg-[#030303] text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* --- PROGRESS SECTION --- */}
      <div className="fixed top-0 left-0 w-full z-[100]">
        <div className="w-full h-[3px] bg-white/5" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isSubmitting ? "100%" : `${progress}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="absolute top-0 left-0 h-[3px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"
        />
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitting ? (
          /* --- MAIN FORM ENGINE --- */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl px-10"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === STEPS.length - 1) {
                  handleSubmit();
                } else {
                  setStep((prev) => prev + 1);
                }
              }}
              className="w-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center space-y-12"
                >
                  <div className="space-y-3 text-center">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">
                      Onboarding Phase
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic">
                      {STEPS[step].question}
                    </h2>
                  </div>

                  <div className="w-full relative group">
                    <input
                      ref={inputRef}
                      type="text"
                      autoComplete="off"
                      placeholder={STEPS[step].placeholder}
                      value={(formData as any)[STEPS[step].field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [STEPS[step].field]: e.target.value
                        })
                      }
                      className="w-full bg-transparent border-none py-6 text-2xl md:text-4xl text-center outline-none placeholder:text-zinc-800 text-white font-medium"
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/10 group-focus-within:w-full group-focus-within:bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>

                  <button
                    type="submit"
                    className="bg-white text-black px-14 py-4 rounded-full font-bold text-sm hover:bg-emerald-400 transition-all active:scale-95"
                  >
                    {step === STEPS.length - 1 ? "Complete Setup" : "Next Step"}
                  </button>
                </motion.div>
              </AnimatePresence>
            </form>
          </motion.div>
        ) : (
          /* --- HIGH-END INITIALIZATION OVERLAY --- */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-12 text-center"
          >
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-[ -0.04em] italic text-white">
                Initializing Sovereign Intelligence...
              </h3>
              <div className="flex flex-col gap-1 items-center">
                <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                  Connecting to Nouakchott Nodes
                </p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.2
                      }}
                      className="w-1 h-1 bg-emerald-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="fixed bottom-12 flex flex-col items-center gap-4 opacity-10">
        <div className="text-[10px] font-bold tracking-[0.5em] text-white uppercase">
          MRT.AI • SECURE PROTOCOL
        </div>
      </div>
    </main>
  );
}
