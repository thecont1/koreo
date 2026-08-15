# Focus Story: implementation plan for a reusable image-narrative component

**Prepared by Manus AI**  
**Status:** Product and technical plan; no implementation has begun

## Executive decision

The proposed project is viable and should be treated as a **single-image, modal scrollytelling component**, rather than a generic photo lightbox or an image-annotation widget. A reader activates an article photograph, the page becomes visually and interactively subordinate, and a fixed view window takes them through a sequence of caption beats. Every beat connects a semantic region in the original image with a camera framing that decides how much context the reader should see.

The recommendation is to make the public runtime **dependency-free HTML, CSS, and vanilla TypeScript/JavaScript**, then expose an optional GSAP adapter for enhanced transition choreography. This preserves the small footprint and portability needed for broad adoption across media sites, blogs, and static-site generators. GSAP must remain an optional peer dependency: it should enhance an already-complete native implementation, never be required to open, navigate, or read a story.

> **The fundamental product contract is: one source image, one fixed viewing stage, ordered caption beats, and separate semantic-region versus camera-framing data.**

The attached specification correctly identifies the essential distinction. A region answers *what matters*; a camera answers *how the view should be composed*. The source image dimensions are authoritative for coordinate mapping, while the displayed stage dimensions are calculated at runtime from the available screen space.

## Expectations to set before implementation

The product should not promise automatic image understanding, automatic hotspot placement, or cinema-like continuous motion in v1. Its value is **editorial control**. An author deliberately marks regions, chooses camera positions where composition matters, and writes discrete caption chunks. The runtime then provides a stable, polished route through those decisions.

| Decision | Recommended v1 position | Reasoning |
|---|---|---|
| Primary unit | A single-image focus story | It makes the camera mathematics, authoring contract, and accessibility model coherent. |
| Launch interaction | A reader activates an annotated article image; a modal experience opens at an initial step | This clearly separates ordinary article reading from the guided narrative. |
| Canonical authored format | Versioned JSON | It is straightforward to validate, portable across frameworks, and ideal for a later GUI. |
| Markdown support | Build-time adapter that compiles to canonical JSON | Markdown is author-friendly, but must not become a second runtime data model. |
| Coordinates | Normalized `0…1` values in source-image space | They remain valid when the same image is resized, compressed, or shown at different viewport sizes. |
| Circle sizing | `diameter`, normalized to the source image’s shorter side | This matches author intuition and avoids ambiguity between radius and diameter. |
| Camera data | Optional per-step override; derived from the region otherwise | It supports a fast authoring path without sacrificing composition control. |
| Motion | Discrete active-step changes with eased pan, zoom, and highlight transitions | It remains comprehensible under fast scrolling and reduced-motion settings. |
| Desktop/mobile layout | Desktop split stage and caption column; compact layout pins the stage above a caption scroller | It retains a stable image window without constraining readable caption width. |
| Initial rendering boundary | Reuse the existing `Lightbox.astro` modal shell through an adapter, not by embedding story-specific behaviour into it | This protects the existing lightbox and makes the focus story a separately testable feature. |

The component should use a native modal `<dialog>` where the host platform permits it. When opened through `showModal()`, a native dialog provides a modal layer, page inertness, Escape handling, focus behaviour, and a stylable backdrop; the component must still render an explicit close control and restore focus to the launch element.[1] The zoom and pan belong in a transformed scene plane rather than page layout: CSS transforms support translation and scaling in a shared coordinate space, so the image and its highlight can remain perfectly registered.[3]

## Product scope

### V1: the smallest complete product

V1 must accept one photographic asset with declared intrinsic dimensions, create a fixed-aspect view window, show one ordered caption sequence, and move the source image through per-step or derived pan/zoom targets. It must support `none`, `circle`, and `rect` regions; soft or hard highlight edges; a dim-outside-highlight treatment; keyboard navigation; scroll-driven activation; explicit next/previous controls; a close control; and `prefers-reduced-motion` behaviour. Users who opt to reduce motion should receive immediate state changes or a restrained dissolve rather than animated camera movement, because large pan-and-zoom effects can be motion triggers.[2] [3]

