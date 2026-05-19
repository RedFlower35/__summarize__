/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Loader2, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setSummary('');
    setCopied(false);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setSummary('錯誤：' + (data.error || '無法生成總結'));
      }
    } catch (e) {
      setSummary('系統錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI 會議記錄生成與翻譯工具</h1>
          <p className="text-slate-600 mt-2">快速總結您的會議逐字稿，並生成雙語對照。</p>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <textarea
            className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="請在此貼上會議逐字稿..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSummarize}
              disabled={loading || !transcript.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition font-medium"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              生成總結與翻譯
            </button>
          </div>
        </section>

        {summary && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">生成結果</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '已複製！' : '複製總結'}
              </button>
            </div>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base bg-slate-50 p-6 rounded-xl border border-slate-200">
              {summary}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

