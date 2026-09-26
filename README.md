# p5js-solar-system

An animated, labeled portrait of the Solar System built with p5.js. It uses a 1200 × 800 canvas and includes the eight planets, their major satellites, the asteroid and Kuiper belts, and five dwarf planets.

## Run locally

From this directory, start a small web server on a less commonly used port:

```sh
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765) in a browser. If port `8765` is already occupied, replace it in both the command and URL with another port such as `9321`.

The p5.js canvas has a fixed internal resolution of 1200 × 800 and scales to fit its container with CSS.

## Controls

- **Orbit speed slider** — set motion from stopped to 3× speed
- **Label size slider** — scale all moving captions
- **Space** — pause or resume the animation
- **L** — hide or show labels

The orbital sizes, planet sizes, and speeds are stylized rather than scientifically proportional so every object remains visible.
