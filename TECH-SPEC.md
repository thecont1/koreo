# koreo Technical Specification

**Status:** Reference implementation specification  
**Implementation:** React 19 + TypeScript + Vite + Tailwind CSS 4  
**Primary reference:** [`KoreoReaderModal.tsx`](https://github.com/thecont1/koreo/blob/welcome/client/src/components/KoreoReaderModal.tsx)  
**Authoring reference:** [`AuthoringStudio.tsx`](https://github.com/thecont1/koreo/blob/welcome/client/src/pages/AuthoringStudio.tsx)

## 1. Purpose and scope

koreo is a guided reader for a single source photograph. It separates the **article state**, where a photograph remains undisturbed, from the **reader state**, where authored text and camera movement guide attention through the image. The system is designed for photo-led journalism, visual essays, documentary work, educational media, archives, and any situation where an image needs several distinct readings.

The current repository contains both a reference reader and an Authoring Studio. The reader is the product behavior; the Studio is an authoring aid that emits and restores compatible story documents. The implementation is intentionally small enough to be ported to vanilla JavaScript, Web Components, or other view layers without changing the core data model.

| Layer | Responsibility | Reference |
| --- | --- | --- |
| Article page | Presents the untouched source photograph and opens the reader only on intent. | [`Humahuaca.tsx`](https://github.com/thecont1/koreo/blob/welcome/client/src/pages/Humahuaca.tsx), [`CinqueTerre.tsx`](https://github.com/thecont1/koreo/blob/welcome/client/src/pages/CinqueTerre.tsx) [1] |
| koreo reader | Owns focus, camera movement, captions, navigation, preference persistence, and dialog behavior. | [`KoreoReaderModal.tsx`](https://github.com/thecont1/koreo/blob/welcome/client/src/components/KoreoReaderModal.tsx) [2] |
| Authoring Studio | Creates, edits, saves, and reloads stories while previewing the source image in a chosen window. | [`AuthoringStudio.tsx`](https://github.com/thecont1/koreo/blob/welcome/client/src/pages/AuthoringStudio.tsx) [3] |
| Styling layer | Defines reader orientation, stage sizing, caption rails, focus geometry, and responsive behavior. | [`index.css`](https://github.com/thecont1/koreo/blob/welcome/client/src/index.css) [4] |

## 2. Design invariants

The following constraints are implementation requirements, not visual preferences.

> **The article photograph must remain unobstructed.** koreo activation belongs to the image click target and an optional tab below the image, not to controls overlaid on the photo.

| Invariant | Required behavior |
| --- | --- |
| Authored states only | The reader may display only configured beats. It must not manufacture intermediate beats from scroll position. |
| Source-relative coordinates | Every focal coordinate is normalized to the source image, never to a viewport crop. |
| Geometric integrity | Region types are `none`, `circle`, or `square`. A circle and square must render at a 1:1 visual ratio. |
| Orientation-aware captions | Portrait windows use a vertical rail to the right; landscape windows use a horizontal rail below the stage. |
| Original-image mode | The reader can display the uncropped source with captions hidden, within the same reader shell. |
| Durable preferences | Surface and original-image mode are stored locally for the current site. |

## 3. Story document contract

### 3.1 Canonical document

The Studio creates a single story document. It contains descriptive metadata, source-image metadata, a viewport recommendation, defaults, and an ordered beat array.

```ts
type KoreoStory = {
  schemaVersion: "1.0";
  id: string;
  title: string;
  image: {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;
    alt: string;
  };
  viewport: {
    aspectRatio: number;
    fit: "cover";
    maxHeightVh: number;
    background: string;
  };
  defaults: {
    transition: {
      durationMs: number;
      ease: "gentle";
    };
  };
  steps: KoreoStep[];
};
```

### 3.2 Steps

Each step carries its own caption, region, camera target, and optional highlight treatment.

```ts
type KoreoStep = {
  id: string;
  caption: {
    eyebrow: string;
    title: string;
    body: string;
  };
  region: KoreoRegion;
  camera: {
    x: number;     // normalized source coordinate, 0–1
    y: number;     // normalized source coordinate, 0–1
    zoom: number;  // 1 or greater
  };
  highlight?: {
    edge: "soft";
    color: string;
    dimOutside: boolean;
    dimOpacity: number;
  };
};

type KoreoRegion =
  | { type: "none" }
  | { type: "circle"; x: number; y: number; diameter: number }
  | { type: "square"; x: number; y: number; side: number };
```

All `x` and `y` fields are fractions of source-image width and height. The Studio exposes those same values as percentages for direct editing. A historical `rect` region is read as a Square for backward compatibility, but newly saved stories use `square` plus `side`. This is a one-way simplification: the active product contract does not produce rectangles.

### 3.3 Example

```json
{
  "schemaVersion": "1.0",
  "id": "cinque-terre-italy",
  "title": "Cinque Terre, Italy",
  "image": {
    "src": "cinque-terre.webp",
    "intrinsicWidth": 2048,
    "intrinsicHeight": 706,
    "alt": "Cliffside view seen from Manarola village in Cinque Terre, Italy."
  },
  "viewport": {
    "aspectRatio": 1.5,
    "fit": "cover",
    "maxHeightVh": 0.78,
    "background": "#111111"
  },
  "defaults": { "transition": { "durationMs": 860, "ease": "gentle" } },
  "steps": [
    {
      "id": "sea",
      "caption": { "eyebrow": "sea", "title": "The Ligurian Sea", "body": "…" },
      "region": { "type": "circle", "x": 0.07, "y": 0.45, "diameter": 0.14 },
      "camera": { "x": 0.07, "y": 0.45, "zoom": 1.1 },
      "highlight": { "edge": "soft", "color": "#b4513d", "dimOutside": true, "dimOpacity": 0.36 }
    }
  ]
}
```

## 4. Reader component API

The reference reader accepts a streamlined view-model rather than a story document directly. An integration layer maps a document’s `steps` into this component contract.

```ts
type KoreoReaderStep = {
  label: string;
  title: string;
  body: string;
  x: number;      // percent, 0–100
  y: number;      // percent, 0–100
  zoom: number;
  accent: string;
  shape?: "circle" | "square" | "none";
  size?: number;  // percent of rendered source-frame width
};

type KoreoReaderModalProps = {
  open: boolean;
  imageSrc: string;
  imageAlt: string;
  steps: KoreoReaderStep[];
  onClose: () => void;
  windowRatio?: string; // "W:H", for example "3:4" or "16:9"
};
```

The choice of a `"W:H"` string is deliberate. Authors identify the intended shape, not browser pixels. A portrait ratio fits the available height; a landscape ratio fits the available width; a square uses the largest bounded square. The reader categorizes `ratio > 1` as landscape, `ratio < 1` as portrait, and equality as square. [2]

## 5. Coordinate and camera model

### 5.1 Definitions

Let:

| Symbol | Meaning |
| --- | --- |
| `Iw`, `Ih` | Intrinsic source-image dimensions |
| `Sw`, `Sh` | Visible stage dimensions |
| `Ai = Iw / Ih` | Source-image aspect ratio |
| `As = Sw / Sh` | Reader-window aspect ratio |
| `u`, `v` | Normalized focal coordinate in `[0, 1]` |
| `z` | Camera zoom, where `z ≥ 1` |

The reader first establishes the dimensions of the **source frame** needed to cover the stage without distortion.

```text
if Ai > As:
  sourceFrame.width  = (Ai / As) × 100%
  sourceFrame.height = 100%
  sourceFrame.left   = (100% - sourceFrame.width) / 2
  sourceFrame.top    = 0

otherwise:
  sourceFrame.width  = 100%
  sourceFrame.height = (As / Ai) × 100%
  sourceFrame.left   = 0
  sourceFrame.top    = (100% - sourceFrame.height) / 2
```

This distinction is essential. Mapping a focal coordinate directly to the stage creates drift whenever a source image and reading window have different aspect ratios. Mapping it to the source frame preserves the Studio’s coordinate system.

### 5.2 Camera translation

The active camera frame scales from the top-left source-frame origin. For each axis, koreo requests a translation that centers the focal coordinate, then clamps that translation so blank space cannot enter the stage.

```text
requestedOffset = 50 - (frameStart + focal × frameSpan) × zoom
minimumOffset   = 100 - zoom × (frameStart + frameSpan)
maximumOffset   = -zoom × frameStart
offset          = clamp(requestedOffset, minimumOffset, maximumOffset)
```

The reader applies `translate3d(offsetX%, offsetY%, 0) scale(zoom)` with an 860 ms cubic-bezier transition. The transformation starts only after the source frame has been sized, allowing wide and tall images to retain their authored locations. [2]

### 5.3 Focus regions

The focus region is a child of the source frame, so its `left` and `top` use the original normalized point. The region’s width derives from the configured size relative to source-frame width. CSS `aspect-ratio: 1` produces equal physical width and height; `border-radius: 50%` creates a Circle and `border-radius: 0` creates a Square. This prevents the oval and stretched-rectangle artifacts that occur when percentage widths and heights are independently applied to a non-square container. [4]

## 6. Layout behavior

### 6.1 Reader shell

The modal reader is a bounded, centered dialog. It uses the lesser of the viewport minus margins and a 1560 × 920 maximum frame. The header is intentionally compact: repository identity, surface switch, original-image mode, and close control.

| Reader shape | Image treatment | Caption treatment |
| --- | --- | --- |
| Portrait | Height-bounded stage; source image covers the camera frame. | Vertical caption rail to the right. |
| Landscape | Width-bounded stage. | Horizontal, scrollable caption row below the image. |
| Square | Largest available square. | Bounded caption area below the image. |
| Original-image mode | Source is contained, never cropped. | Hidden. |

For horizontal caption rails, vertical mouse-wheel movement is translated to `scrollLeft`; trackpad horizontal input remains native. The rail uses `scroll-snap-type: x mandatory`, and programmatic navigation centers the chosen caption with `scrollIntoView({ inline: "center" })`. [2] [4]

### 6.2 Page launch behavior

The article or specimen page is not a reduced version of the reader. It is a normal, quiet image page. Clicking the source image or a compact koreo tab opens the reader; closing it returns the reader to the page. The Cinque Terre specimen demonstrates this page-first launch for an ultra-wide image. [1]

## 7. Navigation state machine

The active beat is an integer in `[0, steps.length - 1]`. Navigation is deliberately constrained to that finite set.

```text
input → candidate authored index → dwell gate → active index → camera + caption transition
```

The current implementation uses two timing controls.

| Control | Value | Purpose |
| --- | ---: | --- |
| Scroll-beat dwell | 1000 ms | Holds the current beat before allowing a scroll-derived transition. |
| Manual-navigation lock | 900 ms | Prevents smooth scrolling caused by Previous, Next, or keyboard navigation from being reinterpreted as stale user scroll. |
| Camera transition | 860 ms | Provides a deliberate eased camera and focus move. |

When a scroll surface crosses multiple captions, the state machine queues only the next adjacent authored index. It does not jump to an arbitrary midpoint or create visual phantom beats. A manual action clears the pending scroll transition, updates the active index, and temporarily locks scroll-derived changes. [2]

## 8. Authoring Studio

### 8.1 Preview-stage model

The Studio uses the same `cover` logic as the reader. Its `getRenderedImageFrame` function determines the cover-sized image bounds from stage dimensions, intrinsic image dimensions, zoom, and pan offset. A click is then transformed from screen space into normalized source coordinates.

```text
normalizedX = (pointerX - stageLeft - frameLeft) / renderedFrameWidth
normalizedY = (pointerY - stageTop  - frameTop)  / renderedFrameHeight
```

Values are clamped to `[0, 1]`, converted to percentages for editing, and stored on the active beat. A click on an overview beat promotes it to a Circle so the author receives immediate visual confirmation. [3]

### 8.2 Pan and zoom

Pointer movement begins with pointer capture. The Studio calculates the permissible pan range from the cover-sized, zoomed source frame and clamps both axes. This permits unusually wide sources to travel across their complete horizontal range while preventing a blank stage after changing reader-window ratio.

| Interaction | State update |
| --- | --- |
| Pointer down | Stores origin pointer and pan offsets; cursor becomes `grabbing`. |
| Pointer move | Adds pointer delta and clamps it to the current cover bounds. |
| Pointer up/cancel | Releases the active panning state; cursor returns to `grab`. |
| Window ratio or zoom changes | Re-clamps the current pan against the new frame bounds. |

### 8.3 Save and Load behavior

The Studio’s visible controls use plain-language labels: **Copy**, **Load**, and **Save**. Internally, Save serializes the canonical story document; Load accepts only compatible document files, validates their root structure, and restores image metadata, window ratio, beats, coordinates, zoom, focus shape, size, and accent. No file-format terminology is shown in the authoring interface. [3]

## 9. Accessibility and input support

| Area | Behavior |
| --- | --- |
| Dialog semantics | The reader uses `role="dialog"`, `aria-modal="true"`, and an explicit label. |
| Focus management | On open, focus moves to the close control; on close, focus returns to the activating element. |
| Keyboard navigation | Arrow keys move beats; Home and End select boundaries; Escape exits original-image mode or closes the dialog. |
| Interactive labels | Image launch, theme, original-image mode, previous, next, and close controls all provide accessible labels. |
| Reduced motion | `prefers-reduced-motion` removes caption animation and resolves scroll updates without the dwell delay. |
| Visible focus | Page launch controls, reader identity, and authoring controls maintain keyboard-visible outlines. |

## 10. Persistence and error handling

Reader preferences use `localStorage` under the key `koreo.viewer-preferences.v1`.

```ts
type ViewerPreferences = {
  surface: "dark" | "light";
  imageMode: boolean;
};
```

Storage access is guarded with `try/catch`; reader operation remains available if storage is blocked. Image aspect state is initialized from the requested reader ratio and corrected when the source image’s intrinsic dimensions load. This avoids an unframed stage during initial image load while ensuring the final source-frame geometry is authoritative. [2]

## 11. Performance considerations

The reader uses CSS transforms and opacity for the high-frequency camera and caption transitions. The camera plane declares `will-change: transform`; focus geometry remains inside the transformed source frame; and captions remain finite authored nodes rather than an infinite scroll calculation. The project avoids per-frame JavaScript animation and uses `requestAnimationFrame` only to coalesce scroll-derived state decisions. [2] [4]

For production deployments, source photographs should be pre-sized for the largest intended reader stage and served in a modern image format. The supplied documentation screenshots are resized to a 1600 px maximum width and stored as optimized WebP assets.

## 12. Implementation roadmap

The reference implementation is complete enough to demonstrate the interaction model. The following work would strengthen a reusable library release.

| Priority | Next implementation step |
| --- | --- |
| High | Extract the reader into a framework-agnostic package with a small DOM adapter. |
| High | Validate story documents against a published schema at load time. |
| High | Provide a stable public asset strategy for consumer applications. |
| Medium | Add direct URL addressing for a selected beat. |
| Medium | Add import of a story document directly into a named route. |
| Medium | Add automated browser tests for aspect ratio, coordinate, and focus-shape invariants. |
| Medium | Add localization hooks for captions and control labels. |

## References

| Ref. | Source |
| --- | --- |
| [1] | [Article and specimen routes](https://github.com/thecont1/koreo/tree/welcome/client/src/pages) |
| [2] | [Reader implementation](https://github.com/thecont1/koreo/blob/welcome/client/src/components/KoreoReaderModal.tsx) |
| [3] | [Authoring Studio implementation](https://github.com/thecont1/koreo/blob/welcome/client/src/pages/AuthoringStudio.tsx) |
| [4] | [Reader and Studio styles](https://github.com/thecont1/koreo/blob/welcome/client/src/index.css) |
