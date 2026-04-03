import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import MainSiteWrapper from "@/components/MainSiteWrapper";
import { ThemeProvider } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtime Clients Support - Human-friendly AI",
  description:
    "Instantly resolve customer questions with an assistant that reads your docs and speaks with empathy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen flex flex-col p-0 antialiased font-sans`}
      >
        <ThemeProvider>
          <MainSiteWrapper>{children}</MainSiteWrapper>
        </ThemeProvider>
        <Script
          id="unicorn-studio"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();`,
          }}
        />
      </body>
    </html>
  );
}