V1 must be responsive, allow the image source to be larger than the view window, clamp camera movement at image edges, and keep caption content as semantic HTML. It must make every story intelligible without a mouse and without animation. It must also expose lifecycle events, but it should not include analytics or data collection itself.

### Explicit non-goals for V1

The first release should defer multi-image scenes, video, maps, freehand polygons, automatic computer-vision tagging, audio choreography, multiplayer editing, a hosted CMS, and a visual authoring GUI. These are each useful ideas, but they independently complicate the model and risk delaying the interoperable core.

A standalone GUI belongs in a later package after the JSON contract and camera mathematics have been proven against real stories. The editor can then write the same canonical document the runtime already consumes, rather than inventing a separate saved format.

## Interaction contract

The host article contains a real image and an accessible launch button, ideally layered over or adjacent to the image rather than depending on the image alone as the only activation target. When activated, the component preloads and decodes the high-resolution asset, calculates stage geometry, opens the modal, sets the first active caption, moves focus to the close control, and makes the caption panel the primary scroll container.

The dialog is not a long page that hijacks document scroll. The modal owns the interaction while it is open; the reader scrolls the caption rail inside it. The active caption changes when its anchor crosses a configurable reading line. Navigation buttons, a progress rail, arrow keys, Home/End, and direct step selection provide non-scroll alternatives. Closing the modal returns focus to the originating launch control and restores the underlying article at the exact scroll position where the reader began.

| Input | Behaviour |
|---|---|
| Article-image trigger or accessible “Explore image” button | Opens the focus story at `initialStepId`, or the first step when none is specified. |
| Caption-panel scroll | Selects the step whose anchor most recently crossed the reading line; updates camera, highlight, rail, and live status. |
| Next/previous buttons or Arrow Down/Arrow Up | Moves to the adjacent step and scrolls that caption into view. |
| Home/End | Moves to the first or last step. |
| Rail button | Moves to a named step; exposes its order and title via accessible text. |
| Escape or close button | Closes the modal and restores focus to the originating trigger. |
| Reduced-motion preference | Disables camera interpolation and highlight chasing; step changes happen immediately or with a short opacity-only dissolve. |
| Asset failure | Shows the original article image or a descriptive error message; captions remain readable. |

## Coordinate and camera model

The design needs three spaces, not merely two. **Source space** is the intrinsic pixel rectangle of the photograph. **Normalized authoring space** expresses a source point as `x` and `y` fractions from `0` to `1`; it is what JSON stores. **Stage space** is the runtime CSS-pixel rectangle of the fixed viewing window. The runtime maps normalized values to source pixels, then maps source pixels into stage pixels after the camera transform.

The author should never need to supply viewport-pixel offsets. For a source image `Iw × Ih`, normalized point `(x, y)` is converted to source point `(x × Iw, y × Ih)`. The unzoomed base scale is `max(Vw / Iw, Vh / Ih)` for `cover`, or `min(Vw / Iw, Vh / Ih)` for `contain`, where `Vw × Vh` is the stage. The effective scale is the base scale multiplied by the camera zoom. To centre a target source point `(Px, Py)` in the stage, calculate:

```text
tx = (Vw / 2) − (Px × effectiveScale)
ty = (Vh / 2) − (Py × effectiveScale)
```

The renderer clamps those translations so a `cover` image cannot expose empty space. For `contain`, if a scaled source dimension is smaller than its stage dimension, the renderer centres that dimension; otherwise it applies the same edge clamp. The image, dimmed duplicate, and highlight ornament are children of the same transformed scene plane, so they use one transform and cannot drift apart.

A circle’s `diameter` is measured against the source image’s shorter intrinsic edge; a rectangle’s `width` and `height` are measured against source width and height respectively. A square is therefore a `rect` with matching normalized width and height. This is more stable for panoramas and portrait photographs than treating all region dimensions as a percentage of the rendered stage.

