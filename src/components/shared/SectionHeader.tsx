'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = 'center',
  dark = false 
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={`text-4xl sm:text-5xl font-serif mb-6 leading-tight ${dark ? 'text-white' : 'text-foreground'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-base sm:text-lg max-w-2xl font-light leading-relaxed ${align === 'center' ? 'mx-auto' : ''} ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}
        <div className={`h-1 w-20 bg-vizhu-purple mt-8 ${align === 'center' ? 'mx-auto' : ''} rounded-full`} />
      </motion.div>
    </div>
  );
}
