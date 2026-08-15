# koreo Field Manual — Design Direction

## Three directions considered

### Theme Name: Field Manual
Very Brief Intro: A warm, paper-and-ink documentation system that treats the implementation plan like an illustrated field manual: annotations, specimen cards, coordinate grids, and generous margins. It should feel practical, collected, and made for people who build things with care.
Probability: 0.07

### Theme Name: Signal Room
Very Brief Intro: A dark, cinematic control room for a motion system, using deep ink surfaces, amber status lights, and moving focus lines. It would foreground the “camera” metaphor and make the guide feel like an instrument panel for a visual engine.
Probability: 0.03

### Theme Name: Quiet Index
Very Brief Intro: A restrained museum-catalogue aesthetic with cream stock, fine rules, serif typography, and small index labels. It would frame the guide as an archival object: calm, exact, and highly legible.
Probability: 0.09

## Chosen direction: Field Manual

### Design Movement
Contemporary editorial field guide with influences from Swiss information design, printed technical manuals, and museum accession cards.

### Core Principles
1. **The margin is a tool.** Navigation, metadata, and small coordinate labels live in the margins so the main prose can breathe.
2. **Every abstraction gets a visible specimen.** Architecture, state, and schema are represented with compact diagrams, code fragments, and interactive examples.
3. **Warm material, precise structure.** A tactile paper surface and ink palette are paired with strict baselines, rules, and consistent measurements.
4. **Motion explains rather than decorates.** Transitions should feel like a camera settling on a region of an image, not like a generic app animation.

### Color Philosophy
The base is a warm mineral paper (#f3efe6) with charcoal ink (#1b1b18), giving the guide the quiet authority of a printed manual. Oxide red (#b4513d) marks decisions and active states. Cobalt (#225ea8) signals links, implementation details, and “move here” affordances. A muted saffron (#d49b43) is reserved for coordinates, specimen labels, and small moments of emphasis. The palette is deliberately ownable and low-saturation so code and diagrams remain calm.

### Layout Paradigm
Use an asymmetric documentation rail: a narrow, sticky chapter index at left, an expansive reading column in the middle, and a rotating “specimen” or status margin on the right. On small screens, the rail becomes a horizontal index strip and the right margin folds into in-content callouts. Avoid a centered marketing hero; begin with a left-aligned title block and a live coordinate specimen that demonstrates the product premise.

### Signature Elements
1. A thin red “focus line” that travels from section headings into diagrams and specimen cards.
2. Coordinate chips using a compact monospace face, styled like labels on a contact sheet.
3. A persistent “current section” marker that behaves like a physical index tab rather than a pill badge.

### Interaction Philosophy
Interactions should reveal structure. Hovering or focusing a region highlights its corresponding coordinate chip; selecting a roadmap item updates the live progress marker; expanding details should feel like opening a drawer in a field kit. Keyboard paths are first-class and never depend on hover. Every interactive transition is short, deliberate, and reversible.

### Animation
Use 180–260ms transitions for controls and 420–680ms camera-like movement for the main specimen. Entrance motion is a small translate plus opacity reveal, never a scale-from-zero effect. The live image specimen should ease between focus points with a slight settle, while the reading column stays steady. All non-essential motion is disabled or reduced behind `prefers-reduced-motion`.

### Typography System
Use **Fraunces** for display headings and chapter titles, **Source Sans 3** for body copy, and **IBM Plex Mono** for coordinates, schema keys, timestamps, and labels. Headlines use tight tracking and generous line-height contrast; body copy remains between 58–72 characters per line. Monospace text is never used for paragraphs.

### Brand Essence
The koreo living guide is a visual systems manual for editors and engineers who want to turn one image into a guided narrative; it is different because it makes the camera model and authoring contract visible while keeping the experience calm. Personality: **observant, exacting, generous**.

### Brand Voice
Headlines are declarative and slightly editorial. CTAs are verbs that describe the next act of making, not generic product language. Microcopy is concise, candid, and specific.

Example lines:

> One image. Many deliberate readings.

> Mark the point. Set the frame. Let the story move.

### Wordmark & Logo
The mark is a small offset crosshair nested inside a cropped rectangular frame: one red quadrant, three charcoal quadrants, suggesting a focus target inside a view window. The wordmark is simply “koreo” in a custom editorial lockup: Fraunces for the lowercase wordmark, with a small monospace accession line that makes the identity feel like a named instrument rather than a generic software label.

### Signature Brand Color
**Oxide Red — `#b4513d`**. It is warm enough to belong to paper and ink, but vivid enough to behave as a precise active-state signal.

## Style Decisions

- The page is a living guide, not a generic SaaS landing page.
- The left rail is the primary navigation on desktop; the content is intentionally asymmetric.
- The live specimen demonstrates the camera/region relationship before asking the reader to understand the implementation details.
- Rounded cards are used sparingly; ruled panels, index tabs, and material contrast carry the hierarchy.
- The visual system must remain legible in screenshots and on small screens; no interaction depends on hover alone.
