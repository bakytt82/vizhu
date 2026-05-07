'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCw, ShoppingCart, CreditCard, X, Sparkles, Loader2, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products as staticProducts } from '@/data/products';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const GOLD = "#D4AF37";
const PURPLE = "#2D1B4B";
const DEEP_PURPLE = "#1A0F2B";

type FilterType = 'all' | 'brand' | 'category';

export default function TryOnPage() {
  const [step, setStep] = useState<'capture' | 'process' | 'result'>('capture');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Filtering state
  const [filterMode, setFilterMode] = useState<FilterType>('all');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Load products from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducts();
        setAllProducts(data);
        
        const productId = searchParams.get('productId');
        if (productId) {
          const product = data.find(p => p.id === productId);
          if (product) setSelectedProduct(product);
          else if (data.length > 0) setSelectedProduct(data[0]);
        } else if (data.length > 0) {
          const glassesOnly = data.filter(p => ['eyeglasses', 'sunglasses', 'computer'].includes(p.category));
          if (glassesOnly.length > 0) setSelectedProduct(glassesOnly[0]);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        setAllProducts(staticProducts);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadData();
  }, [searchParams]);
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const glasses = useMemo(() => 
    allProducts.filter(p => ['eyeglasses', 'sunglasses', 'computer'].includes(p.category)),
    [allProducts]
  );

  // Derived filter options
  const brands = useMemo(() => Array.from(new Set(glasses.map(p => p.brand))).sort(), [glasses]);
  const categories = useMemo(() => Array.from(new Set(glasses.map(p => p.category))).sort(), [glasses]);

  // Filtered list
  const filteredGlasses = useMemo(() => {
    if (filterMode === 'all') return glasses;
    if (filterMode === 'brand' && selectedBrand) return glasses.filter(p => p.brand === selectedBrand);
    if (filterMode === 'category' && selectedCategory) return glasses.filter(p => p.category === selectedCategory);
    return glasses;
  }, [glasses, filterMode, selectedBrand, selectedCategory]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfie(imageSrc);
      setUseCamera(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startProcessing = async () => {
    if (!selfie || !selectedProduct) return;
    
    setStep('process');
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      const frameUrl = selectedProduct.images[0];
      const absoluteFrameUrl = frameUrl.startsWith('http') 
        ? frameUrl 
        : window.location.origin + (frameUrl.startsWith('/') ? frameUrl : '/' + frameUrl);
      
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfie: selfie.split(',')[1],
          frameUrl: absoluteFrameUrl
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.image) {
        setResultImage(`data:${data.mimeType || 'image/jpeg'};base64,${data.image}`);
        setStep('result');
      } else {
        setErrorMessage(data.error || 'Произошла ошибка при генерации. Попробуйте другое фото.');
        setStep('capture');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Ошибка соединения с сервером. Проверьте интернет-соединение.');
      setStep('capture');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    
    // Convert to JPEG using canvas
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // White background (JPEG doesn't support transparency)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const link = document.createElement('a');
      link.href = jpegDataUrl;
      link.download = `vizhu-tryon-${Date.now()}.jpg`;
      link.click();
    };
    img.src = resultImage;
  };

  const reset = () => {
    setSelfie(null);
    setResultImage(null);
    setStep('capture');
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-3 md:px-6 transition-colors duration-500" style={{ backgroundColor: DEEP_PURPLE }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Header */}
        <div className="text-center mb-4 md:mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: GOLD }}
          >
            Примерить с ИИ
          </motion.h1>
          <p className="text-purple-200/60 text-sm mt-1">Организуйте выбор и получите идеальный результат</p>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm flex items-center justify-between"
            >
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="ml-2 shrink-0 hover:bg-red-500/20 rounded-full p-1">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Interaction Area */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="relative overflow-hidden border-2 rounded-2xl" 
                  style={{ backgroundColor: PURPLE, borderColor: GOLD + '30' }}>
              
              {/* Image Container — Centered result focus */}
              <div className="aspect-video md:aspect-4/3 relative bg-black/20">
                <AnimatePresence mode="wait">
                  {step === 'capture' && (
                    <motion.div 
                      key="capture"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-4"
                    >
                      {!selfie && !useCamera ? (
                        <div className="space-y-4 text-center">
                          <div className="flex justify-center gap-4">
                            <Button 
                              onClick={() => setUseCamera(true)}
                              className="bg-amber-600 hover:bg-amber-500 text-white h-16 w-16 rounded-full shadow-lg shadow-amber-600/20"
                            >
                              <Camera size={32} />
                            </Button>
                            <Button 
                              onClick={() => fileInputRef.current?.click()}
                              variant="outline"
                              className="border-amber-600 text-amber-600 hover:bg-amber-600/10 h-16 w-16 rounded-full shadow-lg"
                            >
                              <Upload size={32} />
                            </Button>
                          </div>
                          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                          <p className="text-purple-100/80 text-sm font-medium">Сфотографируйтесь или загрузите фото лица</p>
                        </div>
                      ) : useCamera ? (
                        <div className="absolute inset-0">
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            videoConstraints={{ facingMode: 'user' }}
                          />
                          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                            <Button onClick={capture} className="bg-amber-500 text-purple-900 font-bold px-8 py-3 rounded-full text-base shadow-xl">
                              СДЕЛАТЬ ФОТО
                            </Button>
                            <Button onClick={() => setUseCamera(false)} variant="secondary" className="rounded-full text-sm px-6">
                              ОТМЕНА
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0">
                          <img src={selfie!} alt="Selfie" className="w-full h-full object-cover" />
                          <Button 
                            onClick={() => setSelfie(null)} 
                            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 p-0"
                          >
                            <X size={16} />
                          </Button>
                          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <Button 
                              onClick={startProcessing}
                              disabled={!selectedProduct}
                              className="bg-amber-500 hover:bg-amber-400 text-purple-900 font-bold px-10 py-6 text-lg rounded-full shadow-2xl shadow-amber-500/40"
                            >
                              <Sparkles size={20} className="mr-2" />
                              ПРИМЕРИТЬ
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === 'process' && (
                    <motion.div 
                      key="process"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 bg-black/60 backdrop-blur-md"
                    >
                      <div className="relative">
                        <Loader2 className="animate-spin text-amber-500" size={64} />
                        <Sparkles className="absolute -top-2 -right-2 text-amber-300 animate-pulse" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">Генерируем идеальный образ...</h2>
                        <p className="text-purple-200/70 text-sm">Пожалуйста, подождите около 20 секунд</p>
                      </div>
                    </motion.div>
                  )}

                  {step === 'result' && (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center p-2"
                    >
                       {/* Centering focus: object-contain for full face visibility */}
                      <img src={resultImage!} alt="Try-on result" className="w-full h-full object-contain drop-shadow-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar for Result */}
              {step === 'result' && (
                <div className="p-4 flex flex-wrap gap-3 bg-black/40 backdrop-blur-md border-t border-white/5">
                  <Button onClick={downloadResult} className="bg-amber-500 hover:bg-amber-400 text-purple-900 font-bold flex-1 h-12">
                    <Download size={18} className="mr-2" /> Скачать JPEG
                  </Button>
                  <Button onClick={() => { setStep('capture'); setResultImage(null); }} variant="outline" className="border-purple-400 text-white hover:bg-purple-800 flex-1 h-12">
                    <RefreshCw size={18} className="mr-2" /> Другие очки
                  </Button>
                  <Button onClick={reset} variant="outline" className="border-purple-400 text-white hover:bg-purple-800 h-12">
                    <Camera size={18} className="mr-2" /> Новое фото
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar: Organized Selection */}
          <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
             {/* Filter Tabs */}
             <div className="bg-purple-900/30 p-2 rounded-2xl mb-4 border border-white/5">
                <div className="flex gap-1 mb-2">
                   {(['all', 'brand', 'category'] as FilterType[]).map((mode) => (
                     <button
                       key={mode}
                       onClick={() => setFilterMode(mode)}
                       className={cn(
                         "flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                         filterMode === mode ? "bg-amber-500 text-purple-900" : "text-purple-300 hover:bg-white/5"
                       )}
                     >
                       {mode === 'all' ? 'Все' : mode === 'brand' ? 'Бренды' : 'Типы'}
                     </button>
                   ))}
                </div>

                {/* Sub-filters (Brand or Category) */}
                <AnimatePresence mode="wait">
                   {filterMode !== 'all' && (
                     <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
                     >
                        {(filterMode === 'brand' ? brands : categories).map((opt) => (
                           <button
                             key={opt}
                             onClick={() => filterMode === 'brand' ? setSelectedBrand(opt) : setSelectedCategory(opt)}
                             className={cn(
                               "shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                               (filterMode === 'brand' ? selectedBrand === opt : selectedCategory === opt)
                                 ? "bg-purple-600 border-purple-500 text-white"
                                 : "border-purple-800 text-purple-300 hover:border-purple-600"
                             )}
                           >
                              {opt}
                           </button>
                        ))}
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>

             {/* Product List */}
             <div className="flex-1 min-h-0 bg-purple-900/20 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                <h3 className="text-sm font-bold p-3 border-b border-white/5 flex items-center gap-2" style={{ color: GOLD }}>
                  <Filter size={14} /> Модели ({filteredGlasses.length})
                </h3>
                <ScrollArea className="flex-1 p-3">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 pb-4">
                    {isLoadingProducts ? (
                      <div className="col-span-2 py-12 text-center text-purple-300">
                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                        Загрузка...
                      </div>
                    ) : (
                      filteredGlasses.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedProduct(product)}
                          className={cn(
                            "p-2.5 rounded-xl cursor-pointer transition-all border-2 flex flex-col lg:flex-row items-center gap-3",
                            selectedProduct?.id === product.id 
                              ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' 
                              : 'border-purple-800 bg-purple-900/40 hover:border-purple-600'
                          )}
                        >
                          <div className="w-full lg:w-16 h-16 relative bg-white rounded-lg overflow-hidden shrink-0">
                            <Image 
                              src={product.images[0] || '/images/placeholder.jpg'} 
                              alt={product.name} 
                              fill 
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0 text-center lg:text-left">
                            <h4 className="font-bold text-white text-[13px] truncate leading-tight mb-0.5">{product.name}</h4>
                            <p className="text-[10px] text-purple-300 font-medium truncate mb-1">{product.brand}</p>
                            <p className="text-amber-500 font-bold text-[12px]">{product.price} сом</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
