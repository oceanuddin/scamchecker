import React from 'react';
import { HeartIcon, LinkedinIcon } from 'lucide-react';

export const Footer = () => {
  return <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">checkifthisisascamfor.me</h3>
            <p className="text-white/60 max-w-xs">
              Using advanced AI to help you identify and avoid online scams and
              fraudulent activities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/oceanuddin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <a 
              href="https://paypal.me/uddinocean" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
            >
              <HeartIcon size={16} className="text-red-400" />
              Support this project
            </a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-white/40 text-sm">
          <p className="mb-4">
            While our AI provides accurate assessments in most cases, always
            exercise caution with sensitive information and financial
            transactions online.
          </p>
          © {new Date().getFullYear()} checkifthisisascamfor.me — All rights
          reserved.
        </div>
      </div>
    </footer>;
};