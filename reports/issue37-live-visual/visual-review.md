# Live six-page visual check

2026-10-02, after public v9 appeared. Automated report: `report.json`.

20 checks passed: exact published CSS/runtime SHA-256, six approved poster SHA-256 values, and six routes at 390px/1440px with one exact player, no provider request before Play, no horizontal overflow, Close removal and restored focus. Twelve screenshots captured.

Actually opened and visually reviewed these six screenshots, covering every target route and both viewport classes:

- `chromium-home-en-1440.png`
- `chromium-home-ru-390.png`
- `chromium-services-en-390.png`
- `chromium-services-ru-1440.png`
- `chromium-homeopathy-en-390.png`
- `chromium-homeopathy-ru-1440.png`

Observed: local poster visible, small lower-left Play control, duration badge and transcript/fallback readable. About bridge remains visible outside the transcript in both languages, between the relevant studies and Tantric workshops. No visible player clipping or horizontal overflow in the reviewed captures.

Provider iframe responses were intercepted only for these control tests. This report does not establish real playback, audio, watch-page availability or a native browser zoom check. Production was not mutated. Anonymous tests explicitly requested English browser locale and cleared remembered locale before each exact URL; default system-language negotiation had redirected `/` to `/ru/` during initial test setup.
