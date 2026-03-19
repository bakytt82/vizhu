'use client';

import { useRef, useEffect, useState } from 'react';
import { Send, Sparkles, Loader2, X, ImagePlus, User, Bot, CheckCircle2, Maximize2, MessageCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistantStore } from '@/stores/assistantStore';
import { useCartStore } from '@/stores/cartStore';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import Link from 'next/link';
import type { ChatMessage } from '@/types';

// WhatsApp icon component
function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function ChatWidget() {
  const {
    messages, isOpen, isLoading,
    addMessage, setMessages, setLoading, toggleOpen, setOpen,
    initChat,
  } = useAssistantStore();

  const { language } = useLanguageStore();
  const t = translations[language];

  const getInitialMessage = (): ChatMessage => ({
    id: '0',
    role: 'assistant',
    content: `${t.ai_initial_welcome}, ${t.ai_expert_guide}\n\n${t.ai_help_with}\n• ${t.ai_help_1}\n• ${t.ai_help_2}\n• ${t.ai_help_3}\n\n${t.ai_what_to_start}`,
    timestamp: new Date(),
  });

  useEffect(() => {
    initChat(getInitialMessage());
  }, [language, initChat]);

  const addItem = useCartStore((s) => s.addItem);
  const [input, setInput] = useState('');
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProducts().then(setDbProducts);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date(),
    };

    const assistantMsgId = (Date.now() + 1).toString(); // Moved declaration outside try block

    try {
      // Capture history BEFORE adding the new message to avoid including the current model placeholder
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      addMessage(userMessage);
      setInput('');
      setLoading(true);

      // Initial assistant message for streaming
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history, language }),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
            // Detect Tool Calls
          if (chunk.includes('__TOOL_CALL__:')) {
            const lines = chunk.split('\n');
            let textChunks = [];
            
            for (const line of lines) {
              if (line.startsWith('__TOOL_CALL__:')) {
                const jsonStr = line.replace('__TOOL_CALL__:', '');
                try {
                  const toolCall = JSON.parse(jsonStr);
                  // Tool calls for try-on are disabled
                } catch (e) {
                  console.error('Error parsing AI tool call:', e);
                }
              } else if (line.trim()) {
                textChunks.push(line);
              }
            }
            fullContent += textChunks.join('\n');
          } else {
            fullContent += chunk;
          }
          
          // Update the message in the store
          useAssistantStore.getState().updateMessage(assistantMsgId, fullContent);
        }
      }

      // If text is still empty but we have tools/actions, provide a fallback message
      if (!fullContent.trim()) {
        fullContent = "Вот мои рекомендации для вас:";
      }

      // After streaming is done, parse product mentions
      const mentionedProducts = dbProducts.filter((p) => 
        fullContent.toLowerCase().includes(p.name.toLowerCase()) ||
        fullContent.toLowerCase().includes(p.brand.toLowerCase())
      );
      const actions = mentionedProducts.slice(0, 2).map((p) => ({
        type: 'addToCart' as const,
        label: `🛒 ${p.name}`,
        productId: p.id,
      }));

      if (actions.length > 0) {
        setMessages(
          useAssistantStore.getState().messages.map(m => 
            m.id === assistantMsgId ? { ...m, actions } : m
          )
        );
      }
    } catch {
      useAssistantStore.getState().updateMessage(
        assistantMsgId, 
        `${t.ai_error_response} +996 772 18-88-02`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const mimeType = file.type;

      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: t.ai_photo_uploaded,
        timestamp: new Date(),
        imageUrl: URL.createObjectURL(file),
      });

      setLoading(true);
      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: t.ai_analyze_photo_prompt,
            image: base64,
            mimeType,
            history,
            language,
          }),
        });

        const data = await res.json();
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || t.ai_analyze_photo_error,
          timestamp: new Date(),
        });
      } catch {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: t.ai_photo_error,
          timestamp: new Date(),
        });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = (productId: string) => {
    const product = dbProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product, product.colors?.[0]);
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ **${product.name}** ${t.ai_product_added}`,
        timestamp: new Date(),
      });
    }
  };

  const quickOptions = [
    { text: t.ai_quick_1, icon: '👓' },
    { text: t.ai_quick_2, icon: '✨' },
    { text: t.ai_quick_3, icon: '🔍' },
  ];

  const WHATSAPP_NUMBER = '996772188802';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Здравствуйте! Меня интересуют очки в вашем салоне.')}`;

  return (
    <>
      {/* Floating AI Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            className="fixed bottom-32 right-4 lg:bottom-10 lg:right-10 z-50 group"
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl glass-button overflow-hidden">
               <div className="absolute inset-0 bg-vizhu-purple/5 group-hover:bg-vizhu-purple/10 transition-colors" />
               <Sparkles size={24} className="relative z-10 animate-pulse" />
               <div className="absolute -inset-1 bg-gradient-to-tr from-vizhu-purple/20 to-vizhu-orange/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-vizhu-orange rounded-full shadow-lg border-2 border-background z-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 glass-modern flex flex-col overflow-hidden",
              // Mobile: fullscreen
              "inset-0 rounded-none",
              // Desktop: floating panel
              "lg:inset-auto lg:bottom-10 lg:right-10 lg:w-[400px] lg:h-[75vh] lg:max-h-[650px] lg:rounded-[32px] lg:shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-transparent shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-vizhu-purple/10 rounded-2xl flex items-center justify-center border border-vizhu-purple/20">
                  <Sparkles size={20} className="text-vizhu-purple" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-base">OptiCare AI</h3>
                  <div className="flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t.ai_role_stylist}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/assistant"
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-muted-foreground"
                  title="Открыть на весь экран"
                >
                  <Maximize2 size={18} />
                </Link>
                <button onClick={toggleOpen} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-muted-foreground">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className={cn(
                      "w-7 h-7 rounded-full bg-vizhu-purple text-white flex items-center justify-center shrink-0 mt-1",
                      !msg.content && !msg.imageUrl && "opacity-0"
                    )}>
                      <Bot size={12} />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[85%] rounded-[24px] px-5 py-4 text-[13px] leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-vizhu-purple text-white rounded-br-none'
                      : 'bg-secondary/40 backdrop-blur-sm text-foreground rounded-bl-none border border-border/20',
                    msg.role === 'assistant' && !msg.content && !msg.imageUrl && !msg.actions && "hidden"
                  )}>
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Uploaded" className="w-full rounded-xl mb-2 max-h-32 object-cover" />
                    )}
                    <div className="whitespace-pre-wrap">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={cn(line.startsWith('•') && 'pl-3 -indent-3 mb-1', 'mb-0.5 last:mb-0')}>
                          {line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
                        </p>
                      ))}
                    </div>

                    {/* Action buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-border/30 flex flex-wrap gap-2">
                        {msg.actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (action.type === 'addToCart' && action.productId) {
                                handleAddToCart(action.productId);
                              }
                            }}
                            className="px-3 py-1.5 bg-vizhu-orange/10 text-vizhu-orange rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-vizhu-orange hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <ShoppingBag size={10} />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-1">
                      <User size={12} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-vizhu-purple text-white flex items-center justify-center shrink-0">
                    <Bot size={12} />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-vizhu-purple" />
                    <span className="text-[13px] text-muted-foreground">{t.ai_thinking}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick options (only at the start) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                {quickOptions.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => sendMessage(q.text)}
                    className="whitespace-nowrap px-3 py-1.5 bg-muted hover:bg-vizhu-purple/5 rounded-full text-[11px] font-medium transition-colors flex items-center gap-1.5 border border-border/50"
                  >
                    {q.icon} {q.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50 flex items-center gap-2 shrink-0 pb-safe lg:pb-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-muted-foreground hover:text-vizhu-purple transition-colors rounded-full hover:bg-muted"
              >
                <ImagePlus size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
                }}
              />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={t.ai_ask_placeholder}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-vizhu-purple/20 text-[13px]"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className={cn(
                  'p-2.5 rounded-full transition-all',
                  input.trim() && !isLoading
                    ? 'bg-vizhu-purple text-white hover:bg-vizhu-purple-dark'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
