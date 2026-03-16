'use client';

import { useAssistantStore } from '@/stores/assistantStore';
import VirtualMirror from './VirtualMirror';
import { getProducts } from '@/lib/db';
import { useEffect, useState } from 'react';
import { Product } from '@/types';

export default function GlobalMirror() {
  const { isMirrorOpen, setMirrorOpen, selectedProductId } = useAssistantStore();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    getProducts().then(setDbProducts);
  }, []);

  if (!isMounted) return null;

  const selectedProduct = dbProducts.find(p => p.id === selectedProductId);

  return (
    <VirtualMirror
      isOpen={isMirrorOpen}
      onClose={() => setMirrorOpen(false)}
      product={selectedProduct || undefined}
    />
  );
}
