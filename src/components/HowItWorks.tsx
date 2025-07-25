import React, { Fragment } from 'react';
import { GlassPanel } from './GlassPanel';
import { UploadCloudIcon, CheckCircleIcon, ArrowRightIcon, ZapIcon } from 'lucide-react';
export const HowItWorks = () => {
  const steps = [{
    icon: <UploadCloudIcon size={32} className="text-blue-300" />,
    title: 'Upload or Describe',
    description: "Share a screenshot or describe the suspicious situation you've encountered"
  }, {
    icon: <ZapIcon size={32} className="text-purple-300" />,
    title: 'AI Review',
    description: 'Our advanced AI analyzes the content for known scam patterns and red flags'
  }, {
    icon: <CheckCircleIcon size={32} className="text-green-300" />,
    title: 'Get Verdict',
    description: "Receive a clear assessment of whether it's a scam, safe, or requires caution"
  }];
  return <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 relative">
          {steps.map((step, index) => <Fragment key={index}>
              <div className="relative">
                <GlassPanel className="p-6 transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-white/10 mb-2">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </GlassPanel>
                {index < steps.length - 1 && <div className="hidden md:flex absolute top-1/2 -right-10 transform translate-x-1/2 -translate-y-1/2 text-blue-300/70 z-20">
                    <ArrowRightIcon size={28} className="animate-pulse" />
                  </div>}
              </div>
            </Fragment>)}
          {/* Mobile arrows */}
          <div className="md:hidden flex justify-center w-full col-span-1 -mt-4 mb-4">
            <ArrowRightIcon size={24} className="rotate-90 text-blue-300/70" />
          </div>
          <div className="md:hidden flex justify-center w-full col-span-1 -mt-4 mb-4">
            <ArrowRightIcon size={24} className="rotate-90 text-blue-300/70" />
          </div>
        </div>
      </div>
    </section>;
};