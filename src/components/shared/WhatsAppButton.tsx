'use client';

import { MessageCircle, X, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/996772188802?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%83%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%B5%D0%B5"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all animate-pulse-glow"
      aria-label="Написать в WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  );
}
