"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, ShoppingBag } from "lucide-react";
import { getProduct, money } from "@/data/products";
import { ProductIllustration } from "@/components/product-illustration";
import { useCart } from "@/lib/cart-context";

type StepDef = {
  key: string;
  question: string;
  options: { value: string; label: string; note: string }[];
};

const stepDefs: StepDef[] = [
  {
    key: "goal",
    question: "¿Qué quieres construir?",
    options: [
      { value: "impreso", label: "Objeto funcional impreso", note: "Piezas de uso real" },
      { value: "iot", label: "Dispositivo conectado", note: "Sensores y WiFi" },
      { value: "corte", label: "Corte o grabado", note: "Madera y acrílico" },
      { value: "taller", label: "Equipar un taller", note: "Base de trabajo" },
    ],
  },
  {
    key: "level",
    question: "¿Cuál es tu nivel técnico?",
    options: [
      { value: "inicio", label: "Empiezo ahora", note: "Prefiero guía paso a paso" },
      { value: "medio", label: "Algún proyecto hecho", note: "Me defiendo" },
      { value: "avanzado", label: "Tengo experiencia", note: "Busco control" },
    ],
  },
  {
    key: "env",
    question: "¿Dónde se va a usar?",
    options: [
      { value: "interior", label: "Interior", note: "Casa u oficina" },
      { value: "exterior", label: "Exterior / intemperie", note: "Calor, sol, humedad" },
      { value: "intensivo", label: "Taller / uso intensivo", note: "Muchas horas" },
    ],
  },
  {
    key: "budget",
    question: "¿Presupuesto aproximado?",
    options: [
      { value: "bajo", label: "Hasta 100 €", note: "Empezar con lo justo" },
      { value: "medio", label: "100 – 400 €", note: "Margen razonable" },
      { value: "alto", label: "Más de 400 €", note: "Equipo serio" },
    ],
  },
];

function buildProposal(answers: Record<string, string>) {
  const { goal, env, budget } = answers;
  let ids: number[] = [];
  let headline = "Una base compatible para empezar";

  if (goal === "impreso") {
    headline = "Impresión con piezas que aguantan";
    ids = env === "exterior" ? [2, 6, 13] : budget === "alto" ? [3, 5, 13] : [1, 4, 13];
  } else if (goal === "iot") {
    headline = "Electrónica conectada sin piezas sueltas";
    ids = budget === "bajo" ? [8, 9, 12] : [14, 8, 12];
  } else if (goal === "corte") {
    headline = "Corte y grabado con margen de trabajo";
    ids = budget === "alto" ? [10, 12, 13] : [11, 12, 13];
  } else {
    headline = "Un taller que se puede mantener";
    ids = budget === "alto" ? [3, 12, 13] : [12, 13, 4];
  }

  const products = ids.map(getProduct).filter(Boolean);
  return { headline, products };
}

export function ProjectConfigurator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { addMany } = useCart();

  const isResult = step === stepDefs.length;
  const current = stepDefs[step];
  const proposal = useMemo(() => (isResult ? buildProposal(answers) : null), [isResult, answers]);
  const total = proposal ? proposal.products.reduce((sum, p) => sum + p!.price, 0) : 0;

  function choose(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    window.setTimeout(() => setStep((s) => s + 1), 160);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <section className="configurator" aria-labelledby="config-title">
      <div className="config-shell" data-goal={answers.goal ?? "none"}>
        <div className="config-side">
          <span className="kicker light">Configurador de proyecto</span>
          <h2 id="config-title">Arma tu proyecto en cuatro decisiones</h2>
          <p>
            Una simulación de front-end para orientarte. No es una recomendación generada por una IA
            real: sigue reglas fijas sobre el catálogo de demostración.
          </p>
          <ol className="config-progress" aria-hidden="true">
            {stepDefs.map((def, index) => (
              <li
                key={def.key}
                className={index < step ? "done" : index === step ? "current" : ""}
              >
                <b>{index + 1}</b>
                {def.question}
              </li>
            ))}
            <li className={isResult ? "current" : ""}>
              <b>{stepDefs.length + 1}</b>
              Propuesta
            </li>
          </ol>
        </div>

        <div className="config-panel">
          {!isResult ? (
            <div className="config-question" key={current.key}>
              <div className="config-question-head">
                <span>
                  Paso {step + 1} de {stepDefs.length}
                </span>
                {step > 0 && (
                  <button className="config-back" onClick={() => setStep((s) => s - 1)}>
                    <ArrowLeft size={15} /> Atrás
                  </button>
                )}
              </div>
              <h3>{current.question}</h3>
              <div className="config-options">
                {current.options.map((option) => (
                  <button
                    key={option.value}
                    className={answers[current.key] === option.value ? "config-option active" : "config-option"}
                    onClick={() => choose(option.value)}
                  >
                    <strong>{option.label}</strong>
                    <small>{option.note}</small>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="config-result">
              <span className="config-result-tag">Propuesta simulada</span>
              <h3>{proposal!.headline}</h3>
              <div className="config-result-list">
                {proposal!.products.map((product) => (
                  <div className="config-result-line" key={product!.id}>
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
              <div className="config-result-foot">
                <div>
                  <small>Total orientativo</small>
                  <strong>{money.format(total)}</strong>
                </div>
                <div className="config-result-actions">
                  <button className="ghost" onClick={reset}>
                    <RotateCcw size={15} /> Volver a empezar
                  </button>
                  <button
                    className="primary"
                    onClick={() => addMany(proposal!.products.map((product) => product!))}
                  >
                    <ShoppingBag size={16} /> Añadir a la cesta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
