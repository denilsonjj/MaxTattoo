import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Zap } from 'lucide-react';

const MotionArticle = motion.article;

export default function PromotionsSection({ promotions }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {promotions.map((promo, index) => (
        <MotionArticle
          key={promo.id}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: index * 0.07, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          whileHover={{ y: -7 }}
          className="promo-tile group"
        >
          <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-lg border border-[#b72f36]/35 bg-[#18090a]/86 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#f4efe7] backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-[#b72f36]" />
            Promo
          </div>

          {promo.image_url && (
            <div className="relative h-56 overflow-hidden">
              <img
                src={promo.image_url}
                alt={promo.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-transparent" />
            </div>
          )}

          <div className="relative space-y-4 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 shrink-0 text-[#b7a27a]" />
              <h3 className="text-xl font-black leading-tight tracking-tight text-[#f4efe7]">{promo.title}</h3>
            </div>

            {promo.description && <p className="text-sm leading-6 text-[#d4ccc0]/62">{promo.description}</p>}

            <div className="flex items-end gap-3 pt-2">
              {promo.original_price && <span className="text-sm font-bold text-[#d4ccc0]/36 line-through">{promo.original_price}</span>}
              <span className="text-3xl font-black text-[#b7a27a]">{promo.promo_price}</span>
            </div>
          </div>
        </MotionArticle>
      ))}
    </div>
  );
}
