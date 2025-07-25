import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldIcon, LockIcon, EyeOffIcon } from 'lucide-react';
export const TrustSection = () => {
  const trustFeatures = [{
    icon: <LockIcon size={24} className="text-blue-300" />,
    title: 'End-to-End Encryption',
    description: 'All uploads and communications are fully encrypted'
  }, {
    icon: <EyeOffIcon size={24} className="text-blue-300" />,
    title: 'No Data Storage',
    description: 'Your uploads are analyzed and then immediately deleted'
  }, {
    icon: <ShieldIcon size={24} className="text-blue-300" />,
    title: 'Privacy First',
    description: 'We never collect or share your personal information'
  }];
  return <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Trust & Security
        </h2>
        <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto">
          Your privacy and security are our top priorities
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustFeatures.map((feature, index) => <GlassPanel key={index} className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/20 mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            </GlassPanel>)}
        </div>
      </div>
    </section>;
};