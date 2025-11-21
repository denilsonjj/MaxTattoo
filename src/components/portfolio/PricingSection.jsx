import React from 'react';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingSection({ pricing }) {
  if (!pricing || pricing.length === 0) {
    return (
      <div className="text-center py-8 text-[#FAFAFA]/40">
        Nenhum preço cadastrado ainda
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pricing.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group relative bg-gradient-to-br from-[#151515] to-[#101010] border-2 border-[#E60000]/20 rounded-2xl p-6 md:p-8 hover:border-[#E60000]/60 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#E60000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{item.icon || '✨'}</span>
                <h3 className="text-[#FAFAFA] font-black text-xl md:text-2xl">{item.title}</h3>
              </div>
              {item.subtitle && (
                <p className="text-[#FAFAFA]/60 text-sm mb-4">{item.subtitle}</p>
              )}
              <div className="flex items-baseline gap-2">
                <p className="text-[#E60000] font-black text-2xl md:text-3xl">{item.price}</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E60000]/20 to-[#FF4444]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-[#E60000]" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}