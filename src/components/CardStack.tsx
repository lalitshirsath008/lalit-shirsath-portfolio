import React, { useRef, useState } from 'react';
import { motion, MotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMediaQuery } from '../lib/useMediaQuery';

// Scroll distance (in viewport heights) spent moving from one card to the next
const VH_PER_CARD = 40;
// How many cards stay visible on each side of the front one
const MAX_SIDE_DEPTH = 3;
// Horizontal offset (as % of card width) and scale for cards 1, 2, 3 places from the front
const SIDE_X = [0, 58, 82, 98];
const SIDE_SCALE = [1, 0.84, 0.7, 0.58];

// Linear interpolation into one of the lookup tables above, for a fractional depth
const lookup = (table: number[], depth: number) => {
  const d = Math.min(depth, MAX_SIDE_DEPTH);
  const i = Math.floor(d);
  const t = d - i;
  return i >= MAX_SIDE_DEPTH ? table[MAX_SIDE_DEPTH] : table[i] + (table[i + 1] - table[i]) * t;
};

// Gathered pile shown before the deck spreads out: cards this many places back stay visible
const PILE_DEPTH = 3;
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

// One card in the coverflow. `pos` is the scroll position in cards (0 = first card in front);
// `intro` goes 0 -> 1 as the section scrolls in, spreading the cards from a centred pile
// (like the stats cards) out to their places in the deck.
const FlowCard: React.FC<{
  index: number;
  pos: MotionValue<number>;
  intro: MotionValue<number>;
  children: React.ReactNode;
}> = ({ index, pos, intro, children }) => {
  const leave = (o: number) => Math.min(Math.max(-o, 0), 1);
  // Deck layout - upcoming cards wait back to back on the right (offset > 0); the front card
  // leaves to the left (offset in (-1, 0)) and is gone after that.
  const deckX = (o: number) => (o >= 0 ? lookup(SIDE_X, o) : -(lookup(SIDE_X, leave(o)) + leave(o) * 60));
  const deckScale = (o: number) => (o >= 0 ? lookup(SIDE_SCALE, o) : 1 - leave(o) * 0.1);
  const deckRotateY = (o: number) => (o >= 0 ? -Math.min(o, 1) * 22 : leave(o) * 30);
  // The outgoing card stays fully opaque (no see-through overlap) until it's almost off screen
  const deckOpacity = (o: number) =>
    o >= 0 ? Math.max(0, Math.min(1, MAX_SIDE_DEPTH + 0.5 - o)) : leave(o) < 0.8 ? 1 : (1 - leave(o)) / 0.2;
  // Pile layout - slightly fanned, alternating tilt, smaller further back
  const pileRotate = (o: number) => (o % 2 === 0 ? -1 : 1) * Math.min(o, PILE_DEPTH) * 4;

  const offset = useTransform(pos, (p) => index - p);
  const x = useTransform([offset, intro], ([o, t]: number[]) => `${lerp(0, deckX(o), t)}%`);
  const scale = useTransform([offset, intro], ([o, t]: number[]) =>
    lerp(0.9 - Math.min(Math.max(o, 0), PILE_DEPTH) * 0.03, deckScale(o), t)
  );
  const rotate = useTransform([offset, intro], ([o, t]: number[]) => lerp(pileRotate(Math.max(o, 0)), 0, t));
  const rotateY = useTransform([offset, intro], ([o, t]: number[]) => lerp(0, deckRotateY(o), t));
  const opacity = useTransform([offset, intro], ([o, t]: number[]) =>
    lerp(o <= PILE_DEPTH ? 1 : 0, deckOpacity(o), t)
  );
  // Outgoing card flies out on top of everything; the rest stack by how far back they are
  const zIndex = useTransform(offset, (o) => (o < 0 ? 200 : 100 - Math.round(o * 10)));
  // Dim cards further back (a filter rather than an overlay, so their own effects stay intact)
  const filter = useTransform(offset, (o) => `brightness(${1 - Math.min(Math.max(o, 0), MAX_SIDE_DEPTH) * 0.07})`);
  const pointerEvents = useTransform(offset, (o) => (Math.abs(o) < 0.5 ? 'auto' : 'none'));

  return (
    <motion.div
      className="[grid-area:1/1] relative"
      style={{ x, scale, rotate, rotateY, opacity, zIndex, pointerEvents, filter }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Coverflow of cards: the current card sits centre stage and upcoming cards wait back to back
 * on the right. As the section scrolls in, the cards first spread out from a centred pile;
 * then, while the section is pinned on screen, scrolling brings the next card in from the
 * right and flings the current one out to the left.
 * Falls back to a plain list on small screens and for reduced-motion users.
 */
export const CardStack: React.FC<{ header: React.ReactNode; cards: React.ReactNode[]; widthClass?: string }> = ({
  header,
  cards,
  widthClass = 'max-w-3xl',
}) => {
  const n = cards.length;
  const flowing = useMediaQuery('(min-width: 768px) and (prefers-reduced-motion: no-preference)') && n > 1;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // A little dwell at the end so the last card settles before the section scrolls away
  const pos = useTransform(scrollYProgress, (v) => Math.min(v * (n - 1) * 1.12, n - 1));
  // Intro: from the section's top entering low on screen until the deck pins at the top
  const { scrollYProgress: introRaw } = useScroll({ target: ref, offset: ['start 85%', 'start start'] });
  const intro = useSpring(introRaw, { stiffness: 120, damping: 24, mass: 0.4 });
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(pos, 'change', (p) => setCurrent(Math.min(Math.round(p), n - 1)));

  if (!flowing) {
    return (
      // ref stays attached so useScroll always has a mounted target
      <div ref={ref}>
        {header}
        {/* Same width as the deck, so a lone card (or the phone layout) doesn't stretch full width */}
        <div className={`space-y-6 w-full ${widthClass} mx-auto`}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.05 }}
            >
              {card}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `calc(100vh + ${(n - 1) * VH_PER_CARD}vh)` }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center pt-14">
        {header}
        <div className={`grid w-full ${widthClass} mx-auto [perspective:1600px]`}>
          {cards.map((card, i) => (
            <FlowCard key={i} index={i} pos={pos} intro={intro}>
              {card}
            </FlowCard>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <span className="font-semibold text-neutral-900 tabular-nums">{String(current + 1).padStart(2, '0')}</span>
          <div className="flex gap-1.5">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-teal-400' : 'w-1.5 bg-neutral-300'}`}
              />
            ))}
          </div>
          <span className="text-neutral-400 tabular-nums">{String(n).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
