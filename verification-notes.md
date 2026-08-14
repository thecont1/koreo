# koreo live reader verification notes

The updated preview opens successfully at the koreo Field Manual page. The specimen trigger is exposed as an accessible button labelled “Try koreo reader on the harbor specimen”. The first click scrolled the trigger into view; the second click opened the reader overlay.

The open overlay renders a dark modal field with a fixed image stage, a camera coordinate readout, a highlight region, a semantic caption rail, previous/next controls, a close button, and keyboard guidance. The browser content extraction exposes the live modal dialog content, including all three caption beats and the close/previous/next controls.

The caption rail scroll check moved the modal from beat 01 to beat 02 and updated the camera readout from `x 50 / y 52 / z 1.00` to `x 70 / y 28 / z 1.48`. The Next control moved to beat 03 and updated the camera to `x 36 / y 70 / z 1.25`. Escape closed the reader and returned the page to its underlying specimen view.

Remaining check: verify the mobile overlay layout, then run the final build and checkpoint.
