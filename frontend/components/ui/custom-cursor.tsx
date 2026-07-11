"use client";

import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const badgeMap: Record<string, string> = {
  "text-verified-teal": "#1F8A70",
  "text-caution-amber": "#C9820A",
  "text-slate-blue": "#2C4870",
};

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || rm.matches) return;

    const style = document.createElement("style");
    style.textContent = "body, body * { cursor: none !important; }";
    document.head.appendChild(style);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;
    let sx = mx, sy = my;
    let scale = 1, scaleTarget = 1;
    let opacity = 1, opacityTarget = 1;
    let color = "#F2641A", colorTarget = "#F2641A";
    let hidden = false;
    let mag: Element | null = null;

    const resetMag = (el: Element) => {
      (el as HTMLElement).style.transition = "transform 0.25s ease";
      (el as HTMLElement).style.transform = "translate(0, 0)";
    };

    const tick = () => {
      dx += (mx - dx) * 0.3;
      dy += (my - dy) * 0.3;
      sx += (dx - sx) * 0.12;
      sy += (dy - sy) * 0.12;
      scale += (scaleTarget - scale) * 0.12;
      opacity += (opacityTarget - opacity) * 0.12;
      color = colorTarget;

      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.transform = `translate3d(${dx - 3.5}px, ${dy - 3.5}px, 0)`;
        dot.style.opacity = String(hidden ? 0 : Math.min(1, opacity));
      }
      if (ring) {
        const s = hidden ? 0.01 : Math.max(0.01, scale);
        ring.style.transform = `translate3d(${sx - 15}px, ${sy - 15}px, 0) scale(${s})`;
        ring.style.opacity = String(hidden ? 0 : Math.min(1, Math.max(0.08, opacity * 0.4)));
        ring.style.borderColor = color;
      }

      requestAnimationFrame(tick);
    };

    const hover = (cx: number, cy: number) => {
      mx = cx; my = cy;

      const el = document.elementFromPoint(cx, cy);
      if (!el) {
        hidden = true;
        if (mag) { resetMag(mag); mag = null; }
        return;
      }

      const t = (el as HTMLElement).tagName;
      if (t === "INPUT" || t === "TEXTAREA" || (el as HTMLElement).isContentEditable) {
        hidden = true;
        if (mag) { resetMag(mag); mag = null; }
        return;
      }

      const int = (el as HTMLElement).closest<HTMLElement>(
        "a, button, [role=button], [role=link], label, .group"
      );

      if (!int) {
        hidden = false;
        scaleTarget = 1;
        opacityTarget = 1;
        colorTarget = "#F2641A";
        if (mag) { resetMag(mag); mag = null; }
        return;
      }

      hidden = false;

      // Badge color detection
      let c: HTMLElement | null = int;
      while (c) {
        for (const [cls, clr] of Object.entries(badgeMap)) {
          if (c.classList.contains(cls)) {
            scaleTarget = 1.8;
            opacityTarget = 0.25;
            colorTarget = clr;
            if (mag) { resetMag(mag); mag = null; }
            return;
          }
        }
        c = c.parentElement;
      }

      // Primary CTA magnetic
      if (int.closest('[href="/register"], [href*="get-started"], [href*="Get-Started"], [href*="Get Started"]')) {
        const r = int.getBoundingClientRect();
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height / 2;
        const pdx = cx - ex, pdy = cy - ey;
        const d = Math.sqrt(pdx * pdx + pdy * pdy);
        const pull = Math.min(d * 0.1, 5);
        const a = Math.atan2(pdy, pdx);
        int.style.transition = "none";
        int.style.transform = `translate(${Math.cos(a) * pull}px, ${Math.sin(a) * pull}px)`;
        mag = int;
        scaleTarget = 1.4;
        opacityTarget = 0.2;
        colorTarget = "#F2641A";
      } else {
        scaleTarget = 1.8;
        opacityTarget = 0.2;
        colorTarget = "#F2641A";
        if (mag) { resetMag(mag); mag = null; }
      }
    };

    const onMove = (e: MouseEvent) => hover(e.clientX, e.clientY);
    const onLeave = () => { hidden = true; if (mag) resetMag(mag); mag = null; };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      style.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          top: 0, left: 0,
          width: "7px", height: "7px",
          borderRadius: "50%",
          backgroundColor: "#F2641A",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998]"
        style={{
          top: 0, left: 0,
          width: "30px", height: "30px",
          borderRadius: "50%",
          border: "1px solid #2C4870",
          willChange: "transform",
        }}
      />
    </>
  );
}
