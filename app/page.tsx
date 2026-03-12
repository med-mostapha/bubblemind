import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Integration from "@/components/landing/integration";
import IntegrationSection from "@/components/landing/integration";
import Navbar from "@/components/landing/nav";
import SocialProof from "@/components/social";
import React from "react";

function page() {
  return (
    <main className="w-full flex flex-col relative z-10">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <IntegrationSection />
      <Footer />
    </main>
  );
}

export default page;
