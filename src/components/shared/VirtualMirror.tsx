'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { X, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, Download, ShoppingBag, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { useFaceTracking } from '@/hooks/useFaceTracking';
import GlassesModel from './AR/GlassesModel';

interface VirtualMirrorProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function VirtualMirror({ isOpen, onClose, product }: VirtualMirrorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isReady, error, results } = useFaceTracking(videoRef);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const activeProduct = product || products[currentProductIndex];

  // Set initial product index
  useEffect(() => {
    if (product) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx >= 0) setCurrentProductIndex(idx);
    }
  }, [product]);

  // Hide guide when face detected
  useEffect(() => {
    if (results.current?.landmarks) {
      setShowGuide(false);
    }
  }, [results]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsCapturing(true);

    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const ctx = captureCanvas.getContext('2d')!;

    // Draw video frame
    ctx.translate(captureCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Note: To capture R3F canvas, we need to extract data from the WebGL context
    // For this demonstration, we focus on the real-time AR experience
    
    const link = document.createElement('a');
    link.download = `vizhu-mirror-${activeProduct?.name || 'glasses'}.png`;
    link.href = captureCanvas.toDataURL('image/png');
    link.click();

    setTimeout(() => setIsCapturing(false), 1000);
  };

  const nextProduct = () => setCurrentProductIndex((i) => (i + 1) % products.length);
  const prevProduct = () => setCurrentProductIndex((i) => (i - 1 + products.length) % products.length);

  const displayProduct = products[currentProductIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black flex flex-col items-center justify-center p-0 lg:p-8"
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-linear-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vizhu-purple rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera size={20} />
              </div>
              <div>
                <h2 className="text-white text-lg font-medium leading-tight">Виртуальная Примерка</h2>
                <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Powered by OptiCare AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Viewport */}
          <div className="relative w-full h-full lg:h-auto lg:max-w-5xl lg:aspect-video bg-zinc-900 lg:rounded-4xl overflow-hidden shadow-2xl border border-white/5">
            
            {/* Camera Error */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-10">
                <AlertCircle size={48} className="text-rose-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Ошибка камеры</h3>
                <p className="text-zinc-400 max-w-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Обновить страницу
                </button>
              </div>
            )}

            {/* Loading State */}
            {!isReady && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-zinc-900">
                <RefreshCw size={40} className="animate-spin text-vizhu-purple mb-6" />
                <p className="text-zinc-400 font-medium tracking-wide">Подключение AI-трекера...</p>
              </div>
            )}

            {/* Video Feed (mirrored) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover scale-x-[-1] transition-opacity duration-700",
                isReady ? "opacity-100" : "opacity-0"
              )}
            />

            {/* 3D AR Overlay */}
            {isReady && (
              <div className="absolute inset-0 pointer-events-none">
                <Canvas
                  shadows
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    
                    {/* The 3D Component */}
                    {results.current?.landmarks && (
                      <GlassesModel 
                        landmarks={results.current.landmarks} 
                        product={activeProduct} 
                      />
                    )}
                    
                    <Environment preset="city" />
                    <ContactShadows opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
                  </Suspense>
                </Canvas>
              </div>
            )}

            {/* Interaction Guide */}
            {isReady && showGuide && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-64 h-80 border-2 border-dashed border-vizhu-purple/40 rounded-[60px] flex items-center justify-center bg-vizhu-purple/5"
                >
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold text-center px-8">
                    Расположите лицо в кадре для начала примерки
                  </p>
                </motion.div>
              </div>
            )}

            {/* Flash Effect */}
            <AnimatePresence>
              {isCapturing && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-60"
                />
              )}
            </AnimatePresence>

            {/* Overlay UI: Product Info & Actions */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col sm:flex-row justify-between items-end gap-6 z-50 bg-linear-to-t from-black/80 to-transparent">
              <div className="bg-white/5 backdrop-blur-2xl p-5 rounded-[32px] border border-white/10 w-full sm:w-auto min-w-[240px]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{displayProduct?.brand}</p>
                    <h3 className="text-white font-medium text-base">{displayProduct?.name}</h3>
                  </div>
                  <p className="text-vizhu-orange font-bold text-base">{displayProduct?.price?.toLocaleString()} сом</p>
                </div>
                <p className="text-zinc-400 text-xs mb-4 line-clamp-1">
                  {typeof displayProduct?.shortDescription === 'string' 
                    ? displayProduct?.shortDescription 
                    : displayProduct?.shortDescription?.ru}
                </p>
                <button
                  onClick={() => addItem(displayProduct, displayProduct.colors[0])}
                  className="w-full py-3 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <ShoppingBag size={18} />
                  Добавить в корзину
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-vizhu-purple text-white rounded-3xl flex items-center justify-center shadow-xl shadow-vizhu-purple/30 hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera size={28} />
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>
            
            {/* Sidebar Carousel */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50">
              <button 
                onClick={prevProduct}
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 backdrop-blur-md"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto no-scrollbar py-2">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentProductIndex(i)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 bg-white/5",
                      i === currentProductIndex
                        ? "border-vizhu-purple scale-110 shadow-lg shadow-vizhu-purple/20 bg-vizhu-purple/10"
                        : "border-transparent text-white/40 hover:text-white"
                    )}
                  >
                    <span className="text-xl">
                      {p.category === 'sunglasses' ? '🕶️' : '👓'}
                    </span>
                  </button>
                ))}
              </div>

              <button 
                onClick={nextProduct}
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
