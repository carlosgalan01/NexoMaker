"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, CircleAlert, Cpu, FileSearch, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import { assistantReplies, getProduct, money } from "@/data/products";
import { ProductIllustration } from "@/components/product-illustration";
import { useCart } from "@/lib/cart-context";

const scenario = assistantReplies[0];
const scenarioProducts = scenario.productIds.map(getProduct).filter(Boolean);

const steps = [
  {
    icon: MessageSquare,
    label: "Paso 1",
    title: "El cliente expresa lo que quiere construir",
    body: "Todo empieza con una intención escrita con palabras normales, no con referencias de producto.",
  },
  {
    icon: ListChecks,
    label: "Paso 2",
    title: "El sistema identifica condiciones relevantes",
    body: "Del enunciado se extraen las restricciones que condicionan la elección: calor, exposición y función.",
  },
  {
    icon: FileSearch,
    label: "Paso 3",
    title: "Se consultan especificaciones y compatibilidades",
    body: "Se cruzan materiales y máquinas para descartar combinaciones que no funcionarían.",
  },
  {
    icon: Cpu,
    label: "Paso 4",
    title: "Se propone una configuración",
    body: "El resultado es un conjunto de productos compatibles entre sí, no una lista suelta.",
  },
  {
    icon: CircleAlert,
    label: "Paso 5",
    title: "Se explican advertencias y límites",
    body: "Una recomendación honesta incluye lo que puede salir mal y dónde termina la garantía de compatibilidad.",
  },
];

export function AssistScrollytelling() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { addMany } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActive(index);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="scrolly" aria-labelledby="scrolly-title">
      <div className="scrolly-inner">
        <div className="scrolly-steps">
          <div className="scrolly-intro">
            <span className="beta-pill">
              <Sparkles size={14} /> Nexo Assist · Demostración
            </span>
            <h2 id="scrolly-title">Así convierte una intención en una configuración</h2>
            <p>
              Recorre el ejemplo real de un soporte para dejar el móvil dentro del coche en verano.
              A medida que avanzas, la conversación de la derecha se transforma.
            </p>
          </div>

          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.label}
                className={active === index ? "scrolly-step is-active" : "scrolly-step"}
                data-index={index}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
              >
                <div className="step-marker">
                  <StepIcon size={18} />
                </div>
                <div>
                  <span className="step-label">{step.label}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            );
          })}

          <Link className="scrolly-cta" href="/nexo-assist">
            Abrir la experiencia completa <ArrowRight size={18} />
          </Link>
        </div>

        <div className="scrolly-sticky" aria-hidden="false">
          <div className="assist-panel">
            <div className="assist-panel-head">
              <span>
                <Sparkles size={18} />
              </span>
              <div>
                <strong>Nexo Assist</strong>
                <small>Demostración guiada · no utiliza un modelo real</small>
              </div>
              <em className="progress-dots">
                {steps.map((_, index) => (
                  <b key={index} className={index <= active ? "on" : ""} />
                ))}
              </em>
            </div>

            <div className="assist-panel-body">
              <div className={active >= 0 ? "panel-block user visible" : "panel-block user"}>
                <div className="user-bubble">{scenario.question}</div>
              </div>

              <div className={active >= 1 ? "panel-block visible" : "panel-block"}>
                <span className="panel-tag">
                  <ListChecks size={14} /> Condiciones detectadas
                </span>
                <div className="condition-chips">
                  {scenario.checks.map((check) => (
                    <span key={check}>{check}</span>
                  ))}
                </div>
              </div>

              <div className={active >= 2 ? "panel-block visible" : "panel-block"}>
                <span className="panel-tag">
                  <FileSearch size={14} /> Comprobando compatibilidad
                </span>
                <div className="scan-line">
                  <BadgeCheck size={15} /> ASA soporta calor y UV · requiere cámara cerrada
                </div>
                <div className="scan-line warn">
                  <CircleAlert size={15} /> Bambu Lab A1 descartada: sin cerramiento
                </div>
              </div>

              <div className={active >= 3 ? "panel-block visible" : "panel-block"}>
                <span className="panel-tag">
                  <Cpu size={14} /> Configuración propuesta
                </span>
                <div className="panel-config">
                  {scenarioProducts.map((product) => (
                    <div className="panel-config-line" key={product!.id}>
                      <div className="mini-visual">
                        <ProductIllustration type={product!.visual} />
                      </div>
                      <div>
                        <strong>{product!.name}</strong>
                        <small>{product!.short}</small>
                      </div>
                      <span>{money.format(product!.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={active >= 4 ? "panel-block visible" : "panel-block"}>
                <div className="panel-warning">
                  <CircleAlert size={18} />
                  <span>
                    <strong>Límite importante:</strong> {scenario.warning}
                  </span>
                </div>
                <button
                  className="panel-add"
                  onClick={() => addMany(scenarioProducts.map((product) => product!))}
                >
                  Añadir configuración a la cesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
