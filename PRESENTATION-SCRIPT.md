# koreo: Presentation Script

**Format:** 10 slides · approximately 12 minutes  
**Audience:** Editorial, product, design, and engineering teams  
**Presenter:** Mahesh Shantaram

## Slide 1 — The premise

**On screen:** A strong single photograph with the line: *One image. Many deliberate readings.*

**Say:** “A photograph can contain a landscape, a history, a piece of evidence, and a dozen small decisions about where we should look. Yet the conventional caption gives us one fixed block of text outside the image. koreo is a guided reader for photographs with more than one story to tell. It opens only when a reader chooses to look closer, then moves deliberately through author-selected details.”

**Transition:** “This is not a slideshow, and it is not an image with a collection of pins pasted on top.”

## Slide 2 — The reader’s problem

**On screen:** A quiet article photograph and its small koreo tab.

**Say:** “We begin with a principle: photographs are sacred. On the article page, the image is undisturbed. There are no intrusive overlay controls competing with its composition. A reader can click the image or the compact koreo tab below it. Only then do we enter a dedicated reading space.”

**Transition:** “That separation gives koreo two distinct modes: the page and the reader.”

## Slide 3 — The reader experience

**On screen:** The portrait viewer screenshot with camera stage and captions.

**Say:** “Inside the reader, every beat has a point of attention, a camera scale, a caption, and an optional focus region. The view settles on one authored beat at a time. Readers can move through the sequence by scroll, buttons, or keyboard, while the interface makes it clear where they are in the story.”

**Emphasize:** “The reader never invents transitional beats. It advances only through the author’s actual sequence.”

## Slide 4 — Orientation follows the photograph

**On screen:** A simple side-by-side: portrait image with right-side captions; wide image with captions below.

**Say:** “koreo’s layout follows the window the author chooses. Portrait windows put captions on the right, keeping vertical photography large. Wide windows put captions in a horizontal rail beneath the image, preserving the breadth of panoramic work. A square is treated as its own bounded reading surface.”

**Transition:** “This is not merely responsive styling; it is an editorial decision encoded in the story.”

## Slide 5 — The key technical idea: source-relative coordinates

**On screen:** Diagram: Source image → source frame → camera stage → focus point.

**Say:** “The core technical challenge is coordinate fidelity. An author does not place a point in a browser crop; they place it in the original photograph. koreo stores focal locations as normalized coordinates relative to the source image. The reader first builds the source frame that covers its window, then applies the camera transform. That order means an authored point remains correct when the window changes from portrait to landscape.”

**Emphasize:** “The Studio and the reader share this same transform model.”

## Slide 6 — Circles and squares, never accidental shapes

**On screen:** Circle and Square examples over a detail.

**Say:** “A focus region is intentionally simple: None, Circle, or Square. We removed rectangles and ovals because they undermine visual meaning when a frame changes shape. The implementation renders both dimensions from a single source-frame size, so a circle stays round and a square stays square at every reader ratio.”

## Slide 7 — Authoring Studio

**On screen:** The Studio screenshot.

**Say:** “The Authoring Studio puts source information, image framing, and beat editing in one desktop workspace. Load a photograph, choose a reading window, click to place the selected focus point, drag to pan a wide source, set zoom, write the caption, choose Circle or Square, and save the story. The white dot follows the exact click position, so the author can trust what they are placing.”

**Transition:** “The Studio is not a separate visual mock-up. It previews the same geometry used by the reader.”

## Slide 8 — Architecture

**On screen:**

```text
Article page
   │ click image / koreo tab
   ▼
koreo reader modal
   ├── source-frame geometry
   ├── camera + focus rendering
   ├── caption state machine
   └── accessibility + preferences
   ▲
   │ portable story document
Authoring Studio
```

**Say:** “The architecture has three clean layers. Article pages own their page-level editorial context. The reader owns the guided interaction. The Studio creates a portable story document that passes image metadata, beats, coordinates, camera settings, focus geometry, and accents into the reader. The current reference implementation is React and TypeScript, but the data contract is intentionally independent of the view framework.”

## Slide 9 — Quality, accessibility, and performance

**On screen:** Three columns titled Accessible, Deliberate, Fast.

**Say:** “koreo treats interaction quality as core behavior. The reader is a semantic dialog; focus enters the reader and returns to the original trigger. Arrow keys, Home, End, and Escape work predictably. Reduced-motion preferences are respected. Reader preferences persist locally. And now, route-level lazy loading splits the large application so the initial article does not pay for the Studio and documentation routes before they are requested.”

**Add:** “Automated smoke tests protect every public route, while browser tests cover opening the reader, keyboard movement, and returning focus.”

## Slide 10 — What comes next

**On screen:** *A better way to read a photograph.*

**Say:** “The reference implementation proves the reading model. The next phase is to extract a framework-agnostic package, publish the story schema, add direct links to individual beats, and provide a simple vanilla JavaScript activation path. The long-term goal is modest but meaningful: make it easy for any publisher, educator, or storyteller to give a complicated photograph the attention it deserves.”

**Close:** “koreo does not add more to an image. It helps a reader see what is already there.”

## Presenter Notes

| Moment | Guidance |
| --- | --- |
| Live demo | Start on the quiet page, open koreo from the photograph, advance one beat by keyboard, then show original-image mode. |
| Studio demo | Switch between 3:4 and 16:9, click a focal point, then drag a wide source to demonstrate shared geometry. |
| Questions | Return to the architecture diagram. It explains the separation between the page, reader, and Studio clearly. |
| Timing | Spend most time on Slides 3, 5, and 7; move quickly through the close and roadmap. |
