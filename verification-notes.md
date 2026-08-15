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
