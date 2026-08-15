# Humahuaca scrollytelling verification

The article now renders one vertically cropped image in a generous sticky stage and one caption panel at a time. The first state is the supplied intro caption, labelled `01 / 06`; page-level scrolling transitions the panel to the five geology beats.

Browser verification on the article route confirmed that a normal page scroll—not an inner caption rail—changed the active state from `01 / 06` overview to `02 / 06` red crags while the image remained in place and its focus treatment moved. The mobile CSS uses the same page-level scroll contract, with a full-width cropped image and the caption below it.
