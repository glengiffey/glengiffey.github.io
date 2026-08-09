# glengiffey.github.io

Personal site for Glen Giffey, served by GitHub Pages at
<https://glengiffey.github.io>.

## Contents

- `index.html`, `index.css` - landing page: background, skills, experience,
  education and links.
- `reflective-teapot.html` - an interactive WebGL demo: a brass teapot that
  reflects a cube-mapped environment. See `README.txt` for the controls.
- `code07.js` - scene setup, geometry, textures and the interaction handlers
  for the teapot demo.
- `shaders_setup.js` - shader compilation and program linking.
- `glMatrix-0.9.5.min.js` - matrix and vector math.
- `teapot.json` - teapot mesh, `brick.png` - surface texture,
  `pos*.jpg` / `neg*.jpg` - the six cube map faces.

## Running locally

The teapot demo fetches `teapot.json` over XHR, so it needs to be served over
HTTP rather than opened from the filesystem:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.
