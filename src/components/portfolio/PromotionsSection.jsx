import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Zap } from 'lucide-react';

export default function PromotionsSection({ promotions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {promotions.map((promo, index) => (
        <motion.div
          key={promo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, y: -10 }}
          className="group relative bg-gradient-to-br from-[#151515] to-[#101010] border-2 border-[#E60000]/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#E60000]/20 transition-all"
        >
          <div className="absolute top-4 right-4 z-10 bg-[#E60000] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Zap className="w-3 h-3" />
            PROMO
          </div>

          {promo.image_url && (
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent z-10" />
              <img
                src={promo.image_url}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}

          <div className="p-6 space-y-3">
            <div className="flex items-start gap-2">
              <Tag className="w-5 h-5 text-[#E60000] mt-1 flex-shrink-0" />
              <h3 className="text-[#FAFAFA] font-black text-xl leading-tight">
                {promo.title}
              </h3>
            </div>

            {promo.description && (
              <p className="text-[#FAFAFA]/60 text-sm leading-relaxed">
                {promo.description}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              {promo.original_price && (
                <span className="text-[#FAFAFA]/40 line-through text-lg">
                  {promo.original_price}
                </span>
              )}
              <span className="text-[#E60000] font-black text-2xl">
                {promo.promo_price}
              </span>
            </div>

            {promo.original_price && (
              <div className="inline-block bg-[#E60000]/10 border border-[#E60000]/30 rounded-lg px-3 py-1 mt-2">
                <span className="text-[#E60000] text-xs font-bold">
                  🔥 Economia garantida!
                </span>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#E60000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}