/*
 * koreo editorial direction: an authoring bench with mineral paper,
 * coordinate marks, and quiet tools that keep the photograph in charge.
 */
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Clipboard, Crosshair, Download, FileImage, FileJson, Minus, Plus, Upload } from "lucide-react";

const DEFAULT_IMAGE = "/manus-storage/humahuaca-geology_811657ed.webp";
const DEFAULT_SIZE = { width: 3200, height: 2133 };

type Beat = {
  id: string;
  label: string;
  title: string;
  body: string;
  x: number;
  y: number;
  zoom: number;
  shape: "circle" | "rect" | "none";
  size: number;
  accent: string;
};

const initialBeats: Beat[] = [
  { id: "overview", label: "overview", title: "Start with the whole frame", body: "Set the scene before calling attention to a detail.", x: 50, y: 52, zoom: 1, shape: "none", size: 16, accent: "#d49b43" },
  { id: "first-focus", label: "first focus", title: "Name the detail", body: "Write the caption that asks the reader to look closer.", x: 62, y: 42, zoom: 1.32, shape: "circle", size: 14, accent: "#b4513d" },
];

const ratios = ["16:9", "4:3", "3:2", "1:1", "3:4", "2:3"];
const accentPalette = [
  "#b4513d", "#d49b43", "#d6bd45", "#7d9b4d", "#3a8d7d",
  "#225ea8", "#5366a5", "#7958a6", "#a34d86", "#bc4e5a",
  "#6e4238", "#986f4b", "#a9822d", "#5d7736", "#28665b",
  "#1a4f78", "#394a85", "#62417e", "#803a68", "#933844",
  "#e07a5f", "#f2cc8f", "#e9c46a", "#8ab17d", "#4d908e",
];

