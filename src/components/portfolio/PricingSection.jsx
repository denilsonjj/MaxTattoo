import React from 'react';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function PricingSection({ pricing }) {
  if (!pricing || pricing.length === 0) {
    return (
      <div className="quiet-panel py-12 text-center text-[#d4ccc0]/48">
        Nenhum valor cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {pricing.map((item, index) => (
        <MotionDiv
          key={item.id}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: index * 0.06, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          whileHover={{ y: -6 }}
          className="price-tile"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.045] text-lg">
                  {item.icon || <DollarSign className="h-5 w-5 text-[#b7a27a]" />}
                </span>
                <h3 className="text-xl font-black tracking-tight text-[#f4efe7] md:text-2xl">{item.title}</h3>
              </div>
              {item.subtitle && <p className="max-w-lg text-sm leading-6 text-[#d4ccc0]/60">{item.subtitle}</p>}
            </div>
            <p className="shrink-0 text-right text-2xl font-black text-[#b7a27a] md:text-3xl">{item.price}</p>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
}
