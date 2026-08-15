/**
 * koreo specimen direction: a near-blank white canvas where the photograph
 * remains untouched until the reader begins; the only invitation is a quiet
 * koreo tab below the image.
 */
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { KoreoReaderModal, type KoreoReaderStep } from "@/components/KoreoReaderModal";

const CINQUE_TERRE_IMAGE = "/manus-storage/cinque-terre-koreo_e1fa6371.webp";

const cinqueTerreSteps: KoreoReaderStep[] = [
  {
    label: "overview",
    title: "Start with the whole frame",
    body: "Cinque Terre is a stunning UNESCO World Heritage site on the Italian Riviera. The region is made up of five strikingly colourful, cliffside villages—Monterosso al Mare, Vernazza, Corniglia, Manarola and Riomaggiore—known for seaside sceneries, hiking trails, fresh seafood, and no cars.",
    x: 50,
    y: 52,
    zoom: 1,
    accent: "#b4513d",
    shape: "none",
  },
  {
    label: "sea",
    title: "The Ligurean Sea",
    body: "The Ligurian Sea is a branch of the Mediterranean Sea located between the northwestern coast of Italy (regions of Liguria and Tuscany) and the French island of Corsica.",
    x: 7,
    y: 45,
    zoom: 1.1,
    accent: "#b4513d",
    shape: "circle",
    size: 14,
  },
  {
    label: "shops",
    title: "Shop with a View",
    body: "Walk up the cliff path for the restaurants, restrooms and retail shops. They all have a view.",
    x: 34,
    y: 32,
    zoom: 1.22,
    accent: "#225ea8",
    shape: "circle",
    size: 14,
  },
  {
    label: "fish",
    title: "Fishing Village",
    body: "Manarola is a historic cliffside fishing village. It features a tiny concrete harbour where local wooden boats are hauled straight up the main street. Watch local fishermen prep gear or see traditional boats parked right on the village ramp.",
    x: 80,
    y: 66,
    zoom: 1.22,
    accent: "#225ea8",
    shape: "circle",
    size: 14,
  },
  {
    label: "houses",
    title: "Pastel Houses",
    body: "Manarola features iconic, multi-colored tower houses piled high on a steep, dark rock cliff. These bright pastel buildings cluster tightly around the tiny, deep-water harbour, creating one of the most famous and photographed postcard views in Europe.",
    x: 65,
    y: 35,
    zoom: 1.75,
    accent: "#225ea8",
    shape: "circle",
    size: 17,
  },
  {
    label: "eat",
    title: "Eat, Pray, Live",
    body: "Manarola features classic Ligurian coastal fare. Highlights include fresh seafood, authentic basil pesto, and fried street food cones. Try iconic local specialties like trofie al pesto, salted or fried anchovies, seafood pastas, and crisp regional white wines enjoyed during a clifftop aperitivo.",
    x: 50,
    y: 50,
    zoom: 1,
    accent: "#b4513d",
    shape: "none",
  },
];

export default function CinqueTerre() {
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <main className="cinque-terre-page">
      <figure className="cinque-terre-figure">
        <button className="cinque-terre-image-launch" type="button" onClick={() => setReaderOpen(true)} aria-label="Open the Koreo guided reading of Cinque Terre">
          <img className="cinque-terre-image" src={CINQUE_TERRE_IMAGE} alt="Cliffside view seen from Manarola village in Cinque Terre, Italy." />
        </button>
        <figcaption className="cinque-terre-footer">
          <button className="cinque-terre-koreo-tab" type="button" onClick={() => setReaderOpen(true)} aria-label="Open the Koreo guided reading of Cinque Terre">
            <span>koreo</span><ArrowUpRight size={12} />
          </button>
        </figcaption>
      </figure>

      <KoreoReaderModal open={readerOpen} onClose={() => setReaderOpen(false)} imageSrc={CINQUE_TERRE_IMAGE} imageAlt="Cliffside view seen from Manarola village in Cinque Terre, Italy." steps={cinqueTerreSteps} windowRatio="3:2" />
    </main>
  );
}