function slugify(value: string, fallback: string) {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function clamp(value: number, lower: number, upper: number) {
  return Math.min(upper, Math.max(lower, Number.isFinite(value) ? value : lower));
}

export default function AuthoringStudio() {
  const [storyId, setStoryId] = useState("untitled-photo-story");
  const [storyTitle, setStoryTitle] = useState("Untitled photo story");
  const [imageSource, setImageSource] = useState("humahuaca-geology.webp");
  const [previewSource, setPreviewSource] = useState(DEFAULT_IMAGE);
  const [imageAlt, setImageAlt] = useState("A source photograph ready for koreo annotation");
  const [imageSize, setImageSize] = useState(DEFAULT_SIZE);
  const [windowRatio, setWindowRatio] = useState("3:4");
  const [beats, setBeats] = useState<Beat[]>(initialBeats);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const stageRef = useRef<HTMLButtonElement | null>(null);
  const panStartRef = useRef({ pointerX: 0, pointerY: 0, panX: 0, panY: 0, moved: false });
  const panningRef = useRef(false);

  const activeBeat = beats[activeIndex] ?? beats[0];

  const updateBeat = (patch: Partial<Beat>) => {
    setBeats((current) => current.map((beat, index) => index === activeIndex ? { ...beat, ...patch } : beat));
  };

  const addBeat = () => {
    const ordinal = beats.length + 1;
    const next: Beat = { id: `beat-${ordinal}`, label: `beat ${ordinal}`, title: "A new point of attention", body: "Describe what this part of the photograph asks the reader to notice.", x: 50, y: 50, zoom: 1.22, shape: "circle", size: 14, accent: "#225ea8" };
    setBeats((current) => [...current, next]);
    setActiveIndex(beats.length);
  };

  const removeBeat = () => {
    if (beats.length <= 1) return;
    setBeats((current) => current.filter((_, index) => index !== activeIndex));
    setActiveIndex((index) => Math.max(0, index - 1));
  };

  const setFocusFromClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (panStartRef.current.moved) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const zoom = activeBeat.zoom;
    const imageAspect = imageSize.width / imageSize.height;
    const stageAspect = rect.width / rect.height;
    const baseWidth = stageAspect > imageAspect ? rect.width : rect.height * imageAspect;
    const baseHeight = stageAspect > imageAspect ? rect.width / imageAspect : rect.height;
    const renderedWidth = baseWidth * zoom;
    const renderedHeight = baseHeight * zoom;
    const imageLeft = (rect.width - renderedWidth) / 2 + previewPan.x;
    const imageTop = (rect.height - renderedHeight) / 2 + previewPan.y;
    updateBeat({
      x: Math.round(clamp(((event.clientX - rect.left - imageLeft) / renderedWidth) * 100, 0, 100)),
      y: Math.round(clamp(((event.clientY - rect.top - imageTop) / renderedHeight) * 100, 0, 100)),
    });
  };

  const startPan = (event: React.PointerEvent<HTMLButtonElement>) => {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional for synthetic and assistive input paths.
    }
    panStartRef.current = { pointerX: event.clientX, pointerY: event.clientY, panX: previewPan.x, panY: previewPan.y, moved: false };
    panningRef.current = true;
    setIsPanning(true);
  };

  const movePan = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!panningRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const imageAspect = imageSize.width / imageSize.height;
    const stageAspect = rect.width / rect.height;
    const baseWidth = stageAspect > imageAspect ? rect.width : rect.height * imageAspect;
    const baseHeight = stageAspect > imageAspect ? rect.width / imageAspect : rect.height;
    const maxX = Math.max(0, (baseWidth * activeBeat.zoom - rect.width) / 2);
    const maxY = Math.max(0, (baseHeight * activeBeat.zoom - rect.height) / 2);
    const deltaX = event.clientX - panStartRef.current.pointerX;
    const deltaY = event.clientY - panStartRef.current.pointerY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) panStartRef.current.moved = true;
    setPreviewPan({ x: clamp(panStartRef.current.panX + deltaX, -maxX, maxX), y: clamp(panStartRef.current.panY + deltaY, -maxY, maxY) });
  };

  const endPan = () => {
    panningRef.current = false;
    setIsPanning(false);
  };

  const handleImageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
    image.src = localPreview;
    setPreviewSource(localPreview);
    setImageSource(file.name);
  };

  const documentJson = useMemo(() => {
    const [ratioWidth, ratioHeight] = windowRatio.split(":").map(Number);
    return {
      schemaVersion: "1.0",
      id: slugify(storyId, "untitled-photo-story"),
      title: storyTitle || "Untitled photo story",
      image: {
        src: imageSource || "your-image.jpg",
        intrinsicWidth: imageSize.width || 1,
        intrinsicHeight: imageSize.height || 1,
        alt: imageAlt || "Source photograph",
      },
      viewport: {
        aspectRatio: Number((ratioWidth / ratioHeight).toFixed(6)),
        fit: "cover",
        maxHeightVh: 0.78,
        background: "#111111",
      },
      defaults: { transition: { durationMs: 860, ease: "gentle" } },
      steps: beats.map((beat, index) => {
        const point = { x: Number((beat.x / 100).toFixed(4)), y: Number((beat.y / 100).toFixed(4)) };
        const region = beat.shape === "none"
          ? { type: "none" }
          : beat.shape === "rect"
            ? { type: "rect", ...point, width: Number((beat.size / 100).toFixed(4)), height: Number((beat.size * 0.68 / 100).toFixed(4)) }
            : { type: "circle", ...point, diameter: Number((beat.size / 100).toFixed(4)) };
        return {
          id: slugify(beat.id || beat.label, `beat-${index + 1}`),
          caption: { eyebrow: beat.label, title: beat.title || `Beat ${index + 1}`, body: beat.body || "Add a caption." },
          region,
          camera: { ...point, zoom: Number(beat.zoom.toFixed(2)) },
          highlight: beat.shape === "none" ? undefined : { edge: "soft", color: beat.accent, dimOutside: true, dimOpacity: 0.36 },
        };
      }),
    };
  }, [beats, imageAlt, imageSize.height, imageSize.width, imageSource, storyId, storyTitle, windowRatio]);

  const jsonText = useMemo(() => JSON.stringify(documentJson, null, 2), [documentJson]);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(storyId, "koreo-story")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!activeBeat) return null;

  return (
    <div className="author-shell">
      <header className="author-topbar">
        <a className="author-back" href="/"><ArrowLeft size={15} /> koreo demo</a>
        <div className="author-title"><span>koreo Authoring Studio</span><small>json / v1 contract</small></div>
        <div className="author-actions"><button type="button" onClick={copyJson}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? "Copied" : "Copy JSON"}</button><button className="author-download" type="button" onClick={downloadJson}><Download size={15} /> Download</button></div>
      </header>

      <main className="author-workbench">
        <aside className="author-panel author-setup-panel">
          <div className="author-panel-head"><span className="author-kicker">01 / source</span><FileImage size={17} /></div>
          <h1><span>Mark the point.</span><span>Set the frame.</span></h1>
          <p className="author-intro">Load a photograph, add intentional reading beats, then take the finished story document with you.</p>
          <div className="author-form-group"><label htmlFor="story-id">Story id</label><input id="story-id" value={storyId} onChange={(event) => setStoryId(event.target.value)} /></div>
          <div className="author-form-group"><label htmlFor="story-title">Story title</label><input id="story-title" value={storyTitle} onChange={(event) => setStoryTitle(event.target.value)} /></div>
          <div className="author-form-group"><label htmlFor="image-source">Image path or URL</label><input id="image-source" value={imageSource} onChange={(event) => { setImageSource(event.target.value); setPreviewSource(event.target.value || DEFAULT_IMAGE); }} /></div>
          <div className="author-upload-row"><button type="button" onClick={() => fileInputRef.current?.click()}><Upload size={15} /> Load image file</button><span>{imageSize.width} × {imageSize.height}</span><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} hidden /></div>
          <div className="author-form-group"><label htmlFor="image-alt">Image description</label><textarea id="image-alt" value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} rows={3} /></div>
          <div className="author-ratio-row"><span className="author-label">Reader window</span><div>{ratios.map((ratio) => <button key={ratio} type="button" onClick={() => setWindowRatio(ratio)} className={windowRatio === ratio ? "active" : ""}>{ratio}</button>)}</div></div>
          <div className="author-note"><Crosshair size={14} /><span>Click the image to place the selected beat in normalized source space.</span></div>
        </aside>

        <section className="author-stage-panel">
          <div className="author-stage-meta"><span>plate / focus map</span><span>x {String(activeBeat.x).padStart(2, "0")} · y {String(activeBeat.y).padStart(2, "0")}</span></div>
          <button ref={stageRef} className={isPanning ? "author-image-stage is-panning" : "author-image-stage"} type="button" onClick={setFocusFromClick} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={endPan} onPointerCancel={endPan} style={{ aspectRatio: windowRatio }} aria-label="Drag to pan the image or click to place the active focus point">
            <img src={previewSource} alt="" style={{ transform: `translate3d(${previewPan.x}px, ${previewPan.y}px, 0) scale(${activeBeat.zoom})` }} onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
            {beats.map((beat, index) => beat.shape !== "none" && <span key={beat.id} className={index === activeIndex ? "author-focus-point active" : "author-focus-point"} style={{ left: `${beat.x}%`, top: `${beat.y}%`, width: `${beat.size}%`, height: beat.shape === "rect" ? `${beat.size * 0.68}%` : `${beat.size}%`, borderColor: beat.accent, borderRadius: beat.shape === "rect" ? "8%" : "50%" }}><i>{index + 1}</i></span>)}
            <span className="author-stage-crosshair" aria-hidden="true"><i /><i /></span>
          </button>
          <div className="author-stage-caption"><span><Crosshair size={15} /> selected beat / {String(activeIndex + 1).padStart(2, "0")}</span><span>{activeBeat.shape === "none" ? "overview — no region" : `${activeBeat.shape} / ${activeBeat.size}%`}</span></div>
          <div className="author-preview-tools"><span>drag photograph to pan</span><button type="button" onClick={() => setPreviewPan({ x: 0, y: 0 })}>reset pan</button></div>
        </section>

        <aside className="author-panel author-beats-panel">
          <div className="author-panel-head"><span className="author-kicker">02 / beats</span><span className="author-beat-count">{String(beats.length).padStart(2, "0")}</span></div>
          <div className="author-beat-list">{beats.map((beat, index) => <button key={beat.id} type="button" onClick={() => setActiveIndex(index)} className={index === activeIndex ? "author-beat-item active" : "author-beat-item"}><span>{String(index + 1).padStart(2, "0")}</span><strong>{beat.label || "unnamed beat"}</strong><i style={{ background: beat.accent }} /></button>)}</div>
          <div className="author-list-actions"><button type="button" onClick={addBeat}><Plus size={14} /> Add beat</button><button type="button" onClick={removeBeat} disabled={beats.length <= 1}><Minus size={14} /> Remove</button></div>
          <div className="author-editor">
            <div className="author-form-group"><label htmlFor="beat-label">Beat label</label><input id="beat-label" value={activeBeat.label} onChange={(event) => updateBeat({ label: event.target.value, id: slugify(event.target.value, activeBeat.id) })} /></div>
            <div className="author-form-group"><label htmlFor="beat-title">Caption title</label><input id="beat-title" value={activeBeat.title} onChange={(event) => updateBeat({ title: event.target.value })} /></div>
            <div className="author-form-group"><label htmlFor="beat-body">Caption body</label><textarea id="beat-body" value={activeBeat.body} onChange={(event) => updateBeat({ body: event.target.value })} rows={4} /></div>
            <div className="author-controls-grid"><label>Focus x<input type="number" min="0" max="100" value={activeBeat.x} onChange={(event) => updateBeat({ x: clamp(Number(event.target.value), 0, 100) })} /></label><label>Focus y<input type="number" min="0" max="100" value={activeBeat.y} onChange={(event) => updateBeat({ y: clamp(Number(event.target.value), 0, 100) })} /></label><label>Size<input type="number" min="1" max="100" value={activeBeat.size} onChange={(event) => updateBeat({ size: clamp(Number(event.target.value), 1, 100) })} /></label><div className="author-zoom-control"><span>Camera zoom</span><output>{activeBeat.zoom.toFixed(2)}×</output><input type="range" min="1" max="3" step="0.05" value={activeBeat.zoom} onChange={(event) => updateBeat({ zoom: clamp(Number(event.target.value), 1, 3) })} /></div></div>
            <div className="author-options"><label>Region<select value={activeBeat.shape} onChange={(event) => updateBeat({ shape: event.target.value as Beat["shape"] })}><option value="none">None</option><option value="circle">Circle</option><option value="rect">Rectangle</option></select></label></div>
            <div className="author-accent-picker"><div className="author-accent-head"><span>Accent</span><span>25 swatches + hex</span></div><div className="author-palette">{accentPalette.map((color) => <button key={color} type="button" title={color} aria-label={`Use accent ${color}`} className={activeBeat.accent.toLowerCase() === color.toLowerCase() ? "active" : ""} style={{ backgroundColor: color }} onClick={() => updateBeat({ accent: color })} />)}</div><div className="author-hex-row"><input value={activeBeat.accent} maxLength={7} aria-label="Custom accent hexadecimal colour" onChange={(event) => updateBeat({ accent: event.target.value })} /><span className="author-hex-swatch" style={{ background: /^#[0-9a-fA-F]{6}$/.test(activeBeat.accent) ? activeBeat.accent : "transparent" }} /></div></div>
          </div>
        </aside>
      </main>

      <section className="author-json-panel"><div className="author-json-head"><div><span className="author-kicker">03 / export</span><h2>Canonical story document</h2></div><FileJson size={20} /></div><pre><code>{jsonText}</code></pre></section>
    </div>
  );
}
