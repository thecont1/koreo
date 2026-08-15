# koreo live reader verification notes

The updated preview opens successfully at the koreo Field Manual page. The specimen trigger is exposed as an accessible button labelled “Try koreo reader on the harbor specimen”. The first click scrolled the trigger into view; the second click opened the reader overlay.

The open overlay renders a dark modal field with a fixed image stage, a camera coordinate readout, a highlight region, a semantic caption rail, previous/next controls, a close button, and keyboard guidance. The browser content extraction exposes the live modal dialog content, including all three caption beats and the close/previous/next controls.

The caption rail scroll check moved the modal from beat 01 to beat 02 and updated the camera readout from `x 50 / y 52 / z 1.00` to `x 70 / y 28 / z 1.48`. The Next control moved to beat 03 and updated the camera to `x 36 / y 70 / z 1.25`. Escape closed the reader and returned the page to its underlying specimen view.

Remaining check: verify the mobile overlay layout, then run the final build and checkpoint.

## 2026-08-15 — Edge Fill and Scroll Boundaries

The 3:4 Humahuaca viewer was inspected on a desktop viewport. The photograph reaches the stage edges without an intervening inset or stage border. Scrolling the caption rail to the lower boundary activated beat 06, “Layers tilted into the distance,” and scrolling it back to the upper boundary restored beat 01, “A valley shaped by passage.”

The 4:3 Field Manual viewer was also inspected on desktop. Its camera plane was measured beyond all four stage edges during the overview state, confirming full image coverage after camera motion. Scrolling its caption rail to the bottom activated beat 03, “Let context stay in frame,” and returning it to the top restored beat 01, “Start with the whole frame.”

## 2026-08-15 — Fifth Beat, Zoom, and Centering Revision

The Humahuaca viewer’s caption rail now contains all six semantic beats plus a dedicated trailing scroll region. After a natural downward caption-rail scroll, beat 05, “The channel between rains,” visibly became the active caption, with beat 06 remaining inactive beneath it. The viewer stage column reports centered alignment.

The fifth beat successfully advanced to beat 06, “Layers tilted into the distance,” through the existing Next control. The stage and column measurements showed equal left and right space around the portrait window, confirming centered placement. The Humahuaca story retains the existing per-beat `zoom` parameters, revised to a calmer range of 1.18–1.30 for focused beats.

The 4:3 Field Manual specimen was also measured after the global centering change. Its stage column had 124.33px of left margin and 124.34px of right margin around the image window, confirming centered placement for landscape viewer windows as well.

## 2026-08-15 — Settled Beat Transitions

Scroll-derived candidates now wait 220ms before activating. In the Humahuaca viewer, a programmatic caption-rail move retained “A valley shaped by passage” at 80ms and changed to “Muted green-gray weathering” only after the settling interval elapsed. The header renders “koreo viewer by mahesh shantaram.”

## 2026-08-15 — GitHub Identity Link

The viewer header now renders the supplied GitHub mark immediately after “koreo viewer by mahesh shantaram.” The complete compact identity is one accessible link to `https://github.com/thecont1/koreo`, and the mark inherits the active viewer-surface color for both dark and light modes.

## 2026-08-15 — Original Image Mode and Persistent Preferences

The former browser-fullscreen button now activates a container-preserving image-only mode. It hides the caption rail, progress, focus marker, vignette, header identity, and other non-essential controls while retaining an exit control and close button. The complete Humahuaca photo measured at its native 4:3 ratio within the fixed viewer stage using `object-fit: contain`.

Viewer preferences are stored under the site-local `koreo.viewer-preferences.v1` key. Both image-only mode and the light surface persisted after closing and reopening the reader during browser verification.

## 2026-08-15 — Zero-Crop Original Image Correction

Original-image mode now renders the source photo outside the transformed camera plane. Its measured rendered ratio is 1.3333, exactly matching the image’s natural 4:3 ratio, with `object-fit: contain`. The remaining return-to-reading and close controls remain at the viewer header’s right edge; their action group sits within 16px of the header’s right boundary.

## 2026-08-15 — Vite Preview Connection

The managed development server was restarted after a transient Vite HMR connection loss. The preview page reloaded successfully and the collected browser logs reported successive `[vite] connected.` messages with no repeat of the WebSocket failure after restart. The existing Vite configuration already allows the managed preview host, so no configuration override was necessary.

## 2026-08-15 — Height-Fit Original Image

