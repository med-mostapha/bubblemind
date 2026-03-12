import Link from "next/link";
import React from "react";

function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float">
          <span className="text-sm text-white">New:</span>
          <span className="text-sm text-white">
            Introducing our latest features!
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-medium tracking-right text-white mb-6 leading-[1.1]">
          Realtime Clients Support <br className="hidden md:block" />
          <span className="text-zinc-500">Human-friendly AI</span>
        </h1>

        <p className="text-lg text-zinc-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience seamless support with our cutting-edge AI technology, with
          an assistant that reads your docs and speaks with empathy.no robtic
          replies , just professional understanding.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-float w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-100 transition-colors">
                Start for Free
              </button>
            </Link>
            <button className="w-full sm:w-auto px-8 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* floating ai assistant chat interface window visualization like x.com and openai design system */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left Section - Steps */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold text-white mb-2">
                How It Works
              </h2>
              <p className="text-zinc-400">
                Four simple steps to intelligent support
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  number: "1",
                  title: "Ask a Question",
                  description:
                    "Type your question or request into the chat interface"
                },
                {
                  number: "2",
                  title: "AI Understands Context",
                  description:
                    "The assistant analyzes your message and comprehends intent"
                },
                {
                  number: "3",
                  title: "Get Intelligent Response",
                  description:
                    "Receive a contextual, thoughtful response instantly"
                },
                {
                  number: "4",
                  title: "Continue Naturally",
                  description:
                    "Have seamless multi-turn conversations with perfect context"
                }
              ].map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-white font-semibold text-sm">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className=" text-white justify-self-start font-medium mb-1">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm justify-self-start">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Chat Interface */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        A
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">
                        AI Assistant
                      </p>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {/* AI Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm border border-gray-200">
                    <p className="text-gray-800 text-sm">
                      Hello! I'm your AI assistant. How can I help you today?
                    </p>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-black rounded-lg p-3 max-w-xs shadow-sm">
                    <p className="text-white text-sm">
                      Can you summarize documents?
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-700 text-xs font-semibold">
                      U
                    </span>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm border border-gray-200">
                    <p className="text-gray-800 text-sm">
                      Absolutely! I can analyze documents, extract key points,
                      and create concise summaries tailored to your needs.
                    </p>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-black rounded-lg p-3 max-w-xs shadow-sm">
                    <p className="text-white text-sm">
                      That's great! How fast is it?
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-700 text-xs font-semibold">
                      U
                    </span>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                  <button className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors">
                    <span className="text-sm font-medium">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