## Architecture

### Package boundary

The project should be an ESM-first monorepo. The core needs no framework assumptions; Astro support is a small integration package that can work with the existing site’s `Lightbox.astro` conventions.

```text
focus-story/
├── packages/
│   ├── core/                 # Framework-free runtime and CSS
│   ├── astro/                # Astro component and Lightbox-shell adapter
│   ├── markdown/             # Build-time Markdown-to-JSON compiler
│   └── gsap-adapter/         # Optional animation adapter; peer dependency only
├── apps/
│   ├── docs/                 # Interactive documentation and examples
│   └── playground/           # Fixture stories and visual regression targets
├── schemas/
│   └── focus-story.v1.json   # Canonical JSON Schema
└── examples/
    ├── vanilla/
    └── astro/
```

### Core component tree

```text
FocusStoryController
├── TriggerBinder
├── ModalShellAdapter
│   ├── FocusStoryDialog
│   │   ├── Header
│   │   │   ├── StoryLabel
│   │   │   └── CloseButton
│   │   ├── Stage
│   │   │   ├── CameraPlane
│   │   │   │   ├── BaseImage
│   │   │   │   ├── DimmedImageCopy
│   │   │   │   └── HighlightRenderer
│   │   │   └── StageCaption
│   │   ├── CaptionScroller
│   │   │   └── StepArticle × n
│   │   ├── ProgressRail
│   │   └── StepControls
│   └── FocusRestorer
└── LifecycleEventEmitter
```

| Module | Responsibility | Must not own |
|---|---|---|
| `schema` and `validateStory` | Validate JSON shape and semantic rules before mounting | DOM mutation or camera calculations |
| `normaliseStory` | Merge defaults, calculate fallback cameras, resolve source image metadata | Event listeners |
| `cameraMath` | Convert normalized source positions to fitted, clamped stage transforms | Caption or modal state |
| `StageRenderer` | Write transform and highlight CSS custom properties; load responsive image | Step activation policy |
| `HighlightRenderer` | Render `none`, hard/soft circle, or hard/soft rect treatments in source coordinates | Image panning |
| `CaptionScroller` | Render semantic caption articles; calculate active step from its scroll position | Camera math |
| `ProgressRail` | Render and expose direct step navigation | Scroll ownership |
| `ModalShellAdapter` | Use the existing Astro lightbox shell or native `<dialog>` without hard-coding either | Story parsing or content validation |
| `MotionDriver` | Apply native CSS transitions by default | GSAP-specific API calls |
| `GsapMotionDriver` | Translate the same motion requests to GSAP when present | Mandatory runtime functionality |
| `FocusStoryController` | Coordinate state, render requests, focus restoration, and public API | Low-level formatting logic |

`Lightbox.astro` should be treated as a shell-level dependency only. Extract or expose a neutral modal interface with `open()`, `close()`, `setContent()`, `getReturnFocusElement()`, and close-event subscription. Build `FocusStory.astro` against that interface. This avoids converting an image lightbox into a tightly coupled story engine and keeps the existing component usable for ordinary media.

### Rendering strategy

The stage has `overflow: hidden` and a calculated aspect ratio. `CameraPlane` is an absolutely positioned source-sized plane. The image and a dimmed duplicate share its transform. For a soft focal point, mask the dimmed duplicate with an inverse radial or rounded-rectangle mask; the untouched base image shows through at the region. For hard focus, use an abrupt mask edge and optional ring. A stroke layer provides a visually reliable fallback in browsers where the desired mask treatment is not available.

Camera updates should be batched into `requestAnimationFrame`, and the native motion driver should transition only `transform`, `opacity`, and carefully chosen filter properties. CSS custom properties carry target values to the renderer. Do not update DOM layout on every scroll event; use a passive scroll listener to schedule a single frame and then inspect only caption anchors. The optional GSAP adapter may replace native interpolation with a timeline, but it consumes exactly the same target camera and highlight values.

## Runtime state model