Original-image mode now uses a full-stage image box with `object-fit: contain`, making its photo content height-limited for the 4:3 Humahuaca source. Browser inspection confirms that the image element reaches—but does not exceed—the stage bottom. The complete image frame, including the foreground at the bottom edge, is visible with neutral side margins rather than any crop.

## 2026-08-15 — Authored Caption Stops Only

The artificial caption-rail tail and its scroll-snap behavior were removed. The rail now contains exactly six `.reader-caption-step` elements, one for each authored Humahuaca beat, with no extra tail node and no snap-aligned child targets. The six labels are overview, red crags, dark slopes, pale bank, dry channel, and background ridges.

## 2026-08-15 — Deterministic Authored-Beat Progression

The caption rail now maps a scroll position only to one of its authored step indices. A large scroll from beat 01 to the bottom held the overview at 350ms, then activated beat 02, beat 03, beat 04, beat 05, and beat 06 sequentially; no state outside the six configured captions was reached. Each step waits 680ms before the next transition, and the camera transform animates over 720ms.

## 2026-08-15 — Manual Navigation Lock

Manual Previous and Next actions now set a short scroll-activation lock while their caption alignment scroll completes. A sequential manual navigation test moved through overview, red crags, dark slopes, and pale bank; after the lock expired, pale bank remained active instead of being reversed by the deferred scroll callback.

## 2026-08-15 — Paced Reader Refinements

Continued scrolling now queues the next authored beat rather than interrupting the present one. In a continuous-scroll test, beat 02 remained active at 500ms, changed to beat 03 after the 1,000ms dwell, and changed to beat 04 only after another full dwell. Arrow-key navigation now resolves from the current ref-backed beat and uses the same lock as the visible Previous and Next controls. Camera and focus transitions use an 860ms ease-in-out curve, while active caption content has a 2px leading rule, low-contrast backing tint, soft shadow, and entrance motion.

## 2026-08-15 — Koreo Authoring Helper

The `/author` helper now provides source metadata, image-file loading, reader window ratio selection, click-to-place normalized coordinates, per-beat caption/focus/camera controls, add/remove beats, JSON preview, clipboard copy, and JSON download. Browser verification placed an overview coordinate at 0.5 / 0.5, added a third beat, copied the generated document, and parsed its JSON successfully with schema version 1.0 and three unique step identifiers.

## 2026-08-15 — Centred Reader and Refined Authoring Controls

The koreo caption rail now considers a middle beat eligible only when the centre of that caption reaches the vertical centre of the scroll rail. Explicit top and bottom checks preserve the first and final beats. The outer dashed focus ring was removed; the focus treatment is now its single solid boundary.

The authoring helper now supports 16:9, 4:3, 3:2, 1:1, 3:4, and 2:3 stage ratios. The camera zoom range visibly scales the preview and writes the same value to JSON; a 2.00× preview showed the expected enlarged camera frame. The stage supports drag panning at zoom, confirmed by a transform change from `translate3d(0px, 0px, 0px) scale(2)` to `translate3d(42px, 26px, 0px) scale(2)`. The new 5×5 palette includes a custom hex field, verified at `#0f6b78`.

## 2026-08-15 — Naming Cleanup

Visible navigation now links the article directly to Authoring Studio. The authoring page header reads “koreo Authoring Studio,” its return link reads “koreo demo,” the guide is available at `/guide`, and public source plus metadata contain no Field Manual wording.

## 2026-08-15 — Viewport-Bound Authoring Studio

At a 1280 × 720 desktop viewport, the Authoring Studio reports zero pixels below the viewport: source controls, the fit-to-height image stage, beat editor, export controls, and active accent trigger are all visible without page scrolling. The canonical JSON panel was removed while copy and download remain available in the beats column. The accent palette opens only from the active-colour trigger; selecting `#b4513d` updated the active beat and closed the popover. Type checking and production build pass.

## 2026-08-15 — Ratio-Driven Studio Stage Correction

The stage previously received the invalid CSS value `3:4`, which browsers ignored. The Studio now converts the contract to valid CSS ratio syntax and constrains every stage to the available image row using container-relative dimensions. Direct measurements confirmed `3:4` renders at 575 × 766 (0.750), `16:9` at 575 × 323 (1.778), and `1:1` at 575 × 575 (1.000); all fit inside the workspace. Type checking and production build pass.

## 2026-08-15 — Cursor-Centred Focus Geometry

