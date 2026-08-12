"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({
  children,
  ariaLabel,
  className = "",
}: {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  function scrollBy(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.85, 640), behavior: "smooth" });
  }

  return (
    <div className={`carousel ${className}`}>
      <button
        className="carousel-arrow prev"
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        aria-label="Desplazar hacia atrás"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="carousel-track" ref={trackRef} role="group" aria-label={ariaLabel} tabIndex={0}>
        {children}
      </div>
      <button
        className="carousel-arrow next"
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        aria-label="Desplazar hacia delante"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
