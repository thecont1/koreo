# koreo viewer verification

The article homepage was opened after the viewer redesign. Its source image and separate Koreo tab remain present. The first activation attempt did not visibly open the overlay, but clicking the image successfully launched the viewer.

The desktop overlay now shows only “koreo viewer,” an icon-only cross close control, the enlarged image stage, caption beats, and previous/next controls. The live-demonstration/progress header metadata, coordinate and fixed-window overlays, and the lower Field Manual specimen bar are absent. The portrait stage uses the available viewer height while the caption rail stays alongside it.

The icon-only cross was clicked in the browser and closed the viewer cleanly, returning to the article. The mobile viewer uses the same minimal header and an expanded, vertically sized portrait stage through its responsive layout rules.

After the enhancement, the open viewer exposes a dark-surface default with icon-only controls for switching to the light surface, entering fullscreen, and closing. The image stage and caption rail remain the dominant visual elements.

Browser checks confirmed that the surface control changed its accessible label to “Switch to dark viewer surface” after applying the light theme. The fullscreen control entered browser fullscreen and changed to “Exit fullscreen.” The next control then advanced the active caption and camera focus to the red-crags beat, exercising the new active-caption transition.