The Studio now maps each region from the transformed image frame rather than the reader-window percentage box. A deliberate 16:9 click produced a target at 742 × 582 and a white focus-dot centre at the same 742 × 582 coordinate. Focus choices are now None, Circle, and Square only. In 16:9, the active circle measured 92 × 92 with a 1.000 rendered ratio; the square measured 92 × 92 at landscape and 184 × 184 at portrait, both with a zero-radius corner. Type checking and production build pass.

## 2026-08-15 — Save and Load Story Files

The Studio now places Copy, Load, and Save together in the beats panel. The visible interface refers only to story files. Save created `untitled-photo-story.koreo.json`; loading that file restored its source metadata, two beats, reader-window ratio, focus settings, and accent values, then provided a transient “Loaded” confirmation. The import path validates the document structure before applying changes, and type checking plus production build pass.

## 2026-08-15 — Wide-Image Pan Repair

The Studio now renders the cover-sized source image at its true transformed dimensions instead of scaling a viewport-sized image. An ultra-wide 4:1 fixture rendered at 3064px within a 575px portrait stage and travelled from `translate3d(-2489.7px, 0px, 0px)` to `translate3d(0px, 0px, 0px)`, reaching both horizontal edges. The stage cursor reports `grabbing` during drag and returns to `grab` afterward. Switching the fixture to a 16:9 reader window clamps the old offset to a fully covered frame (1293px source width across a 575px stage), preventing a blank stage. Type checking and production build pass.

## 2026-08-15 — Compact Image Action

The source-image action now reads “Load Image.” Its inline-flex layout and no-wrap text rule keep the control on one line beside the source dimensions in the compact Studio panel. Type checking and production build pass.

## 2026-08-15 — Reader-Window Preset Order

The visible Authoring Studio reader-window sequence is now 1:1, 3:2, 2:3, 4:3, 3:4, and 16:9. The local browser inspection confirmed that exact ordering, and type checking plus production build pass.

## 2026-08-15 — Repository Streamlining

The repository was audited at 102 tracked files. The active application directly used only 13 of the generated UI primitives, leaving 41 unreferenced template UI files, two unreferenced template components, one unused client constant, and 12 superseded one-off verification notes. Those files were removed; the running `verification-notes.md` remains as the single current verification record and Git history preserves the prior notes. Unused runtime and development packages were also pruned, reducing the manifest to 18 runtime and 14 development dependencies. A full type check, production build, and screenshots of `/`, `/guide`, and `/author` passed after the cleanup.

## 2026-08-15 — Cinque Terre Reader Specimen

The new `/cinque-terre` route uses the supplied ultra-wide Cinque Terre photograph and six authored story beats. It opens directly into the 3:2 koreo reader with the full overview, then transitions via the supplied sea, shops, fishing village, pastel houses, and food readings. The source image was confirmed at 2048 × 706, the first manual Next action advanced cleanly to the sea focus, and the desktop reader screenshot confirms the image stage, caption rail, and progress control render as intended. Type checking and production build pass.

## 2026-08-15 — Wide Reader and Focus Contract Correction

The Cinque Terre route now begins as an uncluttered page view; only its source image and koreo tab open the reader. In the landscape reader, captions are arranged as a horizontally scrollable row beneath the stage, and a standard mouse wheel advances that row horizontally. The reader now positions a source-sized image frame before applying the camera transform, so Studio-normalized coordinates remain faithful: the sea beat at x 7 / y 45 measured at x 167.1 / y 273.6 within its 2386.8 × 607.9 rendered source frame. Circle and Square are the only rendered focus shapes; the sea region measured 334.14 × 334.14 with ratio 1.000, while a migrated Humahuaca Square measured 391.18 × 391.18 with zero-radius corners. Type checking and production build pass.

## 2026-08-15 — Lazy Routes, Browser Tests, and Presentation Script

Top-level routes now use React lazy loading with a short accessible fallback. The production build emits separate chunks for the primary route modules: Humahuaca (10.46KB), Cinque Terre (4.62KB), Authoring Studio (67.19KB), Home guide (90.41KB), and KoreoReaderModal (20.18KB), so those modules are requested only when their corresponding routes need them. Playwright smoke tests cover `/`, `/guide`, `/author`, and `/cinque-terre`; reader tests cover opening from an article, ArrowRight and End progression, Escape close with focus return, and landscape Home/Arrow navigation. All six Chromium tests pass. PRESENTATION-SCRIPT.md provides a timed ten-slide narrative on the problem, reader behavior, coordinate model, Studio, architecture, quality, and roadmap. Type checking, production build, and screenshot checks of all public routes pass.
