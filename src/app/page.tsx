'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Brain, Settings } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [modelMode, setModelMode] = useState<'auto' | 'gemini-3-flash' | 'gemini-3.1-flash-lite'>('auto');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMsg = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    try {
      const resp = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMsg.text, 
          manualModel: modelMode === 'auto' ? undefined : modelMode 
        }),
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.text || data.error }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-4 premium-gradient">
          Premium RAG Agent
        </h1>
        <p className="text-gray-400 max-w-lg">
          Powered by Gemini 3 Flash & 3.1 Flash-Lite with Autonomous Model Routing for optimal performance.
        </p>
      </motion.div>

      {/* Model Selector */}
      <div className="flex gap-2 mb-6 p-1 glass rounded-full">
        {(['auto', 'gemini-3-flash', 'gemini-3.1-flash-lite'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setModelMode(mode)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              modelMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode === 'auto' ? 'Auto Routing' : mode.replace('gemini-', '')}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-4xl glass rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-center flex-col items-center justify-center text-gray-500 gap-4"
              >
                <Brain size={64} className="opacity-20" />
                <p>Hello! Ask me anything, and I'll route it to the best model.</p>
              </motion.div>
            )}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'
                } border border-white/5`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Start typing..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all"
            />
            <button
              disabled={isLoading}
              className="p-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 disabled:opacity-50 transition-all animate-glow"
            >
              {isLoading ? <Zap className="animate-spin" /> : <Send />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
