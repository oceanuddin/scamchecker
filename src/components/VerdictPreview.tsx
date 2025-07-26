import React from 'react';
import { GlassPanel } from './GlassPanel';
import { AlertCircleIcon, ShieldCheckIcon, HelpCircleIcon } from 'lucide-react';
export const VerdictPreview = () => {
  const verdicts = [{
    icon: <AlertCircleIcon size={28} className="text-red-400" />,
    label: '🚨 Scam',
    color: 'from-red-500/20 to-red-700/20',
    border: 'border-red-500/30',
    text: 'This is a common phishing attempt. Never share your password or financial information.',
    example: 'Email claiming your account is suspended and requesting immediate verification via an unusual link.'
  }, {
    icon: <ShieldCheckIcon size={28} className="text-green-400" />,
    label: '✅ Safe',
    color: 'from-green-500/20 to-green-700/20',
    border: 'border-green-500/30',
    text: 'This appears to be legitimate communication from the company.',
    example: 'Email from your bank sent from their official domain with no urgent requests for sensitive information.'
  }];
  return <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Verdict Preview
        </h2>
        <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto">
          Our AI provides clear assessments to help you stay safe online
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {verdicts.map((verdict, index) => <GlassPanel key={index} className={`p-6 border-2 ${verdict.border} bg-gradient-to-br ${verdict.color}`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {verdict.icon}
                  <h3 className="text-xl font-bold">{verdict.label}</h3>
                </div>
                <p className="text-white/90">{verdict.text}</p>
                <div className="mt-2 pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60">
                    <span className="font-medium text-white/80">Example:</span>{' '}
                    {verdict.example}
                  </p>
                </div>
              </div>
            </GlassPanel>)}
        </div>
      </div>
    </section>;
};