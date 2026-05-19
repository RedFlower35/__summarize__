/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Loader2, Sparkles, Check, FileText } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
                <FileText size={28} />
              </span>
              AI 會議記錄生成與翻譯工具
            </h1>
            <p className="text-slate-600 mt-2 text-base">一鍵自動擷取會議重點，快速生成繁中摘要與專業英文翻譯對照。</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* 左側：輸入會議逐字稿 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
              <h2 className="text-lg font-semibold text-slate-800">會議逐字稿輸入</h2>
            </div>
            <textarea
              className="w-full flex-1 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none text-slate-700 bg-slate-50/50 focus:bg-white text-base leading-relaxed"
              placeholder="請在此貼上或輸入會議逐字稿..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSummarize}
                disabled={loading || !transcript.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 transition font-medium shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                生成總結與翻譯
              </button>
            </div>
          </section>

          {/* 右側：產出結果畫面 */}
          <section className="h-full min-h-[500px] flex flex-col">
            {loading ? (
              // 載入中狀態
              <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center h-full">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute animate-ping h-12 w-12 rounded-full bg-indigo-100 opacity-75"></div>
                  <Loader2 className="animate-spin text-indigo-600 relative" size={36} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">AI 正在研讀與整理...</h3>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                  正在擷取會議重點、梳理待辦清單，並翻譯為專業英文版本，請耐心等候。
                </p>
              </div>
            ) : summary ? (
              // 已生成結果狀態
              <div className="flex-1 flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      生成結果
                    </h2>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition font-semibold cursor-pointer active:scale-95"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? '已複製！' : '複製結果'}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto text-slate-700 whitespace-pre-wrap leading-relaxed text-base bg-slate-50 p-6 rounded-xl border border-slate-200 max-h-[380px] custom-scrollbar">
                  {summary}
                </div>
              </div>
            ) : (
              // 初始空白狀態
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 h-full">
                <div className="bg-indigo-50 text-indigo-500 p-4 rounded-full mb-4 animate-pulse">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">雙語結果展示區</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  貼上會議內容並點擊「生成總結與翻譯」按鈕，結構化的會議摘要和雙語翻譯對照將在此處呈現。
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
