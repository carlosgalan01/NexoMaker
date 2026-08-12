"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, BadgeCheck, CircleHelp, Cpu, Sparkles, Zap } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function moveLayers(x: number, y: number) {
    if (!sceneRef.current) return;
    const layers = sceneRef.current.querySelectorAll<HTMLElement>(".layer");
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth ?? "1");
      layer.style.translate = `${(x * depth * 14).toFixed(2)}px ${(y * depth * 14).toFixed(2)}px`;
    });
  }

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    moveLayers(x, y);
  }

  function resetPointer() {
    moveLayers(0, 0);
  }

  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <div className="eyebrow">
          <Sparkles size={16} /> Tecnología que encaja contigo
        </div>
        <h1>
          No compres piezas.
          <br />
          <span>Construye lo que imaginas.</span>
        </h1>
        <p>
          Impresión 3D, electrónica y herramientas seleccionadas para funcionar juntas. Te ayudamos a
          pasar de una idea a un proyecto completo.
        </p>
        <div className="hero-actions">
          <Link className="primary" href="/nexo-assist">
            Cuéntanos tu proyecto <ArrowRight size={18} />
          </Link>
          <Link className="secondary" href="/catalogo">
            Explorar catálogo
          </Link>
        </div>
        <div className="trust-row">
          <span>
            <BadgeCheck size={18} /> Compatibilidad revisada
          </span>
          <span>
            <CircleHelp size={18} /> Asesoramiento técnico
          </span>
        </div>
      </div>
      <div
        className="hero-workbench"
        ref={sceneRef}
        onPointerMove={handlePointer}
        onPointerLeave={resetPointer}
        aria-label="Mesa de trabajo maker con impresora 3D y electrónica"
      >
        <div className="grid-plane" />
        <div className="printer-scene layer" data-depth="1.4">
          <div className="printer-top" />
          <div className="printer-frame left" />
          <div className="printer-frame right" />
          <div className="printer-rail" />
          <div className="printer-head">
            <Zap size={18} />
          </div>
          <div className="printed-part">
            <div />
            <div />
            <div />
          </div>
          <div className="printer-bed" />
        </div>
        <div className="hero-spool layer" data-depth="2.4">
          <span />
        </div>
        <div className="hero-board layer" data-depth="3">
          <Cpu size={36} />
          <i />
          <i />
          <i />
        </div>
        <div className="compat-card layer" data-depth="3.6">
          <BadgeCheck size={22} />
          <div>
            <strong>Configuración validada</strong>
            <small>4 componentes compatibles</small>
          </div>
        </div>
      </div>
    </section>
  );
}