The canonical story document is immutable after validation. All mutable state remains internal to the controller and is serializable except for DOM references such as the original trigger element.

| State group | Fields | Purpose |
|---|---|---|
| Lifecycle | `phase: closed | opening | open | closing`, `openReason`, `returnFocusElement` | Controls modal state and focus restoration. |
| Asset | `imageStatus: idle | loading | ready | error`, `naturalWidth`, `naturalHeight` | Prevents the stage from animating before its source is ready. |
| Navigation | `activeStepId`, `activeIndex`, `requestedStepId`, `navigationSource: scroll | control | rail | open` | Separates the visible active state from an in-flight controlled navigation. |
| Layout | `stageWidth`, `stageHeight`, `layoutMode: split | stacked`, `reducedMotion` | Recalculates camera placement on resize, orientation change, or preference change. |
| Camera | `targetCamera`, `renderedCamera`, `cameraRevision` | Permits an optional interpolated render while preserving an exact target frame. |
| Highlight | `effectiveRegion`, `effectiveHighlight`, `highlightRevision` | Represents merged story defaults and per-step overrides. |
| Scroll coordination | `manualNavigationUntil`, `scrollRafPending`, `captionScrollTop` | Stops a smooth programmatic caption scroll from immediately selecting the wrong step. |
| Error | `validationErrors`, `assetError`, `fatalError` | Supports a readable fallback rather than a blank dialog. |

The reducer-style action set is intentionally small: `REQUEST_OPEN`, `ASSET_READY`, `ASSET_FAILED`, `SET_LAYOUT`, `REQUEST_STEP`, `SYNC_STEP_FROM_SCROLL`, `CAMERA_RENDERED`, `REQUEST_CLOSE`, and `CLOSED`. The controller derives the effective camera, region style, and progress fraction after every successful active-step change. Direct DOM reads happen in narrow adapter modules; state reducers and camera math remain pure and unit-testable.

```text
closed → REQUEST_OPEN → opening → ASSET_READY → open
open → caption scroll / rail / control → REQUEST_STEP → target camera + render
open → REQUEST_CLOSE / Escape → closing → CLOSED → restore original focus
opening → ASSET_FAILED → open with readable caption fallback
```

## Canonical JSON contract

The complete machine-readable schema is attached as `focus-story.schema.json`. It is versioned as `1.0` and uses JSON Schema Draft 2020-12. JSON is the sole interchange format. Human-authored Markdown is an optional authoring convenience that compiles to this document before the page is built.

### Canonical example

```json
{
  "schemaVersion": "1.0",
  "id": "harbour-morning",
  "title": "A harbour wakes up",
  "image": {
    "src": "/images/harbour-3200.jpg",
    "intrinsicWidth": 3200,
    "intrinsicHeight": 2133,
    "alt": "Fishing boats, a clock tower, and market stalls in a morning harbour"
  },
  "viewport": {
    "aspectRatio": 1.777778,
    "fit": "cover",
    "minHeightPx": 320,
    "maxHeightVh": 0.78,
    "background": "#111111"
  },
  "initialStepId": "harbour-overview",
  "defaults": {
    "highlight": {
      "edge": "soft",
      "feather": 0.34,
      "dimOutside": true,
      "dimOpacity": 0.42,
      "stroke": "none",
      "color": "#ffffff"
    },
    "transition": {
      "durationMs": 650,
      "ease": "gentle"
    }
  },
  "steps": [
    {
      "id": "harbour-overview",
      "caption": {
        "eyebrow": "Overview",
        "title": "Before the boats depart",
        "body": "The harbour gathers several different rhythms into one view.",
        "sourceLabel": "Municipal archive, 1932"
      },
      "region": { "type": "none" },
      "camera": { "x": 0.5, "y": 0.48, "zoom": 1 }
    },
    {
      "id": "clock-tower",
      "caption": {
        "eyebrow": "North quay",
        "title": "The clock that organized the day",
        "body": "At six, the tower clock set the market and the first departures in motion."
      },
      "region": {
        "type": "circle",
        "x": 0.71,
        "y": 0.18,
        "diameter": 0.13
      },
      "camera": { "x": 0.67, "y": 0.25, "zoom": 1.75 }
    },
    {
      "id": "market-stall",
      "caption": {
        "eyebrow": "East market",
        "title": "Trade at ground level",
        "body": "A wider rectangle preserves the relationship between the stall, the buyers, and the quay."
      },
      "region": {
        "type": "rect",
        "x": 0.39,
        "y": 0.73,
        "width": 0.25,
        "height": 0.16
      },
      "camera": { "x": 0.42, "y": 0.67, "zoom": 1.45 },
      "highlight": { "edge": "hard", "stroke": "solid", "strokeWidth": 0.004 }
    }
  ]
}
```

