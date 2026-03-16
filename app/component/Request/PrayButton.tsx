"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  actionPrayerCheck,
  actionGetPrayCount,
} from "@/app/action/prayerCheckAction";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

type Bubble = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  delay: number;
};

type PrayButtonProps = {
  targetUserId: number;
  initialIsChecked: boolean;
};

export function PrayButton({
  targetUserId,
  initialIsChecked,
}: PrayButtonProps) {
  const [lit, setLit] = useState(initialIsChecked);
  const [prayedCount, setPrayedCount] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialIsChecked) {
      actionGetPrayCount(targetUserId).then(setPrayedCount);
    }
  }, [initialIsChecked, targetUserId]);

  const spawnBubbles = useCallback(() => {
    const newBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 120 - 60,
      y: -(Math.random() * 60 + 50),
      rotate: Math.random() * 60 - 30,
      size: Math.random() * 0.6 + 0.9,
      delay: Math.random() * 0.15,
    }));
    setBubbles(newBubbles);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setBubbles([]), 1200);
  }, []);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      spawnBubbles();
      if (!lit) {
        setLit(true);
        const count = await actionPrayerCheck(targetUserId);
        setPrayedCount(count);
      }
    },
    [lit, targetUserId, spawnBubbles],
  );

  return (
    <div
      className="flex flex-col items-center gap-1 pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative inline-flex items-center justify-center">
        {/* 하트 버블 애니메이션 */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.span
              key={bubble.id}
              initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: bubble.size }}
              animate={{
                opacity: 0,
                y: bubble.y,
                x: bubble.x,
                rotate: bubble.rotate,
                scale: bubble.size * 0.6,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, delay: bubble.delay, ease: [0.2, 0.8, 0.4, 1] }}
              style={{
                position: "absolute",
                fontSize: "1.1rem",
                pointerEvents: "none",
                left: "50%",
                bottom: "50%",
                marginLeft: "-0.55rem",
                marginBottom: "-0.55rem",
              }}
            >
              ❤️
            </motion.span>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleClick}
          className="w-8 h-8 flex items-center justify-center active:scale-90 transition-transform rounded-full"
          aria-label="기도체크"
        >
          <Image
            src="/candle-on.png"
            alt="기도 양초"
            width={24}
            height={24}
            style={{
              filter: lit ? "none" : "grayscale(1) brightness(0.7)",
              transition: "filter 0.3s ease",
            }}
          />
        </button>
      </div>

      {/* 기도 인원 텍스트 — 고정 높이 유지 */}
      <div style={{ minHeight: "1.25rem" }}>
        {lit && prayedCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-muted-foreground text-center"
          >
            {prayedCount}명이 함께 기도중🔥
          </motion.p>
        )}
      </div>
    </div>
  );
}
