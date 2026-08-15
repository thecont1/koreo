/*
 * koreo Field Manual direction: the reader is a dark field-kit overlay where
 * a fixed camera stage and a semantic caption rail move as one editorial unit.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Moon, Sun, X } from "lucide-react";

const VIEWER_PREFERENCES_KEY = "koreo.viewer-preferences.v1";

type ViewerPreferences = {
  surface: "dark" | "light";
  imageMode: boolean;
};

function readViewerPreferences(): ViewerPreferences {
  try {
    const stored = window.localStorage.getItem(VIEWER_PREFERENCES_KEY);
    if (!stored) return { surface: "dark", imageMode: false };
    const parsed = JSON.parse(stored) as Partial<ViewerPreferences>;
    return {
      surface: parsed.surface === "light" ? "light" : "dark",
      imageMode: parsed.imageMode === true,
    };
  } catch {
    return { surface: "dark", imageMode: false };
  }
}

export type KoreoReaderStep = {
  label: string;
  title: string;
  body: string;
  x: number;
  y: number;
  zoom: number;
  accent: string;
  shape?: "circle" | "rect" | "none";
  size?: number;
};

type KoreoReaderModalProps = {
  open: boolean;
  imageSrc: string;
  imageAlt: string;
  steps: KoreoReaderStep[];
  onClose: () => void;
  windowRatio?: string;
};

export function KoreoReaderModal({ open, imageSrc, imageAlt, steps, onClose, windowRatio = "4:3" }: KoreoReaderModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewerPreferences, setViewerPreferences] = useState<ViewerPreferences>(readViewerPreferences);
  const { surface, imageMode } = viewerPreferences;
  const readerBodyRef = useRef<HTMLDivElement | null>(null);
  const captionScrollerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const pendingBeatRef = useRef<number | null>(null);
  const beatSettleTimerRef = useRef<number | null>(null);

  const activeStep = steps[activeIndex] ?? steps[0];
  const [ratioWidth, ratioHeight] = windowRatio.split(":").map(Number);
  const safeRatioWidth = Number.isFinite(ratioWidth) && ratioWidth > 0 ? ratioWidth : 4;
  const safeRatioHeight = Number.isFinite(ratioHeight) && ratioHeight > 0 ? ratioHeight : 3;
  const ratio = safeRatioWidth / safeRatioHeight;
  const windowFit = ratio > 1 ? "landscape" : ratio < 1 ? "portrait" : "square";
  const windowStyle = { "--koreo-window-ratio": `${safeRatioWidth} / ${safeRatioHeight}` } as CSSProperties;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === steps.length - 1;
  const focalX = Math.min(Math.max((activeStep?.x ?? 50) / 100, 0.001), 0.999);
  const focalY = Math.min(Math.max((activeStep?.y ?? 50) / 100, 0.001), 0.999);
  const cameraZoom = Math.max(activeStep?.zoom ?? 1, 1);
  const clampCameraOffset = (focalPoint: number) => {
    const requestedOffset = 50 - focalPoint * 100 * cameraZoom;
    const minimumOffset = 100 * (1 - cameraZoom);
    return Math.min(0, Math.max(minimumOffset, requestedOffset));
  };
  const cameraStyle = activeStep
    ? {
        transform: `translate3d(${clampCameraOffset(focalX)}%, ${clampCameraOffset(focalY)}%, 0) scale(${cameraZoom})`,
      }
    : undefined;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEWER_PREFERENCES_KEY, JSON.stringify(viewerPreferences));
    } catch {
      // Preference persistence is optional; koreo continues without storage access.
    }
  }, [viewerPreferences]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("koreo-reader-open");
    const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("koreo-reader-open");
      window.setTimeout(() => previousFocusRef.current?.focus(), 0);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (imageMode) {
          setViewerPreferences((current) => ({ ...current, imageMode: false }));
        } else {
          onClose();
        }
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goToStep(Math.min(activeIndex + 1, steps.length - 1));
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goToStep(Math.max(activeIndex - 1, 0));
      } else if (event.key === "Home") {
        event.preventDefault();
        goToStep(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToStep(steps.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (!open) return;
    const scroller = captionScrollerRef.current;
    const readerBody = readerBodyRef.current;
    if (!scroller || !readerBody) return;

    const clearPendingBeat = () => {
      if (beatSettleTimerRef.current) window.clearTimeout(beatSettleTimerRef.current);
      beatSettleTimerRef.current = null;
      pendingBeatRef.current = null;
    };

    const activateScrollBeat = (candidate: number, immediate = false) => {
      if (immediate || reducedMotion) {
        clearPendingBeat();
        setActiveIndex((current) => (current === candidate ? current : candidate));
        return;
      }
      if (pendingBeatRef.current === candidate) return;
      clearPendingBeat();
      pendingBeatRef.current = candidate;
      beatSettleTimerRef.current = window.setTimeout(() => {
        const settledBeat = pendingBeatRef.current;
        pendingBeatRef.current = null;
        beatSettleTimerRef.current = null;
        if (settledBeat !== null) setActiveIndex((current) => (current === settledBeat ? current : settledBeat));
      }, 220);
    };

    const syncFromScroll = () => {
      scrollRafRef.current = null;
      const scrollSurface = scroller.scrollHeight > scroller.clientHeight + 4 ? scroller : readerBody;
      const atStart = scrollSurface.scrollTop <= 4;
      const atEnd = scrollSurface.scrollTop + scrollSurface.clientHeight >= scrollSurface.scrollHeight - 4;
      if (atStart) {
        activateScrollBeat(0, true);
        return;
      }
      if (atEnd) {
        activateScrollBeat(steps.length - 1, true);
        return;
      }
      const readingLine = scrollSurface.getBoundingClientRect().top + scrollSurface.clientHeight * 0.34;
      let candidate = 0;
      stepRefs.current.forEach((node, index) => {
        if (node && node.getBoundingClientRect().top <= readingLine) candidate = index;
      });
      activateScrollBeat(candidate);
    };

    const onScroll = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = window.requestAnimationFrame(syncFromScroll);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    readerBody.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      readerBody.removeEventListener("scroll", onScroll);
      if (scrollRafRef.current) window.cancelAnimationFrame(scrollRafRef.current);
      clearPendingBeat();
      scrollRafRef.current = null;
    };
  }, [open, reducedMotion, steps.length, imageMode]);

  function goToStep(index: number) {
    const nextIndex = Math.max(0, Math.min(index, steps.length - 1));
    if (beatSettleTimerRef.current) window.clearTimeout(beatSettleTimerRef.current);
    beatSettleTimerRef.current = null;
    pendingBeatRef.current = null;
    setActiveIndex(nextIndex);
    stepRefs.current[nextIndex]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  function toggleImageMode() {
    setViewerPreferences((current) => ({ ...current, imageMode: !current.imageMode }));
  }

  if (!open || !activeStep) return null;

  const focusSize = activeStep.size ?? (activeStep.shape === "rect" ? 24 : 13);
  const highlightStyle = {
    left: `${activeStep.x}%`,
    top: `${activeStep.y}%`,
    width: `${focusSize}%`,
    height: activeStep.shape === "rect" ? `${Math.max(focusSize * 0.68, 8)}%` : `${focusSize}%`,
    borderColor: activeStep.accent,
    borderRadius: activeStep.shape === "rect" ? "8%" : "50%",
    opacity: activeStep.shape === "none" ? 0 : 1,
  };

  return (
    <div className="koreo-reader-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`koreo-reader koreo-viewer-${surface}${imageMode ? " koreo-reader-image-mode" : ""}`} role="dialog" aria-modal="true" aria-label="koreo viewer">
        <header className="koreo-reader-header">
          <a className="reader-brand" href="https://github.com/thecont1/koreo" target="_blank" rel="noreferrer" aria-label="Open the koreo repository on GitHub">
            <span>koreo viewer by mahesh shantaram</span>
            <svg className="reader-brand-github" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" d="M24,2.5a21.5,21.5,0,0,0-6.8,41.9c1.08.2,1.47-.46,1.47-1s0-1.86,0-3.65c-6,1.3-7.24-2.88-7.24-2.88A5.7,5.7,0,0,0,9,33.68c-1.95-1.33.15-1.31.15-1.31a4.52,4.52,0,0,1,3.29,2.22c1.92,3.29,5,2.34,6.26,1.79a4.61,4.61,0,0,1,1.37-2.88c-4.78-.54-9.8-2.38-9.8-10.62a8.29,8.29,0,0,1,2.22-5.77,7.68,7.68,0,0,1,.21-5.69s1.8-.58,5.91,2.2a20.46,20.46,0,0,1,10.76,0c4.11-2.78,5.91-2.2,5.91-2.2a7.74,7.74,0,0,1,.21,5.69,8.28,8.28,0,0,1,2.21,5.77c0,8.26-5,10.07-9.81,10.61a5.12,5.12,0,0,1,1.46,4c0,2.87,0,5.19,0,5.9s.39,1.24,1.48,1A21.5,21.5,0,0,0,24,2.5" />
            </svg>
          </a>
          <div className="viewer-actions">
            <button className="viewer-action" type="button" onClick={() => setViewerPreferences((current) => ({ ...current, surface: current.surface === "dark" ? "light" : "dark" }))} aria-label={`Switch to ${surface === "dark" ? "light" : "dark"} viewer surface`} aria-pressed={surface === "light"}>
              {surface === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="viewer-action image-mode-toggle" type="button" onClick={toggleImageMode} aria-label={imageMode ? "Return to guided reading" : "Show complete original image"} aria-pressed={imageMode}>
              {imageMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            <button ref={closeButtonRef} className="reader-close" type="button" onClick={onClose} aria-label="Close koreo viewer"><X size={20} /></button>
          </div>
        </header>

        <div className={`koreo-reader-body koreo-reader-body-${windowFit}`} ref={readerBodyRef}>
          <div className={`koreo-reader-stage-column koreo-reader-stage-column-${windowFit}`} style={windowStyle}>
            <div className="koreo-reader-stage" aria-label="koreo camera stage">
              {imageMode ? (
                <img className="reader-original-image" src={imageSrc} alt={imageAlt} />
              ) : (
                <>
                  <div className="reader-camera-plane" style={cameraStyle}>
                    <img src={imageSrc} alt={imageAlt} />
                    <span className="reader-highlight" style={highlightStyle} aria-hidden="true" />
                  </div>
                  <div className="reader-stage-vignette" aria-hidden="true" />
                </>
              )}
            </div>
          </div>

          <div className="koreo-reader-copy">
            <div className="reader-caption-scroller" ref={captionScrollerRef} tabIndex={0} aria-label="koreo caption beats">
              {steps.map((step, index) => (
                <article key={step.label} className={index === activeIndex ? "reader-caption-step active" : "reader-caption-step"} ref={(node) => { stepRefs.current[index] = node; }}>
                  <div className="reader-caption-marker"><span className="mono-label">0{index + 1}</span><span className="caption-marker-line" style={{ backgroundColor: index === activeIndex ? step.accent : undefined }} /></div>
                  <div className="reader-caption-content"><span className="reader-caption-label" style={{ color: index === activeIndex ? step.accent : undefined }}>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></div>
                </article>
              ))}
            </div>
            <div className="reader-controls">
              <button type="button" onClick={() => goToStep(activeIndex - 1)} disabled={isFirst} aria-label="Previous caption"><ArrowLeft size={16} /><span>previous</span></button>
              <div className="reader-progress" role="progressbar" aria-label="Story progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={activeIndex + 1} aria-valuetext={`Beat ${activeIndex + 1} of ${steps.length}`}>
                {steps.map((step, index) => <span key={step.label} className={index === activeIndex ? "reader-progress-segment active" : "reader-progress-segment"} aria-hidden="true" />)}
              </div>
              <button type="button" onClick={() => goToStep(activeIndex + 1)} disabled={isLast} aria-label="Next caption"><span>next</span><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
