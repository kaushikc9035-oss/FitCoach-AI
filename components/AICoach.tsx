import React, { useState, useEffect, useRef } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { UserProfile, GeneratedPlan, HealthLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { startCoachChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AICoachProps {
  user: UserProfile;
  plan: GeneratedPlan | null;
  logs: HealthLog[];
}

const SUGGESTED_QUESTIONS = [
  "How can I improve my VO2 max?",
  "What supplements support longevity?",
  "Analyze my recent progress.",
  "Optimize my sleep protocol.",
  "Explain Zone 2 training."
];

const AICoach: React.FC<AICoachProps> = ({ user, plan, logs }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello ${user.name}! I'm your LifeLens AI Coach. I've analyzed your health profile and longevity plan. How can I help you optimize your healthspan today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  // Initialize chat session
  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = startCoachChat(user, plan, logs);
    }
  }, [user, plan, logs]);

  const handleClearChat = () => {
    setMessages([{ role: 'model', text: `Hello ${user.name}! I'm your LifeLens AI Coach. I've analyzed your health profile and longevity plan. How can I help you optimize your healthspan today?` }]);
    chatRef.current = startCoachChat(user, plan, logs);
  };

  const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setStreamingMessage('');

    try {
      if (!chatRef.current) {
        chatRef.current = startCoachChat(user, plan, logs);
      }

      const streamResponse = await chatRef.current.sendMessageStream({
        message: userMessage,
      });

      let fullText = '';
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;
        setStreamingMessage(fullText);
      }

      setMessages(prev => [...prev, { role: 'model', text: fullText }]);
      setStreamingMessage('');
    } catch (error) {
      console.error("Coach Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-accent to-ll-accent2 flex items-center justify-center text-white shadow-lg shadow-ll-accent/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-syne text-ll-text glow-cyan">FitGenius AI Coach</h1>
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest">Neural Link Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg bg-ll-text/5 border border-ll-text/10 text-[10px] font-bold text-ll-text-muted hover:bg-ll-danger/10 hover:text-ll-danger transition-all uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 glass rounded-[2rem] overflow-hidden flex flex-col relative border border-ll-text/5 bg-ll-text/1">
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-5 rounded-2xl shadow-xl relative group/msg ${
                  msg.role === 'user' 
                    ? 'bg-ll-accent/10 border border-ll-accent/20 text-ll-text rounded-tr-none' 
                    : 'bg-ll-text/5 border border-ll-text/10 text-ll-text rounded-tl-none'
                }`}>
                  <div className="prose prose-invert max-w-none text-ll-text leading-relaxed text-sm md:text-base">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="absolute -right-10 top-0 p-2 opacity-0 group-hover/msg:opacity-100 transition-opacity text-ll-text-dim hover:text-ll-accent"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[90%] p-5 rounded-2xl rounded-tl-none shadow-xl bg-ll-text/5 border border-ll-text/10 text-ll-text">
                  <div className="prose prose-invert max-w-none text-ll-text leading-relaxed text-sm md:text-base">
                    <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isLoading && !streamingMessage && (
            <div className="flex justify-start">
              <div className="bg-ll-text/5 border border-ll-text/10 p-4 rounded-2xl rounded-tl-none shadow-xl">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-ll-accent rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-ll-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-ll-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!isLoading && messages.length < 8 && (
            <div className="pt-4 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(undefined, q)}
                  className="px-3 py-1.5 rounded-full bg-ll-accent/5 border border-ll-accent/10 text-[10px] font-bold text-ll-accent hover:bg-ll-accent/10 transition-all whitespace-nowrap uppercase tracking-wider"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="h-2" />
        </div>
      </div>

      {/* Input Area */}
      <div className="glass p-4 rounded-2xl border border-ll-text/10 bg-ll-text/5 backdrop-blur-2xl">
        <form onSubmit={handleSendMessage} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your longevity coach..."
            className="w-full bg-ll-surface/50 border border-ll-text/10 rounded-xl py-4 pl-6 pr-20 text-ll-text placeholder:text-ll-text-muted focus:outline-none focus:border-ll-accent/50 focus:ring-2 focus:ring-ll-accent/5 transition-all text-base"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-ll-accent text-ll-bg rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-ll-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-ll-accent/20 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? '...' : (
              <>
                <span>Send</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICoach;
