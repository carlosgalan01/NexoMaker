"use client";

import { useMemo, useState } from "react";
import { Download, History, ImagePlus, MessageSquare, Send, ShieldCheck, Sparkles, Type, Users } from "lucide-react";

type Version = { id: number; text: string; action: string };
type GalleryItem = { id: number; src: string; prompt: string; demo: boolean };

const starterText = "Presentamos una impresora 3D cerrada para crear piezas resistentes con mayor control de temperatura. Una opcion pensada para talleres y makers que quieren avanzar a materiales tecnicos.";

export default function StudioPage() {
  const [tab, setTab] = useState<"visual" | "texto" | "galeria">("visual");
  const [role, setRole] = useState("Disenador");
  const [prompt, setPrompt] = useState("Impresora 3D cerrada fabricando un soporte de movil resistente al calor en un taller limpio");
  const [style, setStyle] = useState("fotografia de producto");
  const [image, setImage] = useState("/campaign-demo.webp");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [text, setText] = useState(starterText);
  const [versions, setVersions] = useState<Version[]>([{ id: 1, text: starterText, action: "Original" }]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>(["Aprobacion: comprobar la temperatura maxima antes de publicar."]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("El resultado indicara si procede de Amazon Bedrock o del modo demostracion.");

  const canGenerate = role !== "Aprobador";
  const canApprove = role === "Aprobador";
  const versionLabel = useMemo(() => `v${versions.length}`, [versions.length]);

  async function generateImage() {
    if (!canGenerate) return;
    setLoading(true);
    const response = await fetch("/api/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, style, aspectRatio: "16:9" }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setNotice(data.error || "No se pudo generar la imagen.");
    setImage(data.image);
    setGallery((items) => [{ id: Date.now(), src: data.image, prompt, demo: data.demo }, ...items]);
    setNotice(data.demo ? "Resultado de muestra. Bedrock aun no esta configurado." : "Imagen generada con Stability AI en Amazon Bedrock.");
  }

  async function editText(action: string) {
    if (!canGenerate) return;
    setLoading(true);
    const response = await fetch("/api/text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, action, tone: "claro y profesional" }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setNotice(data.error || "No se pudo editar el texto.");
    setText(data.output);
    setVersions((items) => [...items, { id: Date.now(), text: data.output, action }]);
    setNotice(data.demo ? "Edicion simulada. Bedrock aun no esta configurado." : "Texto editado con Claude en Amazon Bedrock.");
  }

  function addComment() {
    if (!comment.trim()) return;
    setComments((items) => [...items, `${role}: ${comment.trim()}`]);
    setComment("");
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span>N</span><div><strong>NexoMaker Studio</strong><small>Campanas con IA generativa</small></div></div>
        <div className="status"><ShieldCheck size={16} /> Uso interno · {versionLabel}</div>
        <select aria-label="Rol activo" value={role} onChange={(event) => setRole(event.target.value)}>
          <option>Disenador</option><option>Redactor</option><option>Aprobador</option>
        </select>
      </header>

      <nav className="tabs" aria-label="Herramientas">
        <button className={tab === "visual" ? "active" : ""} onClick={() => setTab("visual")}><ImagePlus size={18} /> Visual</button>
        <button className={tab === "texto" ? "active" : ""} onClick={() => setTab("texto")}><Type size={18} /> Texto</button>
        <button className={tab === "galeria" ? "active" : ""} onClick={() => setTab("galeria")}><History size={18} /> Galeria</button>
      </nav>

      <section className="workspace">
        <div className="main-panel">
          {tab === "visual" && <>
            <div className="section-title"><div><span>01 / CREACION VISUAL</span><h1>Del briefing a una pieza revisable</h1></div><Sparkles /></div>
            <label>Descripcion de la imagen<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} /></label>
            <div className="field-row"><label>Estilo<select value={style} onChange={(event) => setStyle(event.target.value)}><option>fotografia de producto</option><option>ilustracion editorial</option><option>anime</option><option>pintura al oleo</option><option>realismo industrial</option></select></label><label>Formato<select disabled><option>16:9 · Campana web</option></select></label></div>
            <button className="primary" onClick={generateImage} disabled={loading || !canGenerate}><Sparkles size={18} /> {loading ? "Generando..." : "Generar propuesta"}</button>
            {!canGenerate && <p className="warning">El rol Aprobador puede revisar y comentar, pero no generar contenido.</p>}
            <figure className="preview"><img src={image} alt="Propuesta visual de una impresora 3D en un taller" /><figcaption><span>{notice}</span><a href={image} download="nexomaker-campaign.png" title="Descargar imagen"><Download size={18} /></a></figcaption></figure>
          </>}

          {tab === "texto" && <>
            <div className="section-title"><div><span>02 / EDICION DE COPY</span><h1>Editar sin perder el control del original</h1></div><Type /></div>
            <label>Texto de campana<textarea className="editor" value={text} onChange={(event) => setText(event.target.value)} /></label>
            <div className="actions">{["resumir", "ampliar", "corregir", "variar"].map((action) => <button key={action} onClick={() => editText(action)} disabled={loading || !canGenerate}>{action}</button>)}</div>
            <p className="notice">{notice}</p>
            <div className="history"><h2><History size={17} /> Historial</h2>{versions.slice().reverse().map((version, index) => <button key={version.id} onClick={() => setText(version.text)}><strong>v{versions.length - index}</strong><span>{version.action}</span><small>{version.text.slice(0, 76)}...</small></button>)}</div>
          </>}

          {tab === "galeria" && <>
            <div className="section-title"><div><span>03 / GALERIA</span><h1>Resultados vinculados a su briefing</h1></div><History /></div>
            <div className="gallery">{gallery.length ? gallery.map((item) => <figure key={item.id}><img src={item.src} alt={item.prompt} /><figcaption>{item.demo ? "Muestra" : "Bedrock"} · {item.prompt}</figcaption></figure>) : <div className="empty"><ImagePlus /><p>Las nuevas generaciones apareceran aqui.</p></div>}</div>
          </>}
        </div>

        <aside>
          <div className="aside-heading"><Users size={18} /><div><strong>Revision</strong><small>{role}</small></div></div>
          <div className="role-card"><span>{canApprove ? "Puede aprobar" : "Puede crear"}</span><p>Los permisos cambian con el rol seleccionado. En produccion se validarian en servidor.</p></div>
          <h2><MessageSquare size={16} /> Comentarios</h2>
          <div className="comments">{comments.map((item, index) => <p key={index}>{item}</p>)}</div>
          <div className="comment-box"><textarea placeholder="Anadir nota de revision" value={comment} onChange={(event) => setComment(event.target.value)} /><button onClick={addComment} title="Enviar comentario"><Send size={17} /></button></div>
          <div className="guardrail"><ShieldCheck size={18} /><div><strong>Antes de publicar</strong><p>Revisar datos tecnicos, derechos de imagen y posibles sesgos. La IA no aprueba contenido.</p></div></div>
        </aside>
      </section>
    </main>
  );
}
