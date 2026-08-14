/*
 * koreo Field Manual direction: warm mineral paper, charcoal ink, oxide-red
 * focus marks, strict coordinate labels, and an asymmetric documentation rail.
 * This page is a living guide, so every abstraction is paired with a visible
 * specimen or executable-looking example.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  Crosshair,
  FileJson,
  Layers3,
  Menu,
  Move,
  MousePointer2,
  X,
  Zap,
} from "lucide-react";
import { KoreoReaderModal } from "@/components/KoreoReaderModal";

const HERO_IMAGE = "/manus-storage/focus-story-field-manual-hero_508d677b.jpg";
const SPECIMEN_IMAGE = "/manus-storage/focus-story-camera-specimen_0dd04ad9.jpg";
const MARK_IMAGE = "/manus-storage/focus-story-mark_8429ec7d.png";

const sections = [
  { id: "premise", number: "01", label: "The premise" },
  { id: "integration", number: "02", label: "Integration" },
  { id: "architecture", number: "03", label: "Architecture" },
  { id: "state", number: "04", label: "State model" },
  { id: "schema", number: "05", label: "JSON contract" },
  { id: "roadmap", number: "06", label: "Roadmap" },
];

const focusBeats = [
  {
    label: "overview",
    title: "Start with the whole frame",
    body: "A reader needs the room before they need the detail. koreo keeps a stable stage while the story earns its next point of attention.",
    x: 50,
    y: 52,
    zoom: 1,
    accent: "#d49b43",
  },
  {
    label: "clock tower",
    title: "Mark the moment",
    body: "The region is the editorial target. The camera is the composition. Keeping them separate lets a small detail retain its surrounding context.",
    x: 70,
    y: 28,
    zoom: 1.48,
    accent: "#b4513d",
  },
  {
    label: "market stall",
    title: "Let context stay in frame",
    body: "A rectangle can hold a relationship instead of a single object. The camera settles on the story, not just the pixel coordinate.",
    x: 36,
    y: 70,
    zoom: 1.25,
    accent: "#225ea8",
  },
];

const codeSnippets = {
  html: `<script src="/assets/koreo.js" defer></script>

<img
  src="harbour.jpg"
  alt="Boats, a clock tower, and market stalls"
  data-koreo='harbour-morning'
/>`,
  js: `koreo.mount({
  trigger: '[data-koreo="harbour-morning"]',
  story: '/stories/harbour-morning.json'
});`,
  json: `{
  "schemaVersion": "1.0",
  "id": "harbour-morning",
  "image": { "src": "harbour.jpg" },
  "steps": [
    {
      "id": "clock-tower",
      "region": { "type": "circle", "x": 0.71, "y": 0.18 },
      "camera": { "x": 0.67, "y": 0.25, "zoom": 1.75 }
    }
  ]
}`,
};

type CodeKey = keyof typeof codeSnippets;

function CodeBlock({ code, label = "example", dark = true }: { code: string; label?: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`code-block ${dark ? "code-block-dark" : ""}`}>
      <div className="code-block-bar">
        <span className="code-label">{label}</span>
        <span className="code-meta">plate / v1 contract</span>
        <button className="copy-button" onClick={copy} type="button" aria-label={`Copy ${label}`}>
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function KoreoSpecimen({ onTryReader }: { onTryReader: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBeat = focusBeats[activeIndex];
  const style = useMemo(
    () => ({
      transform: `translate(${50 - activeBeat.x * activeBeat.zoom}%, ${50 - activeBeat.y * activeBeat.zoom}%) scale(${activeBeat.zoom})`,
    }),
    [activeBeat],
  );

  return (
    <div className="specimen-card" aria-label="Interactive koreo camera specimen">
      <div className="specimen-topline">
        <span><span className="live-dot" /> live specimen</span>
        <span className="mono-label">beat {String(activeIndex + 1).padStart(2, "0")} / 03</span>
        <span className="specimen-ref">plate 02 / camera plane</span>
      </div>
      <button className="specimen-stage specimen-launch-area" type="button" onClick={onTryReader} aria-label="Try koreo reader on the harbor specimen">
        <div className="specimen-image" style={style}>
          <img src={SPECIMEN_IMAGE} alt="" />
          <span
            className="focus-ring"
            style={{ left: `${activeBeat.x}%`, top: `${activeBeat.y}%`, borderColor: activeBeat.accent }}
            aria-hidden="true"
          />
        </div>
        <div className="stage-crosshair" aria-hidden="true"><span /><span /></div>
        <span className="stage-coordinate mono-label">x {String(Math.round(activeBeat.x)).padStart(2, "0")} / y {String(Math.round(activeBeat.y)).padStart(2, "0")}</span>
        <span className="try-koreo-badge">Try koreo <ArrowUpRight size={14} /></span>
      </button>
      <div className="specimen-copy">
        <div className="specimen-kicker" style={{ color: activeBeat.accent }}>{activeBeat.label}</div>
        <h3>{activeBeat.title}</h3>
        <p>{activeBeat.body}</p>
      </div>
      <div className="beat-controls" role="tablist" aria-label="Specimen focus beats">
        {focusBeats.map((beat, index) => (
          <button
            key={beat.label}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            className={activeIndex === index ? "beat-button active" : "beat-button"}
            onClick={() => setActiveIndex(index)}
          >
            <span className="beat-index">0{index + 1}</span>
            <span>{beat.label}</span>
            <span className="beat-line" style={{ backgroundColor: activeIndex === index ? beat.accent : undefined }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ArchitectureMap() {
  return (
    <div className="architecture-map" aria-label="koreo component architecture">
      <div className="architecture-column">
        <span className="map-caption mono-label">entry</span>
        <div className="map-node map-node-trigger"><MousePointer2 size={16} /><span>IMG trigger</span><small>article context</small></div>
        <div className="map-connector" />
        <div className="map-node map-node-core"><Crosshair size={16} /><span>koreo.js</span><small>headless controller</small></div>
      </div>
      <div className="architecture-branch">
        <div className="branch-line" />
        <div className="map-node map-node-stage"><Move size={16} /><span>Stage renderer</span><small>camera + region</small></div>
        <div className="map-node map-node-content"><FileJson size={16} /><span>Story document</span><small>JSON contract</small></div>
        <div className="map-node map-node-motion"><Zap size={16} /><span>Motion driver</span><small>CSS / GSAP</small></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("premise");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [codeKey, setCodeKey] = useState<CodeKey>("html");
  const [readerOpen, setReaderOpen] = useState(false);

  useEffect(() => {
    const observers = sections.map((section) => {
      const node = document.getElementById(section.id);
      if (!node) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(section.id);
        },
        { rootMargin: "-18% 0px -62% 0px", threshold: 0 },
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="koreo home">
          <img src={MARK_IMAGE} alt="" className="brand-mark" />
          <span className="brand-wordmark">koreo</span>
          <span className="brand-version">FIELD MANUAL / 01</span>
        </a>
        <div className="topbar-actions">
          <span className="status-note"><span className="status-dot" /> v1 contract</span>
          <div className="top-links"><a className="top-link" href="#integration">Read the guide <ArrowUpRight size={15} /></a><a className="top-link article-link" href="/humahuaca">Open article specimen <ArrowUpRight size={15} /></a></div>
          <button className="mobile-menu-button" type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-expanded={mobileNavOpen} aria-label="Toggle guide navigation">
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className={mobileNavOpen ? "mobile-nav mobile-nav-open" : "mobile-nav"}>
        {sections.map((section) => (
          <button key={section.id} type="button" onClick={() => jumpTo(section.id)} className={activeSection === section.id ? "mobile-nav-link active" : "mobile-nav-link"}>
            <span>{section.number}</span>{section.label}
          </button>
        ))}
      </div>

      <div className="guide-grid" id="top">
        <aside className="chapter-rail">
          <div className="rail-intro">
            <span className="rail-kicker">on this page</span>
            <span className="rail-rule" />
          </div>
          <nav aria-label="Guide chapters">
            {sections.map((section) => (
              <button key={section.id} className={activeSection === section.id ? "chapter-link active" : "chapter-link"} onClick={() => jumpTo(section.id)} type="button">
                <span className="chapter-number">{section.number}</span>
                <span className="chapter-label">{section.label}</span>
                <ChevronRight className="chapter-arrow" size={14} />
              </button>
            ))}
          </nav>
          <div className="rail-footer">
            <span className="rail-kicker">last revised</span>
            <span className="mono-label">14 AUG 2026</span>
          </div>
        </aside>

        <main className="guide-content">
          <section className="hero-section" aria-labelledby="page-title">
            <div className="hero-copy">
              <div className="eyebrow-row"><span className="eyebrow-index">K/001</span><span className="eyebrow-line" /><span>open source interface guide</span></div>
              <h1 id="page-title">One image.<br /><em>Many deliberate</em> readings.</h1>
              <p className="hero-lede">koreo turns a complex photograph into a guided sequence of attention. Load one library, annotate one image, and let the story move the camera.</p>
              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={() => jumpTo("integration")}>Read the install path <ArrowUpRight size={16} /></button>
                <span className="hero-meta"><span className="meta-line" /> native first / GSAP optional</span>
              </div>
            </div>
            <div className="hero-art-wrap">
              <img className="hero-art" src={HERO_IMAGE} alt="Annotated drafting table with a photographic contact sheet and focus marks" />
              <div className="hero-art-caption"><span className="mono-label">plate 01 / the view window</span><span>source image → guided reading</span></div>
              <span className="hero-art-stamp">K</span>
            </div>
          </section>

          <section className="section-block premise-section" id="premise">
            <div className="section-marker"><span className="section-number">01</span><span className="section-rail-line" /></div>
            <div className="section-main">
              <div className="section-heading-row"><div><span className="section-kicker">the premise</span><h2>A caption with a camera.</h2></div><div className="margin-artifact"><span className="margin-marker">plate 01</span><span>region → camera</span><span className="margin-sub">x 00.50 / y 00.52</span></div></div>
              <p className="section-intro">The core idea is simple: keep a fixed viewing window over a larger source image, then reveal a sequence of text chunks that each point to a region worth noticing.</p>
              <div className="premise-grid">
                <div className="premise-note"><span className="note-number">A</span><h3>Region</h3><p>What matters in the image. A circle, rectangle, square, or quiet overview.</p><span className="note-code">x / y / diameter</span></div>
                <div className="premise-note"><span className="note-number">B</span><h3>Camera</h3><p>How the window frames it. A point to center, a zoom to set, and context to preserve.</p><span className="note-code">x / y / zoom</span></div>
                <div className="premise-note accent-note"><span className="note-number">C</span><h3>Beat</h3><p>The editorial moment where prose, focus, and movement arrive together.</p><span className="note-code">text + motion</span></div>
              </div>
              <KoreoSpecimen onTryReader={() => setReaderOpen(true)} />
            </div>
          </section>

          <section className="section-block integration-section" id="integration">
            <div className="section-marker"><span className="section-number">02</span><span className="section-rail-line" /></div>
            <div className="section-main">
              <div className="section-heading-row"><div><span className="section-kicker">integration</span><h2>Two lines to start.</h2></div><div className="margin-artifact"><span className="margin-marker">plate 02</span><span>head → img</span><span className="margin-sub">native first</span></div></div>
              <p className="section-intro">koreo should feel like an ordinary browser primitive. Load the library in the head. Add one declarative hook to an image. The existing article remains useful when koreo is never opened.</p>
              <div className="install-layout">
                <div className="install-steps">
                  <div className="install-step"><span className="install-index">01</span><div><h3>Load the library</h3><p>Keep the script global, cacheable, and independent of your site framework.</p></div></div>
                  <div className="install-step"><span className="install-index">02</span><div><h3>Activate the image</h3><p>Point the image at a story document with one `data-koreo` attribute.</p></div></div>
                  <div className="install-step"><span className="install-index">03</span><div><h3>Let readers look closer</h3><p>koreo owns the focused overlay; your article keeps its place beneath it.</p></div></div>
                </div>
                <CodeBlock code={codeSnippets.html} label="index.html" />
              </div>
              <div className="code-tabs" role="tablist" aria-label="koreo integration examples">
                {(["html", "js", "json"] as CodeKey[]).map((key) => (
                  <button key={key} type="button" role="tab" aria-selected={codeKey === key} className={codeKey === key ? "code-tab active" : "code-tab"} onClick={() => setCodeKey(key)}>
                    {key === "html" ? "IMG tag" : key === "js" ? "optional mount" : "story JSON"}
                  </button>
                ))}
              </div>
              <CodeBlock code={codeSnippets[codeKey]} label={codeKey === "html" ? "article.html" : codeKey === "js" ? "koreo.mount.js" : "harbour-morning.json"} />
            </div>
          </section>

          <section className="section-block architecture-section" id="architecture">
            <div className="section-marker"><span className="section-number">03</span><span className="section-rail-line" /></div>
            <div className="section-main">
              <div className="section-heading-row"><div><span className="section-kicker">architecture</span><h2>Small core. Clear seams.</h2></div><div className="margin-artifact"><span className="margin-marker">plate 03</span><span>headless seams</span><span className="margin-sub">0 dependencies</span></div></div>
              <p className="section-intro">The public runtime should be headless and framework-agnostic. The Astro component, the Markdown compiler, and the optional GSAP driver are adapters around the same content contract.</p>
              <ArchitectureMap />
              <div className="architecture-table">
                <div className="table-row table-head"><span>module</span><span>responsibility</span><span>stays out of</span></div>
                <div className="table-row"><strong>koreo.js</strong><span>modal lifecycle, active step, focus return</span><span>content parsing</span></div>
                <div className="table-row"><strong>stage renderer</strong><span>transform, clamp, highlight</span><span>scroll ownership</span></div>
                <div className="table-row"><strong>story document</strong><span>caption, region, camera</span><span>DOM mutation</span></div>
                <div className="table-row"><strong>motion driver</strong><span>native CSS or optional GSAP</span><span>authoring data</span></div>
              </div>
            </div>
          </section>

          <section className="section-block state-section" id="state">
            <div className="section-marker"><span className="section-number">04</span><span className="section-rail-line" /></div>
            <div className="section-main">
              <div className="section-heading-row"><div><span className="section-kicker">state model</span><h2>Every transition has a name.</h2></div><div className="margin-artifact red-artifact"><span className="margin-marker">plate 04</span><span>reducer-shaped</span><span className="margin-sub">open → close</span></div></div>
              <p className="section-intro">The state model keeps the modal, asset, navigation, layout, and camera concerns separate. That makes the visual layer replaceable without making the editorial state mysterious.</p>
              <div className="state-flow" aria-label="koreo lifecycle state flow">
                <div className="state-node"><span className="state-node-index">01</span><span className="state-node-dot" /><strong>closed</strong><small>article is in charge</small></div>
                <div className="state-arrow"><ChevronRight size={16} /></div>
                <div className="state-node state-node-red"><span className="state-node-index">02</span><span className="state-node-dot" /><strong>opening</strong><small>asset is decoding</small></div>
                <div className="state-arrow"><ChevronRight size={16} /></div>
                <div className="state-node state-node-blue"><span className="state-node-index">03</span><span className="state-node-dot" /><strong>open</strong><small>reader is moving</small></div>
                <div className="state-arrow"><ChevronRight size={16} /></div>
                <div className="state-node"><span className="state-node-index">04</span><span className="state-node-dot" /><strong>closing</strong><small>focus returns</small></div>
              </div>
              <div className="state-detail-grid">
                <div><span className="detail-label">action</span><code>SYNC_STEP_FROM_SCROLL</code><p>Captions remain semantic. The controller observes their reading line and requests a new target frame.</p></div>
                <div><span className="detail-label">render</span><code>CAMERA_RENDERED</code><p>The driver receives only target camera and region values. Native CSS is the reliable default.</p></div>
                <div><span className="detail-label">escape</span><code>REQUEST_CLOSE</code><p>Escape, close, and back affordances all restore the originating image without a dead end.</p></div>
              </div>
            </div>
          </section>

          <section className="section-block schema-section" id="schema">
            <div className="section-marker"><span className="section-number">05</span><span className="section-rail-line" /></div>
            <div className="section-main">
              <div className="section-heading-row"><div><span className="section-kicker">JSON contract</span><h2>Store intent, not pixels.</h2></div><div className="margin-artifact blue-artifact"><span className="margin-marker">plate 05</span><span>schema v1.0</span><span className="margin-sub">source space</span></div></div>
              <p className="section-intro">Normalized source coordinates keep authored stories portable. An author describes the point and the desired frame; koreo handles the runtime mapping to the fixed view window.</p>
              <div className="schema-layout">
                <div className="schema-card"><div className="schema-card-head"><FileJson size={18} /><span>focus-story.v1.json</span><span className="schema-valid">valid</span></div><pre><code><span className="json-key">"region"</span>: {'{'}{`\n  `}<span className="json-key">"type"</span>: <span className="json-string">"circle"</span>,{`\n  `}<span className="json-key">"x"</span>: <span className="json-number">0.71</span>,{`\n  `}<span className="json-key">"y"</span>: <span className="json-number">0.18</span>,{`\n  `}<span className="json-key">"diameter"</span>: <span className="json-number">0.13</span>{`\n`}{'}'},<br /><span className="json-key">"camera"</span>: {'{'}{`\n  `}<span className="json-key">"x"</span>: <span className="json-number">0.67</span>,{`\n  `}<span className="json-key">"y"</span>: <span className="json-number">0.25</span>,{`\n  `}<span className="json-key">"zoom"</span>: <span className="json-number">1.75</span>{`\n`}{'}'}</code></pre></div>
                <div className="schema-notes"><div className="schema-note"><span className="schema-note-icon"><Crosshair size={15} /></span><div><strong>region = meaning</strong><p>Circle, rectangle, or overview. Stored in source space from 0 to 1.</p></div></div><div className="schema-note"><span className="schema-note-icon"><Move size={15} /></span><div><strong>camera = composition</strong><p>Center point plus zoom. Optional when the runtime can infer a calm frame.</p></div></div><div className="schema-note"><span className="schema-note-icon"><Layers3 size={15} /></span><div><strong>highlight = treatment</strong><p>Hard or soft edges, dim outside, and a restrained optional stroke.</p></div></div></div>
              </div>
            </div>
          </section>

          <section className="section-block roadmap-section" id="roadmap">
            <div className="section-marker"><span className="section-number">06</span><span className="section-rail-line" /></div>
            <div className="section-main">
              <div className="section-heading-row"><div><span className="section-kicker">roadmap</span><h2>Ship the seam before the studio.</h2></div><div className="margin-artifact"><span className="margin-marker">plate 06</span><span>next / v1 core</span><span className="margin-sub">06 phases</span></div></div>
              <p className="section-intro">The GUI is the destination, not the starting line. First prove that one story can travel from raw JSON to a calm, accessible reading experience across three real photographs.</p>
              <div className="roadmap-list">
                {[
                  ["01", "Contract validation", "Three real editorial fixtures expose missing fields before the public promise."],
                  ["02", "koreo.js core", "Modal lifecycle, camera math, regions, captions, and native motion."],
                  ["03", "Astro bridge", "Lightbox.astro stays a host adapter; the library remains portable."],
                  ["04", "Open-source hardening", "Visual regression, docs, fallbacks, browser support, contribution guide."],
                  ["05", "Markdown compiler", "Human-friendly authoring that always emits canonical JSON."],
                  ["06", "Authoring studio", "Click-to-place GUI with a live preview and schema-aware export."],
                ].map(([number, title, description], index) => (
                  <div className="roadmap-row" key={number} style={{ "--delay": `${index * 50}ms` } as React.CSSProperties}>
                    <span className="roadmap-number">{number}</span><div className="roadmap-copy"><strong>{title}</strong><span>{description}</span></div><span className="roadmap-status">{index === 0 ? "next" : index < 3 ? "planned" : "later"}</span>
                  </div>
                ))}
              </div>
              <div className="closing-note"><span className="closing-icon"><Crosshair size={17} /></span><div><span className="section-kicker">field note</span><p>Mark the point. Set the frame. Let the story move.</p></div><ArrowUpRight size={17} /></div>
            </div>
          </section>

          <footer className="guide-footer"><div><img src={MARK_IMAGE} alt="" className="footer-mark" /><strong>koreo</strong><span>open source image narratives</span></div><a href="#top">back to top <ArrowUpRight size={14} /></a></footer>
        </main>

        <aside className="status-rail">
          <div className="status-rail-inner">
            <div className="status-vertical"><span>koreo / living guide</span></div>
            <div className="status-card"><span className="rail-kicker">current section</span><strong>{sections.find((section) => section.id === activeSection)?.label}</strong><div className="status-progress"><span style={{ width: `${((sections.findIndex((section) => section.id === activeSection) + 1) / sections.length) * 100}%` }} /></div><span className="mono-label">{String(sections.findIndex((section) => section.id === activeSection) + 1).padStart(2, "0")} / 06</span></div>
            <div className="status-stamp"><span className="stamp-line" /><span>focus / move / read</span></div>
          </div>
        </aside>
      </div>
      <KoreoReaderModal open={readerOpen} onClose={() => setReaderOpen(false)} imageSrc={SPECIMEN_IMAGE} imageAlt="Illustrated harbor scene with a clock tower, boats, and a market stall" steps={focusBeats} />
    </div>
  );
}
