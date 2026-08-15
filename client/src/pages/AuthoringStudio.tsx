/*
 * koreo Field Manual direction: an authoring bench with mineral paper,
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

const ratios = ["3:4", "4:3", "1:1"];

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    const rect = event.currentTarget.getBoundingClientRect();
    updateBeat({
      x: Math.round(clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)),
      y: Math.round(clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100)),
    });
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
        <a className="author-back" href="/field"><ArrowLeft size={15} /> Field Manual</a>
        <div className="author-title"><span>koreo authoring helper</span><small>json / v1 contract</small></div>
        <div className="author-actions"><button type="button" onClick={copyJson}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? "Copied" : "Copy JSON"}</button><button className="author-download" type="button" onClick={downloadJson}><Download size={15} /> Download</button></div>
      </header>

      <main className="author-workbench">
        <aside className="author-panel author-setup-panel">
          <div className="author-panel-head"><span className="author-kicker">01 / source</span><FileImage size={17} /></div>
          <h1>Mark the point.<br />Set the frame.</h1>
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
          <button className="author-image-stage" type="button" onClick={setFocusFromClick} style={{ aspectRatio: windowRatio }} aria-label="Click to place the active focus point">
            <img src={previewSource} alt="" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
            {beats.map((beat, index) => beat.shape !== "none" && <span key={beat.id} className={index === activeIndex ? "author-focus-point active" : "author-focus-point"} style={{ left: `${beat.x}%`, top: `${beat.y}%`, width: `${beat.size}%`, height: beat.shape === "rect" ? `${beat.size * 0.68}%` : `${beat.size}%`, borderColor: beat.accent, borderRadius: beat.shape === "rect" ? "8%" : "50%" }}><i>{index + 1}</i></span>)}
            <span className="author-stage-crosshair" aria-hidden="true"><i /><i /></span>
          </button>
          <div className="author-stage-caption"><span><Crosshair size={15} /> selected beat / {String(activeIndex + 1).padStart(2, "0")}</span><span>{activeBeat.shape === "none" ? "overview — no region" : `${activeBeat.shape} / ${activeBeat.size}%`}</span></div>
        </section>

        <aside className="author-panel author-beats-panel">
          <div className="author-panel-head"><span className="author-kicker">02 / beats</span><span className="author-beat-count">{String(beats.length).padStart(2, "0")}</span></div>
          <div className="author-beat-list">{beats.map((beat, index) => <button key={beat.id} type="button" onClick={() => setActiveIndex(index)} className={index === activeIndex ? "author-beat-item active" : "author-beat-item"}><span>{String(index + 1).padStart(2, "0")}</span><strong>{beat.label || "unnamed beat"}</strong><i style={{ background: beat.accent }} /></button>)}</div>
          <div className="author-list-actions"><button type="button" onClick={addBeat}><Plus size={14} /> Add beat</button><button type="button" onClick={removeBeat} disabled={beats.length <= 1}><Minus size={14} /> Remove</button></div>
          <div className="author-editor">
            <div className="author-form-group"><label htmlFor="beat-label">Beat label</label><input id="beat-label" value={activeBeat.label} onChange={(event) => updateBeat({ label: event.target.value, id: slugify(event.target.value, activeBeat.id) })} /></div>
            <div className="author-form-group"><label htmlFor="beat-title">Caption title</label><input id="beat-title" value={activeBeat.title} onChange={(event) => updateBeat({ title: event.target.value })} /></div>
            <div className="author-form-group"><label htmlFor="beat-body">Caption body</label><textarea id="beat-body" value={activeBeat.body} onChange={(event) => updateBeat({ body: event.target.value })} rows={4} /></div>
            <div className="author-controls-grid"><label>Focus x<input type="number" min="0" max="100" value={activeBeat.x} onChange={(event) => updateBeat({ x: clamp(Number(event.target.value), 0, 100) })} /></label><label>Focus y<input type="number" min="0" max="100" value={activeBeat.y} onChange={(event) => updateBeat({ y: clamp(Number(event.target.value), 0, 100) })} /></label><label>Zoom<input type="number" min="1" max="8" step="0.05" value={activeBeat.zoom} onChange={(event) => updateBeat({ zoom: clamp(Number(event.target.value), 1, 8) })} /></label><label>Size<input type="number" min="1" max="100" value={activeBeat.size} onChange={(event) => updateBeat({ size: clamp(Number(event.target.value), 1, 100) })} /></label></div>
            <div className="author-options"><label>Region<select value={activeBeat.shape} onChange={(event) => updateBeat({ shape: event.target.value as Beat["shape"] })}><option value="none">None</option><option value="circle">Circle</option><option value="rect">Rectangle</option></select></label><label>Accent<input type="color" value={activeBeat.accent} onChange={(event) => updateBeat({ accent: event.target.value })} /></label></div>
          </div>
        </aside>
      </main>

      <section className="author-json-panel"><div className="author-json-head"><div><span className="author-kicker">03 / export</span><h2>Canonical story document</h2></div><FileJson size={20} /></div><pre><code>{jsonText}</code></pre></section>
    </div>
  );
}
