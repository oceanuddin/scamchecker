import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Button } from './Button';
import { AlertCircleIcon, ShieldCheckIcon, HelpCircleIcon, ArrowLeftIcon, Link2Icon, PhoneIcon } from 'lucide-react';

interface ResultsPageProps {
  result: {
    verdict?: string;
    confidence?: string;
    redFlags?: string[];
    actions?: { title: string; description: string }[];
    analysis?: string;
    linkAnalysis?: {
      totalUrls: number;
      suspiciousUrls: number;
      redditReportsFound: number;
      details: Array<{
        url: string;
        suspicious: boolean;
        reason: string;
        accessible: boolean;
        title?: string;
        redditReports: Array<{
          title: string;
          url: string;
          subreddit: string;
          score: number;
        }>;
      }>;
    };
  };
  onCheckAnother: () => void;
}

export const ResultsPage = ({ result, onCheckAnother }: ResultsPageProps) => {
  // Parse the result - handle case where analysis contains full JSON
  let parsedResult = { ...result };
  
  if (result.analysis && result.analysis.includes('"verdict"') && result.analysis.includes('"confidence"')) {
    try {
      // Try to parse the analysis as JSON if it looks like JSON
      const jsonMatch = result.analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        parsedResult = {
          verdict: parsed.verdict || result.verdict,
          confidence: parsed.confidence || result.confidence,
          redFlags: parsed.redFlags || result.redFlags || [],
          actions: parsed.actions || result.actions || [],
          analysis: parsed.analysis || result.analysis
        };
      }
    } catch (e) {
      // If parsing fails, keep original result
      console.log('Failed to parse JSON from analysis');
    }
  }

  // Choose icon and color based on verdict
  let verdictType: 'scam' | 'safe' | 'unclear' = 'unclear';
  if (parsedResult.verdict?.toLowerCase().includes('scam')) verdictType = 'scam';
  else if (parsedResult.verdict?.toLowerCase().includes('legit') || parsedResult.verdict?.toLowerCase().includes('safe')) verdictType = 'safe';

  const verdictConfig = {
    scam: {
      icon: <AlertCircleIcon size={36} className="text-red-400" />, color: 'from-red-500/20 to-red-700/20', border: 'border-red-500/30', textColor: 'text-red-400',
    },
    safe: {
      icon: <ShieldCheckIcon size={36} className="text-green-400" />, color: 'from-green-500/20 to-green-700/20', border: 'border-green-500/30', textColor: 'text-green-400',
    },
    unclear: {
      icon: <HelpCircleIcon size={36} className="text-yellow-400" />, color: 'from-yellow-500/20 to-yellow-700/20', border: 'border-yellow-500/30', textColor: 'text-yellow-400',
    }
  };
  const config = verdictConfig[verdictType];

  return <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20">
    <div className="text-center mb-10 max-w-3xl">
      <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
        Analysis Results
      </h1>
      <p className="mt-6 text-xl text-blue-100/80">
        Here's what our AI determined about your submission
      </p>
    </div>
    <div className="w-full max-w-4xl">
      {/* Verdict Panel */}
      <GlassPanel className={`p-8 border-2 ${config.border} bg-gradient-to-br ${config.color} mb-8`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="p-4 rounded-full bg-white/10">{config.icon}</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-3xl font-bold mb-2 ${config.textColor}`}>{parsedResult.verdict || 'Analysis Complete'}</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {parsedResult.confidence && <div className="bg-black/20 rounded-full px-4 py-1 text-sm">
                <span className="text-white/60">Confidence:</span> {parsedResult.confidence}
              </div>}
            </div>
          </div>
        </div>
      </GlassPanel>
      {/* Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Red Flags */}
        <GlassPanel className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheckIcon size={20} className={verdictType === 'safe' ? 'text-green-400' : 'text-red-400'} />
            {verdictType === 'safe' ? 'Safety Signals' : 'Red Flags'}
          </h3>
          <ul className="space-y-3">
            {parsedResult.redFlags && parsedResult.redFlags.length > 0 ? parsedResult.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${verdictType === 'unclear' ? 'bg-yellow-500/20 text-yellow-300' : verdictType === 'safe' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} mt-0.5`}>
                  {/* No icon for dynamic flags */}
                </div>
                <span className="text-white/80">{flag}</span>
              </li>
            )) : <li className="text-white/60">No red flags detected.</li>}
          </ul>
        </GlassPanel>
        {/* Recommended Actions */}
        <GlassPanel className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PhoneIcon size={20} className="text-blue-400" />
            Recommended Actions
          </h3>
          <ul className="space-y-4">
            {parsedResult.actions && parsedResult.actions.length > 0 ? parsedResult.actions.map((action, i) => (
              <li key={i} className="border-b border-white/10 last:border-0 pb-3 last:pb-0">
                <h4 className="font-medium mb-1">{i + 1}. {action.title}</h4>
                <p className="text-white/70 text-sm">{action.description}</p>
              </li>
            )) : <li className="text-white/60">No recommended actions.</li>}
          </ul>
        </GlassPanel>
      </div>
      {/* AI Explanation */}
      <GlassPanel className="p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
        <p className="text-white/80 mb-4">{parsedResult.analysis || 'No analysis available.'}</p>
      </GlassPanel>

      {/* Link Analysis Section */}
      {parsedResult.linkAnalysis && parsedResult.linkAnalysis.details && parsedResult.linkAnalysis.details.length > 0 && (
        <GlassPanel className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2Icon size={20} className="text-purple-400" />
            Link Analysis
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{parsedResult.linkAnalysis.totalUrls}</div>
                <div className="text-sm text-white/60">URLs Found</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{parsedResult.linkAnalysis.suspiciousUrls}</div>
                <div className="text-sm text-white/60">Suspicious URLs</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{parsedResult.linkAnalysis.redditReportsFound}</div>
                <div className="text-sm text-white/60">Reddit Reports</div>
              </div>
            </div>
            {parsedResult.linkAnalysis.details.map((detail, index) => (
              <div key={index} className={`border rounded-lg p-4 ${detail.suspicious ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80 truncate">{detail.url}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${detail.suspicious ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {detail.suspicious ? 'SUSPICIOUS' : 'SAFE'}
                  </span>
                </div>
                <p className="text-xs text-white/60 mb-2">{detail.reason}</p>
                {detail.title && (
                  <p className="text-xs text-white/70 mb-2">Title: {detail.title}</p>
                )}
                {detail.redditReports.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-orange-300 mb-2">Reddit Reports Found:</p>
                    <div className="space-y-2">
                      {detail.redditReports.slice(0, 3).map((report, reportIndex) => (
                        <div key={reportIndex} className="bg-black/20 rounded p-2">
                          <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:text-blue-200 block">
                            {report.title}
                          </a>
                          <div className="text-xs text-white/50 mt-1">
                            r/{report.subreddit} • Score: {report.score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
      {/* Actions */}
      <div className="flex justify-center">
        <Button variant="secondary" size="lg" className="group" onClick={onCheckAnother}>
          <ArrowLeftIcon size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Check Another</span>
        </Button>
      </div>
    </div>
  </section>;
};