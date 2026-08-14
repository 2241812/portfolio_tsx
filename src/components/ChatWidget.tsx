"use client";
import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Message } from '@/services/chatbot';

interface ChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const QUICK_PROMPTS = [
  'What are your top 3 projects?',
  'What is your core tech stack?',
  'How can I get in touch with you?',
];

const ChatWidget = memo(function ChatWidget({ isOpen: initialOpen = false, onClose }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content:
          "System online. I am Narciso's automated portfolio assistant. Ask me about his Top 3 projects, systems architecture, containerization setups, or contact channels.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      conversationHistoryRef.current = [{ role: 'assistant', content: welcomeMessage.content }];
    }
  }, [isOpen, messages.length]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: queryText,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    conversationHistoryRef.current.push({ role: 'user', content: queryText });
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: queryText,
          messages: conversationHistoryRef.current.filter(
            (m) => m.role === 'assistant' || conversationHistoryRef.current.indexOf(m) > 0
          ),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        content: data.message || 'No response stream generated.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      conversationHistoryRef.current.push({ role: 'assistant', content: assistantMessage.content });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: 'Error: Connection refused by chat gateway. Verify connectivity.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuery(inputValue);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleReset = () => {
    conversationHistoryRef.current = [];
    const resetMessage: Message = {
      id: 'welcome-reset',
      content: 'Conversation buffer cleared. Ready for input.',
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([resetMessage]);
    conversationHistoryRef.current = [{ role: 'assistant', content: resetMessage.content }];
  };

  return (
    <>
      {/* Floating TUI Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 px-3.5 py-2 rounded-lg bg-[#121215] border border-zinc-700 text-zinc-200 text-xs font-mono font-bold shadow-xl flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors z-40 cursor-pointer"
            aria-label="Open AI Assistant terminal"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>:chat</span>
            <kbd className="text-[10px] text-zinc-500 font-normal">[AI]</kbd>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 right-4 sm:right-6 w-[420px] max-w-[calc(100vw-32px)] h-[540px] bg-[#101216]/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden font-mono"
          >
            {/* Window Header */}
            <div className="px-3.5 py-2.5 bg-[#14161b] border-b border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-300" />
                <span className="font-bold text-zinc-100">narciso-ai:~$</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
                  title="Clear conversation"
                >
                  clear
                </button>
                <button
                  onClick={handleClose}
                  className="text-zinc-400 hover:text-white text-xs px-1 cursor-pointer"
                  aria-label="Close terminal"
                >
                  [✕]
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-[#0c0d10] border-b border-zinc-900 flex gap-1.5 overflow-x-auto thin-scrollbar">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendQuery(q)}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 text-[10px] whitespace-nowrap cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 thin-scrollbar text-xs">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-[10px] text-zinc-500 mb-0.5">
                    {message.role === 'user' ? 'you@client' : 'narciso-ai'}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg text-xs leading-relaxed max-w-[90%] ${
                      message.role === 'user'
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'bg-[#0c0d10] text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Processing query stream...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Line */}
            <div className="p-3 bg-[#14161b] border-t border-zinc-800 flex gap-2 items-center">
              <span className="text-zinc-400 font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about projects, skills, or experience..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 text-xs focus:outline-none"
              />
              <button
                onClick={() => sendQuery(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-3 py-1 bg-white hover:bg-zinc-200 disabled:opacity-40 text-black border border-white rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ChatWidget;