### Validation and semantic rules

Schema validation is necessary but not sufficient. The runtime must also reject duplicate step IDs; require `initialStepId` to reference an existing step; ensure that a rectangle remains within source bounds; ensure that a circle’s centre plus half-diameter does not extend outside the source; validate source image dimensions against decoded image dimensions when available; and ensure that every `sourceHref`, when supplied, uses an allowed protocol. If a camera is omitted, `deriveCamera(region, viewport)` centres the region, selects a configurable contextual zoom, and clamps the target. A `region.type: none` requires an explicit camera or uses a safe image-wide default.

The schema deliberately does not serialize raw CSS, JavaScript callbacks, or arbitrary easing strings. It uses bounded numbers and named easing presets so documents remain portable, secure, and independently renderable. The host can expose styling through CSS custom properties and component options, rather than embedding executable or browser-specific content into an editorial document.

## Markdown authoring path

After JSON support is stable, provide a build-time Markdown adapter. It should use YAML front matter for the root document fields and HTML comments containing JSON fragments for step metadata. A compiler transforms this authoring format into the canonical JSON document and reports line/column validation errors. The browser receives only validated JSON and rendered HTML; it does not parse arbitrary author Markdown on every user interaction.

```md
---
schemaVersion: "1.0"
id: harbour-morning
image:
  src: /images/harbour-3200.jpg
  intrinsicWidth: 3200
  intrinsicHeight: 2133
  alt: Fishing boats, a clock tower, and market stalls in a morning harbour
viewport:
  aspectRatio: 1.777778
  fit: cover
---

## The clock that organized the day
<!-- focus-story: {"id":"clock-tower","region":{"type":"circle","x":0.71,"y":0.18,"diameter":0.13},"camera":{"x":0.67,"y":0.25,"zoom":1.75}} -->

At six, the tower clock set the market and the first departures in motion.
```

The Markdown adapter is intentionally second. A GUI, a CMS plug-in, and an Astro content collection should all emit the same JSON contract, making JSON the dependable testing and interoperability surface.

## Public API and integration shape

The browser package should expose a small constructor and a narrow controller API.

```ts
const story = createFocusStory({
  trigger: document.querySelector('[data-focus-story="harbour-morning"]'),
  story: harbourMorning,
  modalShell: existingLightboxAdapter,
  motion: nativeMotionDriver,
  onEvent(event) {
    // Optional host-owned analytics or editorial instrumentation.
  }
});

story.open();
story.open("clock-tower");
story.close();
story.destroy();
```

The Astro wrapper should render the trigger, validated data, modal mount point, and progressive enhancement hook. It should not force a particular data-fetching model.

```astro
<FocusStory story={harbourMorning} client:load>
  <img src={thumbnail.src} alt={thumbnail.alt} />
</FocusStory>
```

For sites that already have `Lightbox.astro`, the initial integration is an adapter rather than a rewrite. The adapter converts the lightbox’s open/close events, backdrop, and focus-return behaviour into the modal-shell interface. A later refactor can move shared visual styles into a shared `OverlayShell.astro` only when both components demonstrably need them.

## Accessibility, resilience, and security requirements

