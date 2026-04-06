# SVG Wave Generator

A premium, interactive browser-based tool to generate beautiful, customizable, and animated SVG waves out-of-the-box. Built with strictly vanilla HTML, CSS, and JavaScript, WaveGen produces highly optimized SVG structures that require exactly **zero** JavaScript in your final exported code.

## 🚀 Live Demo

**[Play with the tool here!](https://thekitchen-agency.github.io/SVG-Wave-Gen/)**

## Features

- **Dynamic Output**: View HTML and CSS code instantly as you configure the wave.
- **Copy-Paste Ready**: Output is scoped with `.wave-wrap` so you can inject it effortlessly into any project workflow.
- **Pure SVG Animation**: Wave morphing and horizontal translation are powered by `animateTransform` and `animate d="..."` to ensure the smoothest performance with zero JavaScript dependency.
- **Premium Aesthetics**: Generate stacked, parallax layers with built-in gradient mapping and harmonic offsets.

## Usage Guide

1. Open the [Live Demo](https://thekitchen-agency.github.io/SVG-Wave-Gen/) or open `index.html` locally in your web browser.
2. Adjust the aesthetics under **Geometric Properties** and **Appearance** (support for colors, wave count, height, and variance).
3. Fine-tune your desired motion under **Animation Behavior**. You can set slide speeds, deformation intensities, and even multi-layer parallax desyncing.
4. If you want a brand new geometric base shape, hit the **"⟳ Shuffle"** button!
5. Click **Copy HTML** and **Copy CSS** directly from the UI and paste them into your project!

## Architecture Highlights

- No external libraries (No React, Vue, etc). Only Vanilla DOM interactions.
- Random Number Generation is deterministic (seeded), so toggling settings preserves your carefully tuned layout until you explicitly "Shuffle" the seed.
- Exported animations use pure-SVG SMIL (`animate` and `animateTransform`) ensuring absolute pixel accuracy and complete independence from browser CSS-pixel rendering discrepancies.

## License

MIT License
