import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import JackLogo from './JackLogo';

// A "route" down the left edge: Jack's logo travels along it as the page scrolls,
// painting the road teal behind it, and each stop lights up as the marker reaches it.
// The marker sits on an imaginary line 60% down the viewport - the same line used to
// decide when a stop is "reached", so the two always agree.
const ARRIVAL_LINE = '60%';

export const JourneyTimeline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${ARRIVAL_LINE}`, `end ${ARRIVAL_LINE}`] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const travelled = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div ref={ref} className="relative pl-12 sm:pl-16">
      {/* Road: dashed grey ahead, solid teal behind the marker */}
      <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-[repeating-linear-gradient(to_bottom,#d4d4d4_0_8px,transparent_8px_14px)]" />
      <motion.div
        className="absolute left-[19px] sm:left-[27px] top-0 w-0.5 bg-teal-400 origin-top"
        style={{ height: travelled }}
      />

      {/* Jack's animated mark travels down the road as the marker */}
      <motion.div
        className="absolute left-0 sm:left-2 z-20 w-10 h-10 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        style={{ top: travelled }}
        aria-hidden
      >
        <JackLogo size={34} />
      </motion.div>

      <div className="space-y-6">{children}</div>
    </div>
  );
};

// One stop on the route; its marker lights up once the marker has reached it.
export const TimelineStop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1px sentinel at the marker's height: its progress flips 0 -> 1 as it crosses the arrival line
  const markerRef = useRef<HTMLSpanElement>(null);
  const [reached, setReached] = useState(false);
  const { scrollYProgress } = useScroll({
    target: markerRef,
    offset: [`start ${ARRIVAL_LINE}`, `end ${ARRIVAL_LINE}`],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setReached(v > 0.5));

  return (
    <div className="relative group/stop" data-reached={reached}>
      <span ref={markerRef} className="absolute top-9 left-0 h-px w-px pointer-events-none" aria-hidden />
      <span
        className={`absolute -left-[36px] sm:-left-[44px] top-7 z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
          reached
            ? 'bg-teal-400 border-teal-400 shadow-[0_0_0_6px_rgba(45,212,191,0.18)] scale-110'
            : 'bg-white border-neutral-300'
        }`}
        aria-hidden
      />
      <div className={`transition-opacity duration-500 ${reached ? 'opacity-100' : 'opacity-70'}`}>{children}</div>
    </div>
  );
};
