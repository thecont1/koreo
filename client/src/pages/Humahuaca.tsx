/**
 * koreo article direction: an unadorned white reading surface with the source
 * photograph kept in its original horizontal form; koreo itself owns the
 * portrait camera crop and side-caption treatment in the focused reader.
 */
import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { KoreoReaderModal, type KoreoReaderStep } from "@/components/KoreoReaderModal";

const HUMAHUACA_IMAGE = "/manus-storage/humahuaca-geology_811657ed.webp";

const humahuacaSteps: KoreoReaderStep[] = [
  { label: "overview", title: "A valley shaped by passage", body: "Quebrada de Humahuaca follows the line of a major cultural route, the Camino Inca, along the spectacular valley of the Rio Grande, from its source in the cold high desert plateau of the High Andean lands to its confluence with the Rio Leone some 150 km to the south. This UNESCO World Heritage Site features dramatic multi-coloured rock formations, pre-Incan and Incan history, and vibrant Andean culture spanning 10,000 years.", x: 50, y: 52, zoom: 1, accent: "#3c6b9d", shape: "none" },
  { label: "red crags / provisional", title: "Iron in the red crags", body: "Iron-stained sandstone, siltstone, mudstone, or conglomeratic sedimentary rock. Oxidized iron minerals give these central formations their red, maroon, and orange tones.", x: 42, y: 44, zoom: 1.65, accent: "#b4513d", shape: "circle", size: 17 },
  { label: "dark slopes / provisional", title: "Muted green-gray weathering", body: "Weathered shale or siltstone, volcanic-derived sediment, or altered fine-grained sedimentary rock. The fine grain, crumbly surface, and muted green-gray weathering define the right slope and foreground.", x: 77, y: 55, zoom: 1.42, accent: "#6e806f", shape: "rect", size: 28 },
  { label: "pale bank / provisional", title: "A young, sandy edge", body: "Sandy silt, sandstone-derived material, and young alluvial sediment. Light-colored fine sediment is mixed here with sand and gravel along the left bank.", x: 18, y: 57, zoom: 1.5, accent: "#d49b43", shape: "rect", size: 23 },
  { label: "dry channel / provisional", title: "The channel between rains", body: "Unconsolidated alluvium: mud, sand, gravel, and cobbles recently transported by intermittent water flow. The dry channel runs from the middle distance toward the foreground.", x: 54, y: 68, zoom: 1.38, accent: "#8a6954", shape: "rect", size: 31 },
  { label: "background ridges / provisional", title: "Layers tilted into the distance", body: "Tilted layers of sandstone, shale or siltstone, and possibly conglomerate. The repeating banded texture is typical of layered sedimentary rocks in the background ridges.", x: 61, y: 32, zoom: 1.34, accent: "#7a5c76", shape: "rect", size: 25 },
];

export default function Humahuaca() {
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <div className="humahuaca-page">
      <header className="article-header">
        <a href="/field" className="article-back"><ArrowLeft size={15} /> <span>koreo field manual</span></a>
      </header>

      <main className="article-column">
        <h1>Quebrada de Humahuaca</h1>
        <p className="article-subtitle">A UNESCO World Heritage site in Argentina and Chile carved by time.</p>

        <p className="article-preimage">This looks very likely to be in the central Andes, most plausibly near Tupiza, Bolivia, or possibly the Quebrada de Humahuaca / Purmamarca region of northwest Argentina. The dry high-altitude setting, red folded sedimentary outcrop, sparse shrubs, and broad ephemeral stream channel are especially consistent with the Bolivian–Argentine Andes. A precise location cannot be established from the image alone.</p>

        <figure className="article-figure">
          <button className="article-image-launch" type="button" onClick={() => setReaderOpen(true)} aria-label="Open Koreo guided reading of the Quebrada de Humahuaca photograph">
            <img className="article-source-image" src={HUMAHUACA_IMAGE} alt="A dry channel leading through the multi-coloured mountains of Quebrada de Humahuaca" />
          </button>
          <div className="article-image-footer">
            <figcaption className="article-image-caption">
              <h2>A valley shaped by passage</h2>
              <p>Quebrada de Humahuaca follows the line of a major cultural route, the Camino Inca, along the spectacular valley of the Rio Grande, from its source in the cold high desert plateau of the High Andean lands to its confluence with the Rio Leone some 150 km to the south. This UNESCO World Heritage Site features dramatic multi-coloured rock formations, pre-Incan and Incan history, and vibrant Andean culture spanning 10,000 years.</p>
            </figcaption>
            <button className="article-koreo-tab" type="button" onClick={() => setReaderOpen(true)} aria-label="Open Koreo guided reading of the Quebrada de Humahuaca photograph">
              <span>Koreo</span><ArrowUpRight size={12} />
            </button>
          </div>
        </figure>

        <div className="article-prose">
          <p>The landscape is a desert or semi-desert alluvial valley: rainwater periodically rushes through the central channel, carrying mud, sand, gravel, and rock fragments downhill. Most of the time it is dry, but its braided surface and steep, loose banks show that it can flood abruptly.</p>
          <p>The dramatic central red formation appears to be steeply tilted and eroded sedimentary strata—layers originally deposited horizontally by rivers, lakes, or debris flows, later uplifted, compressed, and tilted during Andean mountain building. Similar regional sequences include conglomerate, sandstone, and siltstone deposited in river and alluvial-fan environments.</p>
        </div>
      </main>

      <footer className="article-footer"><a href="/field">koreo</a><span>one image / many deliberate readings</span></footer>

      <KoreoReaderModal open={readerOpen} onClose={() => setReaderOpen(false)} imageSrc={HUMAHUACA_IMAGE} imageAlt="A dry channel leading through the multi-coloured mountains of Quebrada de Humahuaca" steps={humahuacaSteps} stageVariant="portrait" />
    </div>
  );
}
