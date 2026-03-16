'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageCircle, ImagePlus, User, Bot, CheckCircle2, Maximize2, ShoppingBag, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistantStore } from '@/stores/assistantStore';
import { useCartStore } from '@/stores/cartStore';
import VirtualMirror from '@/components/shared/VirtualMirror';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';

export default function AssistantPage() {
  const {
    messages, isLoading,
    addMessage, setMessages, setLoading,
    isMirrorOpen, setMirrorOpen,
    selectedProductId, setSelectedProductId,
    setOpen,
  } = useAssistantStore();

  const addItem = useCartStore((s) => s.addItem);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProducts().then(setDbProducts);
  }, []);

  // Close the floating widget when on the full-page assistant
  useEffect(() => { setOpen(false); }, [setOpen]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectedProduct = dbProducts.find(p => p.id === selectedProductId) || (dbProducts.length > 0 ? dbProducts[0] : null);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    // Initial assistant message for streaming
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    addMessage(assistantMessage);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
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
                  if (toolCall.name === 'tryOnFrame') {
                    const frameId = toolCall.args.frameId;
                    console.log('Assistant AI triggered tray-on for:', frameId);
                    setSelectedProductId(frameId);
                    setMirrorOpen(true);
                  }
                } catch (e) {
                  console.error('Error parsing AI tool call in AssistantPage:', e);
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

      // After streaming is done, parse product mentions for action buttons
      const mentionedProducts = dbProducts.filter((p) => 
        fullContent.toLowerCase().includes(p.name.toLowerCase()) ||
        fullContent.toLowerCase().includes(p.brand.toLowerCase())
      );
      const actions = mentionedProducts.slice(0, 3).map((p) => ({
        type: 'addToCart' as const,
        label: p.name,
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
        'Извините, не удалось получить ответ. Попробуйте позже или позвоните нам: +996 772 18-88-02'
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
      const imageUrl = URL.createObjectURL(file);

      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: '📷 Фото загружено для анализа',
        timestamp: new Date(),
        imageUrl,
      });
      setLoading(true);

      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Проанализируй мое фото. Если это лицо — определи форму лица и порекомендуй оправы. Если это рецепт — считай данные рецепта.',
            image: base64,
            mimeType,
            history,
          }),
        });
        const data = await res.json();
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'Не удалось проанализировать изображение.',
          timestamp: new Date(),
        });
      } catch {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Ошибка при анализе фото.',
          timestamp: new Date(),
        });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = (productId: string) => {
    const product = dbProducts.find(p => p.id === productId);
    if (product) {
      addItem(product, product.colors[0]);
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ **${product.name}** добавлен в корзину!`,
        timestamp: new Date(),
      });
    }
  };

  const handleTryMirror = (productId: string) => {
    setSelectedProductId(productId);
    setMirrorOpen(true);
  };

  return (
    <div className="pt-20 lg:pt-24 pb-28 lg:pb-4 min-h-screen flex flex-col bg-background">
      <div className="max-w-3xl mx-auto px-4 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-vizhu-purple text-white mb-4 shadow-xl shadow-vizhu-purple/20"
          >
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">OptiCare AI</span>
          </motion.div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium mb-3">Ваш виртуальный стилист</h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Экспертная помощь в подборе очков и линз с использованием технологий искусственного интеллекта
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6 min-h-0 px-2 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  'flex items-end gap-3',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border/50 shadow-sm",
                  msg.role === 'user' ? "bg-white text-black" : "bg-vizhu-purple text-white"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-vizhu-purple text-white rounded-br-none'
                      : 'bg-card border border-border/50 text-foreground rounded-bl-none'
                  )}
                >
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="Uploaded" className="w-full rounded-2xl mb-3 max-h-48 object-cover" />
                  )}

                  <div className="whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={cn(line.startsWith('•') && 'pl-4 -indent-4 mb-2', 'mb-1 last:mb-0')}>
                        {line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
                      </p>
                    ))}
                  </div>

                  {/* Action buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap gap-2">
                      {msg.actions.map((action, i) => (
                        <div key={i} className="flex gap-1.5">
                          <button
                            onClick={() => action.productId && handleAddToCart(action.productId)}
                            className="px-3 py-1.5 bg-vizhu-orange/10 text-vizhu-orange rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-vizhu-orange hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <ShoppingBag size={10} />
                            В корзину
                          </button>
                          <button
                            onClick={() => action.productId && handleTryMirror(action.productId)}
                            className="px-3 py-1.5 bg-vizhu-purple/10 text-vizhu-purple rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-vizhu-purple hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <Camera size={10} />
                            Примерить
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-border/30 flex justify-end">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        <CheckCircle2 size={12} className="text-green-500" />
                        OptiCare Verified
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-vizhu-purple" />
                  <span className="text-sm text-muted-foreground">Анализирую...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick messages */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { text: 'Подбери очки по форме лица', icon: <Sparkles size={14} /> },
              { text: 'Нужна помощь со стилем', icon: <Sparkles size={14} /> },
              { text: 'Расскажи про покрытие линз', icon: <MessageCircle size={14} /> },
              { text: 'Открыть Виртуальное Зеркало', icon: <Camera size={14} /> },
            ].map((q) => (
              <button
                key={q.text}
                onClick={() => {
                  if (q.text.includes('Зеркало')) {
                    setMirrorOpen(true);
                  } else {
                    sendMessage(q.text);
                  }
                }}
                className="px-5 py-2.5 bg-card border border-border/50 hover:border-vizhu-purple/40 hover:bg-vizhu-purple/5 rounded-full text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
              >
                {q.icon}
                {q.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative flex gap-3 pb-2 lg:pb-8">
          <div className="flex-1 relative group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Спросите меня о стиле или линзах..."
              className="w-full pl-14 pr-4 py-4 rounded-3xl border border-border/50 bg-card focus:outline-none focus:ring-4 focus:ring-vizhu-purple/10 text-sm shadow-xl transition-all"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-vizhu-purple transition-colors p-2"
              title="Загрузить фото лица или рецепт"
            >
              <ImagePlus size={20} />
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
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={cn(
              'w-14 h-14 rounded-full font-medium transition-all flex items-center justify-center shadow-lg',
              input.trim() && !isLoading
                ? 'bg-vizhu-purple hover:bg-vizhu-purple-dark text-white scale-100'
                : 'bg-muted text-muted-foreground scale-90'
            )}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {/* VirtualMirror is now global in layout.tsx */}
    </div>
  );
}
