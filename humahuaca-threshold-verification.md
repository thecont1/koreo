# Humahuaca viewport-threshold verification

The scrolly controller now holds the opening overview state until the story section reaches the activation line: 72px below the viewport top on desktop and 28px on mobile. Once the story enters that zone, the sentinel midpoint drives the active caption and the sticky stage stays aligned to the same visual margin.

Desktop and mobile screenshots show the image entering with deliberate whitespace above it rather than snapping immediately at the viewport edge. The article remains a normal page scroll, and the initial `01 / 06` caption is visible before the first geology transition.
