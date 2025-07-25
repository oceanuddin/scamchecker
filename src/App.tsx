import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { VerdictPreview } from './components/VerdictPreview';
import { AboutAI } from './components/AboutAI';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { BackgroundEffect } from './components/BackgroundEffect';
import { ResultsPage } from './components/ResultsPage';
export function App() {
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState<any>(null); // Store full AI result
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accepts type, and input (text or File)
  const handleCheckScam = async (type: 'image' | 'text', input: string | File) => {
    setLoading(true);
    setError(null);
    try {
      let data: any = {};
      if (type === 'text' && typeof input === 'string') {
        const res = await fetch('http://localhost:5050/api/check-scam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenario: input })
        });
        data = await res.json();
      } else if (type === 'image' && input instanceof File) {
        const formData = new FormData();
        formData.append('image', input);
        const res = await fetch('http://localhost:5050/api/check-scam-image', {
          method: 'POST',
          body: formData
        });
        data = await res.json();
      }
      setResultData(data);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      setError('Failed to check scam. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleCheckAnother = () => {
    setShowResults(false);
    setResultData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#0a0a16] via-[#0c0c22] to-[#0a0a16] font-sans text-white">
      <BackgroundEffect />
      <div className="relative z-10">
        {showResults ? <ResultsPage result={resultData} onCheckAnother={handleCheckAnother} /> : <HeroSection onCheckScam={handleCheckScam} loading={loading} />}
        <HowItWorks />
        <VerdictPreview />
        <AboutAI />
        <TrustSection />
        <Footer />
      </div>
    </div>;
}