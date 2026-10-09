import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// "Character intro" name plates that slide out from behind Lalit on hover. Positions are % of the
// (square) photo box. `edge` is where the plate's inner end meets his silhouette: each plate starts
// tucked fully behind him (shifted by its own width towards him) and slides outwards from there.
// (Head: roughly x 29-63, y 2-40; shoulders x 28-85 below that.)
// Slot positions; the role names themselves come from the editable hero (admin -> Overview).
const SLOTS: { side: 'left' | 'right'; edge: number; top: number }[] = [
  { side: 'left', edge: 31, top: 25 },
  { side: 'right', edge: 60, top: 45 },
  { side: 'left', edge: 33, top: 64 },
  { side: 'right', edge: 83, top: 74 },
  { side: 'left', edge: 30, top: 89 },
];

const SLIDE = { type: 'spring', stiffness: 260, damping: 26 } as const;

/**
 * Hero portrait. The photo fades out at the bottom (a mask, not an overlay box). Hovering (or
 * tapping, on touch screens) plays a game-style character intro: name plates slide out from
 * behind Lalit with a flicker, type out his roles, and leave a blinking cursor.
 */
const HeroPhoto: React.FC<{ src: string; alt: string; roles: string[] }> = ({ src, alt, roles }) => {
  const [showRoles, setShowRoles] = useState(false);
  const plates = SLOTS.map((slot, i) => ({ ...slot, label: (roles[i] ?? '').trim() })).filter((p) => p.label);

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto aspect-square select-none"
      onMouseEnter={() => setShowRoles(true)}
      onMouseLeave={() => setShowRoles(false)}
      onClick={() => setShowRoles((s) => !s)}
    >
      <div className="absolute inset-0 bg-teal-400/15 blur-[90px] rounded-full scale-75" />

      {/* Plates sit *below* the photo, so they appear to come out from behind Lalit */}
      <AnimatePresence>
        {showRoles &&
          plates.map((p, i) => {
            const tucked = p.side === 'left' ? '100%' : '-100%'; // shifted behind him by its own width
            return (
              <motion.div
                key={p.label}
                className="absolute z-[5] pointer-events-none"
                style={{
                  top: `${p.top}%`,
                  ...(p.side === 'left' ? { right: `${100 - p.edge}%` } : { left: `${p.edge}%` }),
                }}
                initial={{ x: tucked, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { ...SLIDE, delay: i * 0.09 } }}
                exit={{ x: tucked, opacity: 0, transition: { duration: 0.2, delay: (plates.length - 1 - i) * 0.03 } }}
              >
                {/* The number goes on the outer end: the inner end is tucked against (partly behind) Lalit */}
                <div
                  className={`hero-plate flex items-center gap-2 whitespace-nowrap rounded-md border border-white/80 bg-black/60 backdrop-blur-sm py-1 sm:py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
                    p.side === 'left' ? 'px-2.5 sm:px-3' : 'flex-row-reverse pl-6 sm:pl-8 pr-2.5 sm:pr-3'
                  }`}
                  style={{ animationDelay: `${i * 0.09 + 0.15}s` }}
                >
                  <span className="text-[9px] sm:text-[10px] font-semibold text-teal-300 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-2">
                  {/* Typewriter reveal, one letter at a time */}
                  <motion.span
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-white"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{
                      clipPath: 'inset(0 0% 0 0)',
                      transition: {
                        delay: i * 0.09 + 0.25,
                        duration: p.label.length * 0.035,
                        ease: (t: number) => Math.floor(t * p.label.length) / p.label.length,
                      },
                    }}
                  >
                    {p.label}
                  </motion.span>
                  <span className="hero-plate__caret w-1.5 h-3 sm:h-3.5 bg-teal-400" />
                  </span>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        animate={{ scale: showRoles ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full h-full object-contain [mask-image:linear-gradient(to_bottom,#000_55%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_55%,transparent_98%)]"
        draggable={false}
      />
    </div>
  );
};

export default HeroPhoto;
