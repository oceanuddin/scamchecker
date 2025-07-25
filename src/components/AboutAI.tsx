import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ZapIcon, EyeIcon, MessageSquareTextIcon, SparklesIcon } from 'lucide-react';
export const AboutAI = () => {
  return <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <GlassPanel className="p-8 md:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-500/20">
                <ZapIcon size={28} className="text-indigo-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Powered by GPT-4o
              </h2>
            </div>
            <p className="text-white/80 text-lg">
              Our scam detection system uses OpenAI's most advanced multimodal
              AI to analyze potential scams with exceptional accuracy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="flex flex-col items-center text-center p-4">
                <EyeIcon size={24} className="text-blue-300 mb-3" />
                <h3 className="font-medium mb-2">Image Analysis</h3>
                <p className="text-sm text-white/70">
                  Detects visual red flags in screenshots and photos
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <MessageSquareTextIcon size={24} className="text-purple-300 mb-3" />
                <h3 className="font-medium mb-2">Text Analysis</h3>
                <p className="text-sm text-white/70">
                  Identifies suspicious language patterns and requests
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <SparklesIcon size={24} className="text-amber-300 mb-3" />
                <h3 className="font-medium mb-2">Contextual Understanding</h3>
                <p className="text-sm text-white/70">
                  Evaluates the full context to provide nuanced verdicts
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>;
};