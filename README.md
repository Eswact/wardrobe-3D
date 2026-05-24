# Wardrobe 3D

An interactive 3D wardrobe visualizer built with Three.js. The wardrobe structure is defined in an XML file and rendered with PBR materials, animated doors/drawers, and orbit controls.

> Click a door to open · Drag to orbit · Scroll to zoom

## Features

- **XML-driven scene** — geometry, colors, and animation parameters declared in `cubes.xml`
- **PBR materials** — wood, lacquered panels, metal handles, walls, and floor
- **Animated doors & drawers** — swing, fold-down, and sliding drawers via Tween.js
- **Orbit controls** — drag, zoom, with damping and polar-angle limits
- **Shadows & tone mapping** — PCFSoft shadows, ACES filmic tone mapping

## Tech Stack

- [Three.js](https://threejs.org/) r152
- [Tween.js](https://github.com/tweenjs/tween.js) 18.6.4
- Vanilla JS ES modules — no bundler required
