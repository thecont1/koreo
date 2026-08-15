# koreo

> **A guided reader for photographs with more than one story to tell.**

koreo turns a detailed photograph into a deliberate sequence of readings. A reader opens from the photograph itself, settles on an authored point of attention, and gives each caption enough room to be understood before moving on. The photograph stays central; controls stay off its surface until the reader begins.

**[Open the live demo](https://focusguide-ds6uadox.manus.space/)** · **[Try the wide-image specimen](https://focusguide-ds6uadox.manus.space/cinque-terre)** · **[Open Authoring Studio](https://focusguide-ds6uadox.manus.space/author)** · **[Read the technical specification](TECH-SPEC.md)**

![A koreo reader with a portrait photograph and the active caption rail.](https://focusguide-ds6uadox.manus.space/manus-storage/koreo-viewer-portrait-caption-rail_86e33c32.webp)

## Why koreo

Photographs can carry many simultaneous facts: a landscape’s geology, a street’s social geography, an archive’s visual evidence, or the small details that turn observation into understanding. Conventional captions sit outside that visual field. koreo offers an alternative: one source image, a fixed reading window, and a paced path through its important regions.

The result is a reader that behaves more like a patient guide than a slideshow. The author chooses the points, the order, the camera scale, the focus geometry, and the voice of each beat; the audience can use scrolling, previous/next controls, or the keyboard without losing the thread.

| What koreo protects | What koreo adds |
| --- | --- |
| The photograph remains unobstructed on the article page. | A full-screen-adjacent reader opens only when invited. |
| The original image can be viewed without crop. | A camera frame moves to authored coordinates with eased transitions. |
| Captions remain distinct from image-making. | A short sequence of editorial readings gives detail context and order. |

## The reader

The reader is designed around the natural orientation of the authored window. A **portrait** reading window places the captions to the right of the image. A **landscape** window uses a horizontal caption rail beneath the image, preserving horizontal space for a wide photograph. Square windows use the same bounded, image-first treatment.

![The article page remains quiet; koreo is invited from the image or the small tab below it.](https://focusguide-ds6uadox.manus.space/manus-storage/koreo-article-page-launch_c15e77e3.webp)

Each beat contains a label, a title, a concise body, a focal coordinate, a camera zoom, an accent, and an optional focus region. A focus region is either a **Circle** or a **Square**—never a stretched oval or rectangle. Coordinates are normalized to the source photograph, so the same authored location remains meaningful even when the reader window changes shape.

### Reading controls

| Control | Purpose |
| --- | --- |
| Scroll or trackpad | Progress through the authored caption sequence at a deliberate pace. Wide-image rails translate vertical wheel movement into horizontal progression. |
| Previous / Next | Move one authored beat at a time. |
| Arrow keys | Use left/right or up/down for the same paced navigation. Home and End jump to the boundaries. |
| Surface switch | Choose a dark or light reading surface; koreo remembers the preference on the same site. |
| Original-image mode | Hide captions and view the entire source image without crop. |
| Escape | Return from original-image mode, then close the reader. |

## Authoring Studio

The included **koreo Authoring Studio** converts editorial intent into a portable story document. Load a photograph, choose the reading window, click to place a focus point, pan a wide source image, write the beat copy, and save the result for later use.

![The koreo Authoring Studio shows source controls, a fit-to-height image stage, and beat editing in one focused workspace.](https://focusguide-ds6uadox.manus.space/manus-storage/koreo-authoring-studio_7e20290c.webp)

The Studio is built for a single-screen authoring rhythm. Its source panel, image stage, and beat panel remain visible together at desktop size. The selected focus point sits directly beneath the click position, image panning uses a grab/grabbing interaction, and the frame can be set to **1:1**, **3:2**, **2:3**, **4:3**, **3:4**, or **16:9**.

| In the Studio | What it does |
| --- | --- |
| **Load Image** | Loads a local photograph and reads its dimensions for the stage. |
| **Reader window** | Sets the intended reading-frame ratio. |
| **Click and drag** | Click to place the active focus point; drag to pan a source that exceeds the frame. |
| **Circle / Square** | Defines the optional region geometry for a beat. |
| **Copy, Load, Save** | Moves a complete story between sessions without exposing file-format language in the authoring interface. |
| **Accent picker** | Keeps one active colour visible and reveals the broader palette only when needed. |

## See koreo in action

The demo currently includes two deliberately different specimens.

| Specimen | What it demonstrates |
| --- | --- |
| [Quebrada de Humahuaca](https://focusguide-ds6uadox.manus.space/) | A portrait reading window with side captions and a geological sequence across a vertical source frame. |
| [Cinque Terre](https://focusguide-ds6uadox.manus.space/cinque-terre) | A quiet wide-image page that opens into a landscape reader with a horizontal caption rail. |

## Run the demo locally

The reference implementation is a React 19, TypeScript, Vite, and Tailwind prototype. It is intentionally kept as an explorable implementation rather than a published package; the core reader contract is documented in [TECH-SPEC.md](TECH-SPEC.md).

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/` for the Humahuaca article, `/cinque-terre` for the wide-image specimen, and `/author` for Authoring Studio.

## Project principles

> **Photographs are sacred.** The page-level photograph carries no overlaid viewer controls. The reader is a distinct, intentional space.

1. **One authored beat at a time.** koreo never invents in-between states; the reader advances only through real beats.
2. **Coordinates belong to the source image.** The reader frames the source before it moves the camera, so authored positions survive changes in window ratio.
3. **Shapes stay legible.** Regions are either Circle or Square, rendered with equal dimensions.
4. **The reader remembers.** Surface and original-image preferences persist locally per site.
5. **Accessibility is part of the experience.** The reader has keyboard navigation, focus return on close, semantic dialog behavior, visible focus treatment, and reduced-motion support.

## Status and contribution

koreo is being shaped as an open-source storytelling tool. The live prototype is the current design reference; component behavior, data structures, interaction semantics, and implementation decisions are described in [TECH-SPEC.md](TECH-SPEC.md). Contributions that sharpen the framework-agnostic core, improve authoring ergonomics, or expand accessibility are especially welcome.

© Mahesh Shantaram
