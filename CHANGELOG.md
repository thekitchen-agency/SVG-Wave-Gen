# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-06

### Added
- **Core Generator**: Bezier-curve based SVG wave rendering.
- **Interactive UI**: Built a premium, glassmorphic sidebar layout.
- **Parametric Setup**: Added controls for Waves Count, Complexity, Variability, Amplitude, and Fill Types (solid vs gradient).
- **Animation Suite**:
  - Implemented continuous Horizontal Translation natively inside SVG (`animateTransform`).
  - Added organic path morphing ("Deform Shape") using SMIL (`<animate attributeName="d">`).
- **Advanced Animation Controls**:
  - Deform Intensity slider (determines morph strength).
  - Deform Keyframes slider (determines interpolation steps).
  - Desync Layers toggle (randomly offsets speeds for natural fluidity).
- **Determinism**: Replaced unseeded `Math.random()` with a Mulberry32 PRNG to maintain consistent waves throughout parameter tweaks. Includes a "Shuffle" button for deliberate regeneration.
- **Export Framework**: Real-time generation of scoped, raw HTML and CSS outputs with syntax highlighting, wrapped in `.wave-wrap` for safe copy-pasting.
- **Tooltips**: Helpful UI hover interactions on advanced controls.
