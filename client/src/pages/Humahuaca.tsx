/*
 * koreo Field Manual direction, translated into an article specimen: a blank
 * white single-column reading surface, restrained typography, and provisional
 * image coordinates that are explicitly marked for later editorial correction.
 */
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Crosshair, MapPin } from "lucide-react";
import { KoreoReaderModal, type KoreoReaderStep } from "@/components/KoreoReaderModal";

const HUMAHUACA_IMAGE = "/manus-storage/humahuaca-geology_811657ed.webp";

const humahuacaSteps: KoreoReaderStep[] = [
  {
    label: "overview",
    title: "A valley shaped by passage",
    body: "Quebrada de Humahuaca follows the line of a major cultural route, the Camino Inca, along the spectacular valley of the Rio Grande, from its source in the cold high desert plateau of the High Andean lands to its confluence with the Rio Leone some 150 km to the south. This UNESCO World Heritage Site features dramatic multi-coloured rock formations, pre-Incan and Incan history, and vibrant Andean culture spanning 10,000 years.",
    x: 50,
    y: 52,
    zoom: 1,
    accent: "#3c6b9d",
    shape: "none",
  },
  {
    label: "red crags / provisional",
    title: "Iron in the red crags",
    body: "Iron-stained sandstone, siltstone, mudstone, or conglomeratic sedimentary rock. Oxidized iron minerals give these central formations their red, maroon, and orange tones.",
    x: 42,
    y: 44,
    zoom: 1.65,
    accent: "#b4513d",
    shape: "circle",
    size: 17,
  },
  {
    label: "dark slopes / provisional",
    title: "Muted green-gray weathering",
    body: "Weathered shale or siltstone, volcanic-derived sediment, or altered fine-grained sedimentary rock. The fine grain, crumbly surface, and muted green-gray weathering define the right slope and foreground.",
    x: 77,
    y: 55,
    zoom: 1.42,
    accent: "#6e806f",
    shape: "rect",
    size: 28,
  },
  {
    label: "pale bank / provisional",
    title: "A young, sandy edge",
    body: "Sandy silt, sandstone-derived material, and young alluvial sediment. Light-colored fine sediment is mixed here with sand and gravel along the left bank.",
    x: 18,
    y: 57,
    zoom: 1.5,
    accent: "#d49b43",
    shape: "rect",
    size: 23,
  },
  {
    label: "dry channel / provisional",
    title: "The channel between rains",
    body: "Unconsolidated alluvium: mud, sand, gravel, and cobbles recently transported by intermittent water flow. The dry channel runs from the middle distance toward the foreground.",
    x: 54,
    y: 68,
    zoom: 1.38,
    accent: "#8a6954",
    shape: "rect",
    size: 31,
  },
  {
    label: "background ridges / provisional",
    title: "Layers tilted into the distance",
    body: "Tilted layers of sandstone, shale or siltstone, and possibly conglomerate. The repeating banded texture is typical of layered sedimentary rocks in the background ridges.",
    x: 61,
    y: 32,
    zoom: 1.34,
    accent: "#7a5c76",
    shape: "rect",
    size: 25,
  },
];

export default function Humahuaca() {
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <div className="humahuaca-page">
      <header className="article-header">
        <a href="/" className="article-back"><ArrowLeft size={15} /> <span>koreo field manual</span></a>
        <span className="article-label">article specimen / 01</span>
      </header>

      <main className="article-column">
        <div className="article-kicker"><span className="article-kicker-line" /> field notes / landscape geology</div>
        <h1>Quebrada de Humahuaca</h1>
        <p className="article-dek">A provisional reading of colour, sediment, and water across one Andean valley.</p>
        <div className="article-byline"><span>18 FEB 2020</span><span className="article-byline-dot" /><span>JUJUY, ARGENTINA</span></div>

        <figure className="article-figure">
          <button className="article-image-trigger" type="button" onClick={() => setReaderOpen(true)} aria-label="Open koreo guided reading of the Quebrada de Humahuaca photograph">
            <img src={HUMAHUACA_IMAGE} alt="A dry channel leading through the multi-coloured mountains of Quebrada de Humahuaca" />
            <span className="article-image-action"><Crosshair size={15} /> Try koreo <ArrowUpRight size={14} /></span>
          </button>
          <figcaption><span>Quebrada de Humahuaca, Jujuy, Argentina</span><span>image / 2048 × 1536</span></figcaption>
        </figure>

        <p className="article-lede">Quebrada de Humahuaca follows the line of a major cultural route, the Camino Inca, along the spectacular valley of the Rio Grande, from its source in the cold high desert plateau of the High Andean lands to its confluence with the Rio Leone some 150 km to the south. This UNESCO World Heritage Site features dramatic multi-coloured rock formations, pre-Incan and Incan history, and vibrant Andean culture spanning 10,000 years.</p>

        <div className="annotation-list">
          {humahuacaSteps.slice(1).map((step, index) => (
            <button className="annotation-row" type="button" key={step.label} onClick={() => setReaderOpen(true)}>
              <span className="annotation-row-index">0{index + 2}</span>
              <span className="annotation-row-marker" style={{ background: step.accent }}><MapPin size={13} /></span>
              <span className="annotation-row-copy"><strong>{step.title}</strong><span>{step.body}</span></span>
              <ArrowUpRight className="annotation-row-arrow" size={15} />
            </button>
          ))}
        </div>

        <div className="article-correction-note"><span className="correction-icon">?</span><p><strong>Coordinates are provisional.</strong> The focus points are editorial estimates for this first pass. Open the reader, inspect each location, and adjust them when the koreo authoring studio is connected.</p></div>
      </main>

      <footer className="article-footer"><a href="/">koreo</a><span>one image / many deliberate readings</span><span>article specimen / 01</span></footer>

      <KoreoReaderModal open={readerOpen} onClose={() => setReaderOpen(false)} imageSrc={HUMAHUACA_IMAGE} imageAlt="A dry channel leading through the multi-coloured mountains of Quebrada de Humahuaca" steps={humahuacaSteps} />
    </div>
  );
}
