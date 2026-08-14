/*
 * koreo Field Manual direction: the reader is a dark field-kit overlay where
 * a fixed camera stage and a semantic caption rail move as one editorial unit.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crosshair, X } from "lucide-react";

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
};

export function KoreoReaderModal({ open, imageSrc, imageAlt, steps, onClose }: KoreoReaderModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const readerBodyRef = useRef<HTMLDivElement | null>(null);
  const captionScrollerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  const activeStep = steps[activeIndex] ?? steps[0];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === steps.length - 1;
  const cameraStyle = activeStep
    ? {
        transform: `translate3d(${50 - activeStep.x * activeStep.zoom}%, ${50 - activeStep.y * activeStep.zoom}%, 0) scale(${activeStep.zoom})`,
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
        onClose();
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

    const syncFromScroll = () => {
      scrollRafRef.current = null;
      const scrollSurface = scroller.scrollHeight > scroller.clientHeight + 4 ? scroller : readerBody;
      const readingLine = scrollSurface.getBoundingClientRect().top + scrollSurface.clientHeight * 0.34;
      let candidate = 0;
      stepRefs.current.forEach((node, index) => {
        if (node && node.getBoundingClientRect().top <= readingLine) candidate = index;
      });
      setActiveIndex((current) => (current === candidate ? current : candidate));
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
      scrollRafRef.current = null;
    };
  }, [open]);

  function goToStep(index: number) {
    const nextIndex = Math.max(0, Math.min(index, steps.length - 1));
    setActiveIndex(nextIndex);
    stepRefs.current[nextIndex]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
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
      <section className="koreo-reader" role="dialog" aria-modal="true" aria-label="koreo guided reader">
        <header className="koreo-reader-header">
          <div className="reader-brand"><span className="reader-brand-mark"><Crosshair size={15} /></span><span>koreo / reader</span></div>
          <div className="reader-header-meta"><span className="reader-live"><span /> live demonstration</span><span className="mono-label">{String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span></div>
          <button ref={closeButtonRef} className="reader-close" type="button" onClick={onClose} aria-label="Close koreo reader"><X size={19} /><span>close</span></button>
        </header>

        <div className="koreo-reader-body" ref={readerBodyRef}>
          <div className="koreo-reader-stage-column">
            <div className="koreo-reader-stage" aria-label="koreo camera stage">
              <div className="reader-camera-plane" style={cameraStyle}>
                <img src={imageSrc} alt={imageAlt} />
                <span className="reader-highlight" style={highlightStyle} aria-hidden="true" />
              </div>
              <div className="reader-stage-vignette" aria-hidden="true" />
              <span className="reader-stage-coordinate mono-label">x {String(Math.round(activeStep.x)).padStart(2, "0")} / y {String(Math.round(activeStep.y)).padStart(2, "0")} / z {activeStep.zoom.toFixed(2)}</span>
              <span className="reader-stage-label"><span className="live-dot" /> fixed view window</span>
            </div>
          </div>

          <div className="koreo-reader-copy">
            <div className="reader-caption-scroller" ref={captionScrollerRef} tabIndex={0} aria-label="koreo caption beats">
              {steps.map((step, index) => (
                <article key={step.label} className={index === activeIndex ? "reader-caption-step active" : "reader-caption-step"} ref={(node) => { stepRefs.current[index] = node; }}>
                  <div className="reader-caption-marker"><span className="mono-label">0{index + 1}</span><span className="caption-marker-line" style={{ backgroundColor: index === activeIndex ? step.accent : undefined }} /></div>
                  <div><span className="reader-caption-label" style={{ color: index === activeIndex ? step.accent : undefined }}>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></div>
                </article>
              ))}
            </div>
            <div className="reader-controls"><button type="button" onClick={() => goToStep(activeIndex - 1)} disabled={isFirst} aria-label="Previous caption"><ArrowLeft size={16} /><span>previous</span></button><button type="button" onClick={() => goToStep(activeIndex + 1)} disabled={isLast} aria-label="Next caption"><span>next</span><ArrowRight size={16} /></button></div>
          </div>
        </div>

        <footer className="koreo-reader-footer"><span>scroll / keys ↑ ↓ / escape to exit</span><span className="reader-footer-rule" /><span>koreo field manual / live specimen</span></footer>
      </section>
    </div>
  );
}
