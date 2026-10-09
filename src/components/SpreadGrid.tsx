import React, { useRef } from 'react';
import { motion, MotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMediaQuery } from '../lib/useMediaQuery';

// One grid item: starts gathered in the middle of the grid, fanned slightly like a hand
// of cards, and moves to its own cell as `progress` goes 0 -> 1.
const SpreadItem: React.FC<{
  index: number;
  count: number;
  cols: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}> = ({ index, count, cols, progress, children }) => {
  const rows = Math.ceil(count / cols);
  // Distance (in cells) from this item's cell to the grid's centre
  const dx = (cols - 1) / 2 - (index % cols);
  const dy = (rows - 1) / 2 - Math.floor(index / cols);
  const fan = index - (count - 1) / 2;

  // ~108% of the item's own size covers one cell plus the gap
  const x = useTransform(progress, (p) => `${dx * 108 * (1 - p)}%`);
  const y = useTransform(progress, (p) => `${dy * 108 * (1 - p)}%`);
  const rotate = useTransform(progress, (p) => fan * 6 * (1 - p));
  const scale = useTransform(progress, (p) => 0.9 + 0.1 * p);

  return (
    <motion.div style={{ x, y, rotate, scale, zIndex: count - Math.abs(Math.round(fan)) }} className="relative">
      {children}
    </motion.div>
  );
};

/**
 * Grid whose items begin stacked together in the centre and spread out evenly to their
 * own places as the grid scrolls into view (scroll-linked, so it reverses on scroll up).
 */
export const SpreadGrid: React.FC<{
  className: string;
  /** Column count with no breakpoint matched, then at each breakpoint - mirror the grid classes */
  baseCols: number;
  smCols?: number; // >= 640px
  lgCols?: number; // >= 1024px
  children: React.ReactNode[];
}> = ({ className, baseCols, smCols, lgCols, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isSm = useMediaQuery('(min-width: 640px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const cols = (isLg && lgCols) || (isSm && smCols) || baseCols;
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Gathered while the grid's top is low on screen; fully spread by the time it's ~40% up
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'start 40%'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const progress = useTransform(smooth, (p) => (reduceMotion ? 1 : p));

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <SpreadItem key={i} index={i} count={children.length} cols={cols} progress={progress}>
          {child}
        </SpreadItem>
      ))}
    </div>
  );
};
