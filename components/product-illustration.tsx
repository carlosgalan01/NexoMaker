import { Cpu, Zap } from "lucide-react";

export function ProductIllustration({ type }: { type: string }) {
  const isPrinter = type.startsWith("printer");
  const isSpool = type.startsWith("spool");
  const isBoard = type.startsWith("board") || type === "sensors";
  return (
    <div className={`illustration ${type}`}>
      {isPrinter && (
        <div className="ill-printer">
          <i />
          <i />
          <span>
            <b />
          </span>
          <em />
        </div>
      )}
      {isSpool && (
        <div className="ill-spool">
          <i />
          <span />
          <b />
        </div>
      )}
      {isBoard && (
        <div className="ill-board">
          <Cpu />
          <i />
          <i />
          <i />
        </div>
      )}
      {type === "laser" && (
        <div className="ill-laser">
          <i />
          <i />
          <span>
            <Zap />
          </span>
          <em />
        </div>
      )}
      {type === "cnc" && (
        <div className="ill-cnc">
          <i />
          <span />
          <b />
        </div>
      )}
      {type === "solder" && (
        <div className="ill-solder">
          <i />
          <span />
          <b />
        </div>
      )}
      {type === "caliper" && (
        <div className="ill-caliper">
          <i />
          <span />
        </div>
      )}
      {type === "kit-plant" && (
        <div className="ill-kit">
          <Cpu />
          <span className="plant">♧</span>
          <i />
          <b />
        </div>
      )}
      {type === "kit-weather" && (
        <div className="ill-kit weather">
          <Cpu />
          <span>☀</span>
          <i />
          <b />
        </div>
      )}
    </div>
  );
}