The focus story must be accessible by keyboard, support a visible close control, and never trap a reader in an overlay without a way out. Native modal dialogs have platform support for modal focus and inert background content, but the integration must still test focus placement and restoration across the supported browsers.[1] The trigger must have an explicit accessible name such as “Explore image: A harbour wakes up,” and the stage must preserve the image alternative text rather than replacing it with unlabeled decoration.

Caption text is content, not a canvas. Render it as semantic headings, paragraphs, and links. If Markdown is accepted, sanitize it during build or at a trusted server boundary; never pass untrusted Markdown directly into `innerHTML`. The overlay needs a plain-text fallback when image loading fails. The source article image and its original caption should remain useful when JavaScript does not load or the modal is never activated.

Respect reduced motion in both CSS and JavaScript through `matchMedia('(prefers-reduced-motion: reduce)')`. The preference signals that a user wants non-essential motion reduced or replaced, and MDN specifically notes that scaling and panning can be problematic for affected readers.[2] [3]

## Test strategy and quality gates

| Layer | Required coverage | Acceptance condition |
|---|---|---|
| Pure unit tests | JSON validation, default merging, camera derivation, coordinate conversion, clamping, region-bound rules | Every wide, tall, edge, and small-region fixture produces an in-bounds camera transform. |
| Component tests | Modal open/close, focus restoration, controls, keyboard actions, progression state | No keyboard path leaves focus lost or prevents exit. |
| Browser integration | Desktop, narrow mobile, landscape phone, zoomed page, reduced motion, slow image loading | The stage remains stable and captions remain readable in every fixture. |
| Visual regression | Screenshot fixtures for circle, square, rectangle, hard and soft treatment, edge targets | Image/highlight registration stays exact after styling changes. |
| Accessibility audit | Automated checks plus manual screen-reader pass | Dialog name, close control, heading order, active-step semantics, and keyboard operation are confirmed. |
| Performance review | Image decode before first camera motion, passive caption scroll, frame-batched visual writes | Scrolling does not trigger uncontrolled layout thrash or long scripting tasks. |

## Delivery roadmap

| Phase | Deliverable | Exit criteria |
|---|---|---|
| 0. Contract validation | Three real editorial fixtures: a landscape photo, a panorama, and a portrait image; final visual language | Editors agree that the chosen region/camera data is sufficiently expressive. |
| 1. Core prototype | Framework-free runtime with one modal shell adapter, JSON validation, native pan/zoom, circle/rect focus, caption scrolling, and responsive layout | It recreates the intended reading flow without GSAP and passes basic keyboard/reduced-motion tests. |
| 2. Astro integration | `FocusStory.astro`, adapter for the existing `Lightbox.astro`, author examples, and article trigger pattern | It installs in the existing site without changing ordinary lightbox behaviour. |
| 3. Hardening | Schema fixtures, test suite, visual regressions, fallback treatments, image failure handling, documented browser support | The package is stable enough for an external alpha. |
| 4. Open-source release | Monorepo documentation site, vanilla/Astro examples, contribution guide, semantic versioning, issue templates, and changelog | An unfamiliar developer can install, validate, and publish a story independently. |
| 5. Authoring tools | Markdown compiler, schema-aware validation CLI, then click-to-place GUI with camera preview | The GUI writes canonical JSON and never bypasses the core validation path. |
| 6. Optional enhancement | GSAP motion adapter and documented choreography extension points | It remains fully optional and cannot create a separate content model. |

## Recommended next decision

Approve the following as the v1 product contract: **a modal single-image focus story; normalized source coordinates; `none`/circle/rectangle regions; optional camera override; a JSON-first authoring model; native motion by default; an Astro wrapper built around a `Lightbox.astro` shell adapter; and the GUI deferred until three real stories confirm the contract.**

That decision clears the way to begin Phase 0 with real images and captions, which is the most effective way to expose any missing fields before the JSON schema becomes a public promise.

## References

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog "MDN: `<dialog>` HTML element"

[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion "MDN: `prefers-reduced-motion` CSS media feature"

[3]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform "MDN: `transform` CSS property"
