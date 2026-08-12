"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, BadgeCheck, CircleAlert, Cpu, ListChecks, RotateCcw, Sparkles } from "lucide-react";
import { assistantReplies, getProduct, money, type AssistantReply } from "@/data/products";
import { ProductIllustration } from "@/components/product-illustration";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useCart } from "@/lib/cart-context";

type Turn = {
  id: number;
  question: string;
  reply: AssistantReply;
  reveal: number; // 0 thinking, 1 answer, 2 config, 3 warning
};

function matchScenario(text: string): AssistantReply {
  const value = text.toLowerCase();
  if (/(riego|agua|planta|humedad|wifi|conect)/.test(value)) return assistantReplies[1];
  if (/(taller|fiable|impresora|prototip|repetib)/.test(value)) return assistantReplies[2];
  return assistantReplies[0];
}

export function AssistExperience() {
  const reduced = useReducedMotion();
  const { addMany } = useCart();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [turns, reduced]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const reply = matchScenario(trimmed);
    const id = nextId.current++;
    setDraft("");
    setBusy(true);
    setTurns((prev) => [...prev, { id, question: trimmed, reply, reveal: 0 }]);

    const step = (reveal: number) =>
      setTurns((prev) => prev.map((turn) => (turn.id === id ? { ...turn, reveal } : turn)));

    const delays = reduced ? [0, 0, 0] : [650, 500, 550];
    let elapsed = 0;
    [1, 2, 3].forEach((reveal, index) => {
      elapsed += delays[index];
      window.setTimeout(() => {
        step(reveal);
        if (reveal === 3) setBusy(false);
      }, elapsed);
    });
  }

  function reset() {
    setTurns([]);
    setBusy(false);
  }

  return (
    <main className="page assist-page">
      <header className="assist-hero">
        <span className="beta-pill">
          <Sparkles size={14} /> Demostración guiada
        </span>
        <h1>Nexo Assist</h1>
        <p>
          Describe lo que quieres construir y verás cómo se transforma en una configuración compatible.
          Esta es una <strong>demostración</strong>: sigue reglas fijas y no utiliza un modelo de IA real.
        </p>
      </header>

      <div className="assist-console">
        <div className="assist-thread" ref={scrollRef}>
          {turns.length === 0 && (
            <div className="assist-placeholder">
              <div className="assist-avatar">
                <Sparkles size={22} />
              </div>
              <p>Empieza con un ejemplo o escribe tu propia idea abajo.</p>
            </div>
          )}

          {turns.map((turn) => {
            const items = turn.reply.productIds.map(getProduct).filter(Boolean);
            return (
              <div className="assist-turn" key={turn.id}>
                <div className="user-bubble">{turn.question}</div>

                {turn.reveal === 0 ? (
                  <div className="typing" aria-label="Nexo Assist está preparando la respuesta">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <div className="assistant-bubble">
                    <div className="thinking-label">
                      <Sparkles size={15} /> Nexo Assist
                    </div>
                    <h3>{turn.reply.title}</h3>
                    <p>{turn.reply.body}</p>
                    <div className="check-list">
                      {turn.reply.checks.map((check) => (
                        <span key={check}>
                          <ListChecks size={14} /> {check}
                        </span>
                      ))}
                    </div>

                    {turn.reveal >= 2 && (
                      <div className="recommendation-block reveal">
                        <span className="block-label">
                          <Cpu size={14} /> Configuración propuesta
                        </span>
                        {items.map((product) => (
                          <div className="recommendation-line" key={product!.id}>
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
                    )}

                    {turn.reveal >= 3 && (
                      <div className="reveal">
                        <div className="warning">
                          <CircleAlert size={18} />
                          <span>
                            <strong>Límite importante:</strong> {turn.reply.warning}
                          </span>
                        </div>
                        <div className="assistant-actions">
                          <span>
                            <BadgeCheck size={15} /> Basado en reglas y fichas de demostración
                          </span>
                          <button onClick={() => addMany(items.map((product) => product!))}>
                            Añadir configuración a la cesta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="assist-composer">
          <div className="example-chips">
            {assistantReplies.map((reply) => (
              <button key={reply.question} onClick={() => send(reply.question)} disabled={busy}>
                {reply.question.length > 46 ? `${reply.question.slice(0, 46)}…` : reply.question}
              </button>
            ))}
            {turns.length > 0 && (
              <button className="chip-reset" onClick={reset} disabled={busy}>
                <RotateCcw size={13} /> Reiniciar
              </button>
            )}
          </div>
          <form
            className="composer-row"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Describe lo que quieres construir…"
              aria-label="Describe tu proyecto"
              disabled={busy}
            />
            <button type="submit" aria-label="Enviar" disabled={busy || !draft.trim()}>
              <ArrowUp size={18} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
