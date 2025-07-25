import React from 'react';
interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}
export const GlassPanel = ({
  children,
  className = ''
}: GlassPanelProps) => {
  return <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>;
};